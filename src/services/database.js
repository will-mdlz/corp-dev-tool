// Using IndexedDB instead of SQLite for browser compatibility
const DB_NAME = 'excel_data';
const DB_VERSION = 1;

const initializeDatabase = () => {
    return new Promise((resolve, reject) => {
        try {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = (event) => {
                console.error('Database error:', event.target.error);
                reject(new Error('Failed to open database'));
            };

            request.onsuccess = () => resolve(request.result);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                try {
                    // Create sheets store
                    if (!db.objectStoreNames.contains('sheets')) {
                        const sheetsStore = db.createObjectStore('sheets', { keyPath: 'name' });
                        sheetsStore.createIndex('category', 'category', { unique: false });
                    }

                    // Create metrics store
                    if (!db.objectStoreNames.contains('metrics')) {
                        const metricsStore = db.createObjectStore('metrics', { keyPath: 'id', autoIncrement: true });
                        metricsStore.createIndex('sheet_metric', ['sheet_name', 'metric_name'], { unique: true });
                        metricsStore.createIndex('sheet_name', 'sheet_name', { unique: false });
                    }

                    // Create values store
                    if (!db.objectStoreNames.contains('values')) {
                        const valuesStore = db.createObjectStore('values', { keyPath: 'id', autoIncrement: true });
                        valuesStore.createIndex('sheet_metric', ['sheet_name', 'metric_id'], { unique: false });
                        valuesStore.createIndex('year', 'year', { unique: false });
                    }
                } catch (error) {
                    console.error('Error during database upgrade:', error);
                    reject(error);
                }
            };
        } catch (error) {
            console.error('Error initializing database:', error);
            reject(error);
        }
    });
};

export const insertFileData = async (data) => {
    try {
        const db = await initializeDatabase();
        
        return new Promise((resolve, reject) => {
            try {
                const transaction = db.transaction(['sheets', 'metrics', 'values'], 'readwrite');
                
                transaction.onerror = (event) => {
                    console.error('Transaction error:', event.target.error);
                    reject(new Error('Transaction failed'));
                };
                
                // Clear existing data
                transaction.objectStore('values').clear();
                transaction.objectStore('metrics').clear();
                transaction.objectStore('sheets').clear();

                const sheetsStore = transaction.objectStore('sheets');
                const metricsStore = transaction.objectStore('metrics');
                const valuesStore = transaction.objectStore('values');

                // Insert sheets/metadata
                Object.entries(data.metadata).forEach(([sheetName, metadata]) => {
                    sheetsStore.add({
                        name: sheetName,
                        category: metadata.category,
                        start_year: metadata.startYear,
                        total_years: metadata.totalYears,
                        processed_at: metadata.processedAt
                    }).onerror = (event) => {
                        console.error('Error inserting sheet:', event.target.error);
                    };
                });

                // Track metrics insertion for values
                const metricPromises = [];

                data.values.forEach(value => {
                    const metricRequest = metricsStore.add({
                        sheet_name: value.sheetName,
                        metric_name: value.metric
                    });

                    metricRequest.onerror = (event) => {
                        console.error('Error inserting metric:', event.target.error);
                    };

                    metricPromises.push(new Promise((resolveMetric) => {
                        metricRequest.onsuccess = () => {
                            const metric_id = metricRequest.result;
                            const valueRequest = valuesStore.add({
                                sheet_name: value.sheetName,
                                metric_id,
                                year: value.year,
                                value: value.value,
                                is_submetric: value.isSubMetric ? 1 : 0
                            });

                            valueRequest.onerror = (event) => {
                                console.error('Error inserting value:', event.target.error);
                            };

                            valueRequest.onsuccess = () => resolveMetric();
                        };
                    }));
                });

                Promise.all(metricPromises)
                    .then(() => {
                        transaction.oncomplete = () => {
                            resolve({
                                insertedValues: data.values.length,
                                insertedSheets: Object.keys(data.metadata).length,
                                insertedMetrics: metricPromises.length
                            });
                        };
                    })
                    .catch(error => {
                        console.error('Error in metric promises:', error);
                        reject(error);
                    });

            } catch (error) {
                console.error('Error in transaction:', error);
                reject(error);
            }
        });
    } catch (error) {
        console.error('Error in insertFileData:', error);
        throw error;
    }
};

export const getValuesByCategory = async (category) => {
    try {
        const db = await initializeDatabase();
        
        return new Promise((resolve, reject) => {
            try {
                const transaction = db.transaction(['sheets', 'metrics', 'values'], 'readonly');
                const sheetsStore = transaction.objectStore('sheets');
                const sheetsIndex = sheetsStore.index('category');
                
                const results = [];
                
                sheetsIndex.openCursor(category).onsuccess = (event) => {
                    const cursor = event.target.result;
                    if (cursor) {
                        const sheetName = cursor.value.name;
                        const valuesStore = transaction.objectStore('values');
                        const valuesIndex = valuesStore.index('sheet_metric');
                        
                        valuesIndex.openCursor(IDBKeyRange.bound([sheetName, 0], [sheetName, Infinity]))
                            .onsuccess = (event) => {
                                const valuesCursor = event.target.result;
                                if (valuesCursor) {
                                    results.push(valuesCursor.value);
                                    valuesCursor.continue();
                                }
                            };
                        cursor.continue();
                    } else {
                        resolve(results);
                    }
                };

                transaction.onerror = (event) => {
                    console.error('Transaction error:', event.target.error);
                    reject(new Error('Failed to get values by category'));
                };

            } catch (error) {
                console.error('Error in getValuesByCategory transaction:', error);
                reject(error);
            }
        });
    } catch (error) {
        console.error('Error in getValuesByCategory:', error);
        throw error;
    }
};

// Add other query functions similarly...