import React, { useState } from 'react';
import { Button, Box, Typography } from '@mui/material';

/**
 * A styled file input component that looks like a button
 * and automatically handles file selection.
 */
const FileInput = ({ onFileSelect, accept = '.xlsx,.xls', className = '', style = {} }) => {
    const [fileName, setFileName] = useState('');
   
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
          setFileName(file.name); // Set the file name to display
          onFileSelect(file)
        }
      };

  const handleFileClick = () => {
    document.getElementById('file-input').click(); // Trigger file input
  };

  return (
    <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            border: '2px solid #ccc',
            borderRadius: '8px',
            p: 3,
            maxWidth: '300px',
            backgroundColor: '#f9f9f9',
        }}
        >
        <Typography
            variant="h6"
            sx={{
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 'bold',
            color: '#333',
            mb: 2,
            }}
        >
            Save / Upload
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%', mb: 1 }}>
            <Button variant="contained" onClick={handleFileClick} sx={{ minWidth: '100px' }}>
            Upload
            </Button>
        </Box>

        <input type="file" id="file-input" accept=".json, .xlsx, .xls" style={{ display: 'none' }} onChange={handleFileUpload} />

        {fileName && (
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1, fontStyle: 'italic' }}>
            Selected file: {fileName}
            </Typography>
        )}
        </Box>
  );
};

export default FileInput; 