const xlsx = require('xlsx');

const process1xCosts = (sheet) => {
    const YEAR_START_ROW = 67;  // Excel row 68 (0-based index)
    const YEAR_START_COL = 10;  // Column K
    const METRIC_COL_1 = 2;     // Column C
    const METRIC_COL_2 = 3;     // Column D
    
    const values = [];
    const metadata = {
        category: '1xCosts',
        startYear: null,
        totalYears: 0,
        processedAt: new Date().toISOString()
    };

    // Get years from the special year row, removing the 'E' suffix
    const yearRow = sheet[YEAR_START_ROW];
    if (!yearRow) return { metadata, values };

    const years = [];
    for (let i = YEAR_START_COL; i < yearRow.length; i++) {
        const yearCell = yearRow[i];
        if (!yearCell) break;
        
        // Extract year by removing 'E' and converting to number
        const year = parseInt(yearCell.toString().replace('E', ''));
        if (!isNaN(year)) {
            years.push(year);
        }
    }

    metadata.startYear = years[0];
    metadata.totalYears = years.length;

    // Process each row after the year row
    for (let rowIndex = YEAR_START_ROW + 1; rowIndex < sheet.length; rowIndex++) {
        const row = sheet[rowIndex];
        if (!row) continue;

        // Get metric from either column
        const metric = row[METRIC_COL_1] || row[METRIC_COL_2];
        if (!metric) continue;  // Skip empty rows

        // Process each year's data
        years.forEach((year, yearIndex) => {
            const valueIndex = YEAR_START_COL + yearIndex;
            const rawValue = row[valueIndex];
            
            if (rawValue !== undefined && rawValue !== null) {
                values.push({
                    category: '1xCosts',
                    metric,
                    year,
                    value: cleanValue(rawValue),
                    isSubMetric: Boolean(row[METRIC_COL_2] && !row[METRIC_COL_1])
                });
            }
        });
    }

    metadata.totalMetrics = new Set(values.map(v => v.metric)).size;

    return {
        metadata,
        values
    };
};

const processProFormaPL = (sheet) => {
    return formatSheetData(sheet, 'ProForma');
};

const processNWC = (sheet) => {
    const SECTION_COL = 0;
    const METRIC_COL_1 = 1;
    const METRIC_COL_2 = 2;
    const DATA_START_COL = 5;
    
    let currentSection = null;
    let currentSubsection = null;
    const values = [];
    
    // Create metadata object
    const metadata = {
        category: 'NWC',
        startYear: null,
        totalYears: 0,
        sections: [],
        processedAt: new Date().toISOString()
    };
    
    // Get years from header row
    const yearRow = sheet[5];
    metadata.startYear = yearRow[DATA_START_COL];
    
    // Calculate total years
    for (let i = DATA_START_COL; i < yearRow.length; i++) {
        if (!yearRow[i]) break;
        metadata.totalYears++;
    }

    // Process rows starting after header
    for (let rowIndex = 6; rowIndex < sheet.length; rowIndex++) {
        const row = sheet[rowIndex];
        if (!row) continue;

        // Check if this is a section or subsection (in col 0 with no data)
        const isHeaderRow = row[SECTION_COL] && !row[DATA_START_COL];
        
        if (isHeaderRow) {
            // Check next row to determine if this is a section or subsection
            const nextRow = sheet[rowIndex + 1];
            const nextRowIsHeader = nextRow && nextRow[SECTION_COL] && !nextRow[DATA_START_COL];
            
            if (nextRowIsHeader) {
                // This is a section
                currentSection = row[SECTION_COL];
                metadata.sections.push({
                    name: currentSection,
                    subsections: []
                });
            } else {
                // This is a subsection
                currentSubsection = row[SECTION_COL];
                const currentSectionObj = metadata.sections[metadata.sections.length - 1];
                if (currentSectionObj) {
                    currentSectionObj.subsections.push(currentSubsection);
                }
            }
            continue;
        }

        // Process metric rows
        const metric = row[METRIC_COL_1] || row[METRIC_COL_2];
        if (!metric) continue;

        // Process each year's data
        for (let i = 0; i < metadata.totalYears; i++) {
            const yearIndex = DATA_START_COL + i;
            const year = metadata.startYear + i;
            const rawValue = row[yearIndex];
            
            if (rawValue !== undefined && rawValue !== null) {
                values.push({
                    category: 'NWC',
                    section: currentSection,
                    subsection: currentSubsection,
                    metric,
                    year,
                    value: cleanValue(rawValue),
                    isSubMetric: Boolean(row[METRIC_COL_2] && !row[METRIC_COL_1])
                });
            }
        }
    }

    return {
        metadata,
        values
    };
};

const processDisSynergies = (sheet) => {
    return formatSheetData(sheet, 'DisSyn');
};

const processTotalRevSyn = (sheet) => {
    return formatSheetData(sheet, 'RevSyn');
};

const processTotalCostSyn = (sheet) => {
    return formatSheetData(sheet, 'CostSyn');
};

const processTotalBase = (sheet) => {
    return formatSheetData(sheet, 'TotalBase');
};

const cleanValue = (value) => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
        // Remove any currency symbols, commas, etc.
        const cleaned = value.replace(/[$,]/g, '');
        const number = parseFloat(cleaned);
        return isNaN(number) ? 0 : number;
    }
    return 0;
};

const formatSheetData = (sheet, category) => {
    const values = [];
    const METRIC_COL_1 = 1;      // Main metrics in column B (index 1)
    const METRIC_COL_2 = 2;      // Subcategories in column C (index 2)
    const DATA_START_COL = 5;     // Data starts at column F (index 5)
    
    // Specific subcategories we want to include
    const VALID_SUBCATEGORIES = new Set(['Selling', 'G&A', 'Other']);
    
    // Create metadata object
    const metadata = {
        category,
        startYear: null,
        totalYears: 0,
        totalMetrics: 0,
        processedAt: new Date().toISOString(),
        yearRange: [],
        uniqueMetrics: new Set(),
        hasSubcategories: false,
        sheetDimensions: {
            rows: sheet.length,
            dataCols: 0
        }
    };
    
    // Get years from header row (row 6, index 5)
    const yearRow = sheet[5];
    metadata.startYear = yearRow[DATA_START_COL];
    
    // Calculate total years (stopping when we hit empty cell)
    for (let i = DATA_START_COL; i < yearRow.length; i++) {
        if (!yearRow[i]) break;
        metadata.totalYears++;
    }

    for (let rowIndex = 6; rowIndex < sheet.length; rowIndex++) {
        const row = sheet[rowIndex];
        
        // Stop processing if we hit "Balance Sheet Assumptions"
        if (row[METRIC_COL_1] === "Balance Sheet Assumptions") break;
        
        // Skip Memo rows
        if (row[METRIC_COL_1] === "Memo:") continue;
        
        // Check if it's a main metric or a valid subcategory
        const isValidRow = row[METRIC_COL_1] || 
                          (row[METRIC_COL_2] && VALID_SUBCATEGORIES.has(row[METRIC_COL_2]));
        
        if (!isValidRow) continue;
        
        // Get metric from either column 1 or 2
        const metric = row[METRIC_COL_1] || row[METRIC_COL_2];
        
        // Process each year's data up to totalYears
        for (let i = 0; i < metadata.totalYears; i++) {
            const yearIndex = DATA_START_COL + i;
            const year = metadata.startYear + i;
            const rawValue = row[yearIndex];
            
            if (rawValue !== undefined && rawValue !== null) {
                values.push({
                    category,
                    metric,
                    year,
                    value: cleanValue(rawValue),
                    isSubcategory: !row[METRIC_COL_1] && row[METRIC_COL_2]
                });
            }
        }
    }
    
    // Update additional metadata
    metadata.yearRange = Array.from({ length: metadata.totalYears }, 
        (_, i) => metadata.startYear + i);
    metadata.sheetDimensions.dataCols = metadata.totalYears;
    
    return {
        metadata,
        values
    };
};

export const uploadFile = (file) => {
    const reader = new FileReader();
    const fileExtension = file.name.split('.').pop().toLowerCase();
    

    if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        reader.onload = (e) => {
        const binaryStr = e.target.result;
        const data = processFile(binaryStr);
        console.log(data)
    };
    reader.readAsBinaryString(file); // Read file content as binary string for Excel files
    } else {
        console.warn('Unsupported file type. Please upload an Excel file.');
    }
}

const processFile = (binaryStr) => {
    const workbook = xlsx.read(binaryStr, { type: 'binary' });
    const sheetNames = workbook.SheetNames;
    let unused_sheets = []
    let allValues = [];
    let allMetadata = {};
    const sheetMetrics = new Set();
    const nwcMetrics = new Set();
    const costsMetrics = new Set();

    sheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        const sheet = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
        
        let processedData;
        switch (sheetName) {
            case '1xCosts (USD)':
                processedData = process1xCosts(sheet);
                collectMetrics(processedData, costsMetrics);
                break;
            case 'ProFormaPL (USD)':
                processedData = processProFormaPL(sheet);
                collectMetrics(processedData, sheetMetrics);
                break;
            case 'NWC (USD)':
                processedData = processNWC(sheet);
                collectMetrics(processedData, nwcMetrics);
                break;
            case 'Dis-Synergies (USD)':
                processedData = processDisSynergies(sheet);
                collectMetrics(processedData, sheetMetrics);
                break;
            case 'Total Rev Syn (USD)':
                processedData = processTotalRevSyn(sheet);
                collectMetrics(processedData, sheetMetrics);
                break;
            case 'Total Cost Syn (USD)':
                processedData = processTotalCostSyn(sheet);
                collectMetrics(processedData, sheetMetrics);
                break;
            case 'Total Base (USD)':
                processedData = processTotalBase(sheet);
                collectMetrics(processedData, sheetMetrics);
                break;
            default:
                unused_sheets.push(sheetName);
        }
        
        if (processedData) {
            allValues = [...allValues, ...processedData.values];
            allMetadata[sheetName] = processedData.metadata;
        }
    });

    console.log('Sheet Metadata:', allMetadata);
    console.log('All Sheet metrics:', Array.from(sheetMetrics));
    console.log('All NWC metrics:', Array.from(nwcMetrics));
    console.log('All Cost Metrics:', Array.from(costsMetrics));
    
    return {
        values: allValues,
        metadata: allMetadata
    };
};

// Helper function to collect metrics from a sheet
const collectMetrics = (processedData, metricsSet) => {
    Object.keys(processedData.values).forEach((key) => {
        const metric = processedData.values[key]["metric"];
        metricsSet.add(metric);
    })
};

