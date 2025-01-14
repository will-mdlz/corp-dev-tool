    //import { insertFileData } from '../../services/database';
import db from '../../services/tempdb';
const xlsx = require('xlsx');

const process1xCosts = (sheet) => {
    const YEAR_START_ROW = 67;  // Excel row 68 (0-based index)
    const YEAR_START_COL = 10;  // Column K
    const METRIC_COL_1 = 2;     // Column C
    const METRIC_COL_2 = 3;     // Column D
    
    const category = 'xcost'

    const values = [];
    const metadata = {
        category: category,
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

    const metrics = []
    const dead_metrics = []

    // Process each row after the year row
    for (let rowIndex = YEAR_START_ROW + 1; rowIndex < sheet.length; rowIndex++) {
        const row = sheet[rowIndex];
        if (!row) continue;

        // Get metric from either column
        const metric = row[METRIC_COL_1] || row[METRIC_COL_2];
        if (!metric) continue;  // Skip empty rows

        metrics.push(metric)

        // Process each year's data
        years.forEach((year, yearIndex) => {
            const valueIndex = YEAR_START_COL + yearIndex;
            const rawValue = row[valueIndex];
            
            if (rawValue !== undefined && rawValue !== null) {
                values.push({
                    category: category,
                    metric,
                    year,
                    value: cleanValue(rawValue),
                    isSubMetric: Boolean(row[METRIC_COL_2] && !row[METRIC_COL_1])
                });
            }
            else {
                if(!dead_metrics.includes(metric)) dead_metrics.push(metric)
            }
        });
    }

    metadata.totalMetrics = new Set(values.map(v => v.metric)).size;

    metadata.metrics = metrics;

    metadata.dead_metrics = dead_metrics;

    return {
        metadata,
        values,
        category
    };
};

const processProFormaPL = (sheet) => {
    return formatSheetData(sheet, 'proforma');
};

const processNWC = (sheet) => {
    const SECTION_COL = 0;
    const METRIC_COL_1 = 1;
    const METRIC_COL_2 = 2;
    const DATA_START_COL = 5;
    
    const category = 'nwc';

    let currentSection = null;
    let currentSubsection = null;
    const values = [];
    
    // Create metadata object
    const metadata = {
        category: category,
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
                    category: category,
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
        values,
        category
    };
};

const processDisSynergies = (sheet) => {
    return formatSheetData(sheet, 'dis');
};

const processTotalRevSyn = (sheet) => {
    return formatSheetData(sheet, 'rev');
};

const processTotalCostSyn = (sheet) => {
    return formatSheetData(sheet, 'cost');
};

const processTotalBase = (sheet) => {
    return formatSheetData(sheet, 'base');
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
    const METRIC_COL_3 = 3;
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

    let subcat = "";
    let subsubcat = "";

    let metrics = [];
    let truemetrics = [];

    for (let rowIndex = 6; rowIndex < sheet.length; rowIndex++) {
        const row = sheet[rowIndex];
        
        // Stop processing if we hit "Balance Sheet Assumptions"
        if (row[METRIC_COL_1] === "Balance Sheet Assumptions") break;
        
        // Skip Memo rows
        if (row[METRIC_COL_1] === "Memo:") continue;
        
        // Check if it's a main metric or a valid subcategory
        // const isValidRow = row[METRIC_COL_1] || 
        //                   (row[METRIC_COL_2] && VALID_SUBCATEGORIES.has(row[METRIC_COL_2]));
        
        const isValidRow = row[METRIC_COL_1] || row[METRIC_COL_2] || (row[METRIC_COL_3] && VALID_SUBCATEGORIES.has(subsubcat))

        if (!isValidRow) continue;
        
        // Get metric from either column 1 or 2
        let metric = row[METRIC_COL_1] || row[METRIC_COL_2] || row[METRIC_COL_3];

        metrics.push(metric)

        metric = row[METRIC_COL_3] ? subsubcat + " " + metric : (row[METRIC_COL_2] && !VALID_SUBCATEGORIES.has(row[METRIC_COL_2])) ? subcat + " " + metric : metric

        truemetrics.push(metric)

        if(row[METRIC_COL_1]) subcat = metric;

        if(row[METRIC_COL_2]) subsubcat = metric;

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
                    isSubcategory: row[METRIC_COL_1] ? false : row[METRIC_COL_2] ? subcat : subsubcat,
                });
            }
        }
    }
    
    // Update additional metadata
    metadata.yearRange = Array.from({ length: metadata.totalYears }, 
        (_, i) => metadata.startYear + i);
    metadata.sheetDimensions.dataCols = metadata.totalYears;
    
    metadata.metrics = metrics;
    metadata.truemetrics = truemetrics;

    return {
        metadata,
        values,
        category
    };
};

const processControlPanel = (sheet) => {
    const METRIC_COL = 0;      // Column A
    const VALUE_COL = 1;       // Column B
    const START_ROW = 2;       // Start from row 2 (index 1)
    const END_ROW = 25;        // Stop at row 25
    
    const category = 'control';

    const values = [];
    const metadata = {
        category: category,
        processedAt: new Date().toISOString()
    };

    values.push({
        category: category,
        metric: 'Project Name',
        value: sheet[0][0]
    })

    // Process each row up to END_ROW
    for (let rowIndex = START_ROW; rowIndex < Math.min(sheet.length, END_ROW); rowIndex++) {
        const row = sheet[rowIndex];
        if (!row || !row[METRIC_COL]) continue;

        const metric = row[METRIC_COL];
        const rawValue = row[VALUE_COL];
        
        if (rawValue !== undefined && rawValue !== null) {
            values.push({
                category: category,
                metric,
                // First metric (rowIndex === 1) keeps the string value, others are cleaned numbers
                value: rowIndex === START_ROW ? rawValue : cleanValue(rawValue)
            });
        }
    }

    let displays = []

    for(let i = 1; i < 5; i++) {
        displays.push([sheet[29][i], sheet[30][i]])
    }
    
    values.push({
        category: category,
        metric: 'Displays',
        value: displays
    })

    return {
        metadata,
        values,
        category
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

const processFile = async (binaryStr) => {
    try {
        const workbook = xlsx.read(binaryStr, { type: 'binary' });
        const sheetNames = workbook.SheetNames;
        let unused_sheets = [];
        let allValues = [];
        let allMetadata = {};

        sheetNames.forEach(sheetName => {
            const worksheet = workbook.Sheets[sheetName];
            const sheet = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
            
            let processedData;
            switch (sheetName) {
                case 'Control Panel and Data Tables':
                    processedData = processControlPanel(sheet);
                    break;
                case '1xCosts (USD)':
                    processedData = process1xCosts(sheet);
                    break;
                case 'ProFormaPL (USD)':
                    processedData = processProFormaPL(sheet);
                    break;
                case 'NWC (USD)':
                    processedData = processNWC(sheet);
                    break;
                case 'Dis-Synergies (USD)':
                    processedData = processDisSynergies(sheet);
                    break;
                case 'Total Rev Syn (USD)':
                    processedData = processTotalRevSyn(sheet);
                    break;
                case 'Total Cost Syn (USD)':
                    processedData = processTotalCostSyn(sheet);
                    break;
                case 'Total Base (USD)':
                    processedData = processTotalBase(sheet);
                    break;
                default:
                    unused_sheets.push(sheetName);
            }
            
            if (processedData) {
                allValues = [...allValues, ...processedData.values];
                allMetadata[processedData.category] = processedData.metadata;
            }
        });

        const result = {
            values: allValues,
            metadata: allMetadata
        };

        //console.log(result)
        db.setData(result);

        // const dbResult = await insertFileData(result);
        // console.log('Database insertion results:', dbResult);
        // return result;
    } catch (error) {
        console.error('Error processing file:', error);
        // You might want to show this error to the user
        throw error;
    }
};

