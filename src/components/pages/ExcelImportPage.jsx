import React, { useState } from 'react';
import { uploadFile } from '../excelfunctions/upload';
import { Box, Button, Typography, Paper } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import backgroundImage from '../../images/image2.jpg'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const ExcelImportPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadStatus('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('Please select a file first');
      return;
    }

    setIsUploading(true);
    try {
      await uploadFile(selectedFile);
      setUploadStatus('File uploaded successfully!');
      setSelectedFile(null);
    } catch (error) {
      setUploadStatus('Error uploading file. Please try again.');
      console.error('Upload error:', error);
    }
    setIsUploading(false);
  };

  return (
    <div style = {{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover', /* Adjust background size as needed */
      backgroundRepeat: 'no-repeat', /* Prevent image repetition */
    }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '80vh',
          padding: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            maxWidth: 600,
            width: '100%',
          }}
        >
          <Typography variant="h4" gutterBottom>
            Excel File Import
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Upload your Excel file to import data
          </Typography>

          <Button
            component="label"
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            sx={{ mb: 2 }}
          >
            Choose File
            <VisuallyHiddenInput
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileSelect}
            />
          </Button>

          {selectedFile && (
            <Typography variant="body2" sx={{ mb: 2 }}>
              Selected file: {selectedFile.name}
            </Typography>
          )}

          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            sx={{ mt: 2 }}
          >
            {isUploading ? 'Uploading...' : 'Upload File'}
          </Button>

          {uploadStatus && (
            <Typography
              variant="body2"
              color={uploadStatus.includes('Error') ? 'error' : 'success.main'}
              sx={{ mt: 2 }}
            >
              {uploadStatus}
            </Typography>
          )}
        </Paper>
      </Box>
      <div style={{flexGrow: 1, height: '30px'}}>

      </div>
    </div>
  );
};

export default ExcelImportPage; 