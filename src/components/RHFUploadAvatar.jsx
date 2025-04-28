import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, Avatar, CircularProgress } from '@mui/material';
import { useSnackbar } from 'notistack';
import axios from 'axios';

// Backend API configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function RHFUploadAvatar({ name, value, onChange, ...other }) {
  const { enqueueSnackbar } = useSnackbar();
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(value);

  useEffect(() => {
    // Update preview when value changes
    if (value) {
      setPreview(value);
    }
  }, [value]);

  const validateFile = (file) => {
    // Check file size (3MB max)
    if (file.size > 3 * 1024 * 1024) {
      enqueueSnackbar('File size is too large. Maximum size is 3MB', { variant: 'error' });
      return false;
    }
    
    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      enqueueSnackbar('Invalid file type. Only JPEG, PNG, and GIF are allowed', { variant: 'error' });
      return false;
    }
    
    return true;
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    console.log('Files dropped:', acceptedFiles);
    if (acceptedFiles.length === 0) {
      console.log('No files accepted');
      return;
    }
    
    const file = acceptedFiles[0];
    console.log('File to upload:', file.name, file.size, file.type);
    
    if (!validateFile(file)) {
      return;
    }

    try {
      // Show preview immediately
      const previewUrl = URL.createObjectURL(file);
      console.log('Preview URL created:', previewUrl);
      setPreview(previewUrl);
      
      // Start upload
      setIsUploading(true);
      
      // Use backend API for upload
      console.log('Uploading via backend API...');
      
      const formData = new FormData();
      formData.append('image', file);
      
      // Upload to backend API
      const response = await axios.post(`${API_URL}/v1/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      console.log('Upload response:', response.data);
      
      // Update with the image URL from response
      setIsUploading(false);
      onChange(response.data.imageUrl);
      enqueueSnackbar('Image uploaded successfully', { variant: 'success' });
    } catch (error) {
      console.error('Upload error:', error);
      setIsUploading(false);
      enqueueSnackbar('Failed to upload image: ' + (error.response?.data?.message || error.message || 'Unknown error'), { variant: 'error' });
    }
  }, [onChange, enqueueSnackbar]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/jpeg,image/jpg,image/png,image/gif',
    maxFiles: 1,
    maxSize: 3 * 1024 * 1024 // 3MB
  });

  return (
    <Box
      {...getRootProps()}
      sx={{
        width: 128,
        height: 128,
        margin: 'auto',
        borderRadius: '50%',
        padding: 1,
        border: '1px dashed rgba(145, 158, 171, 0.32)',
        ...(isDragActive && {
          opacity: 0.72,
          backgroundColor: 'action.hover'
        }),
        position: 'relative'
      }}
    >
      <input {...getInputProps()} />
      
      {isUploading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
            borderRadius: '50%',
            zIndex: 1
          }}
        >
          <CircularProgress color="primary" size={40} />
        </Box>
      )}
      
      {preview ? (
        <Avatar
          src={preview}
          sx={{
            width: '100%',
            height: '100%',
            cursor: 'pointer'
          }}
        />
      ) : (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            backgroundColor: 'background.neutral'
          }}
        >
          <Typography variant="body2" align="center">
            {isDragActive ? 'Drop image here' : 'Drag & drop or click to upload'}
          </Typography>
        </Box>
      )}
    </Box>
  );
} 