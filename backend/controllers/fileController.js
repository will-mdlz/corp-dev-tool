const excelParser = require('../services/excelParser');
const dataInserter = require('../services/dataInserter');

exports.uploadFile = async (req, res) => {
    try {
        const filePath = req.file.path; // Temporary path of uploaded file

        // Parse the Excel file
        const parsedData = await excelParser.parseExcelToObjects(filePath);

        // Insert the parsed data into the database
        await dataInserter.insertMetrics(parsedData);

        res.json({ success: true, message: 'File processed and data stored successfully.' });
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).json({ error: 'Failed to process file' });
    }
};