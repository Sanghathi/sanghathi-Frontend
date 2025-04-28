import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, Avatar } from '@mui/material';
import { useSnackbar } from 'notistack';

export default function RHFUploadAvatar({ name, value, onChange, ...other }) {
  const { enqueueSnackbar } = useSnackbar();
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    // Update preview when value changes
    if (value) {
      // If it's a base64 string or Cloudinary URL, use it directly
      setPreview(value);
    }
  }, [value]);

  const validateFile = (file) => {
    if (!file) return false;

    if (file.size > 3 * 1024 * 1024) {
      enqueueSnackbar('File size is too large. Maximum size is 3MB', { variant: 'error' });
      return false;
    }
    
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      enqueueSnackbar('Invalid file type. Only JPEG, PNG, and GIF are allowed', { variant: 'error' });
      return false;
    }
    
    return true;
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    if (!acceptedFiles || acceptedFiles.length === 0) {
      console.log('No files accepted');
      return;
    }
    
    const file = acceptedFiles[0];
    
    if (!validateFile(file)) {
      return;
    }

    try {
      // Create a preview URL for display
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      
      // Convert file to base64
      const reader = new FileReader();
      
      reader.onload = async () => {
        try {
          const base64Data = reader.result;
          // Just pass the base64 data to parent component
          onChange(base64Data);
        } catch (error) {
          console.error('Error processing file:', error);
          enqueueSnackbar('Failed to process image', { variant: 'error' });
        }
      };

      reader.onerror = () => {
        enqueueSnackbar('Failed to read file', { variant: 'error' });
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing file:', error);
      enqueueSnackbar('Failed to process image', { variant: 'error' });
    }
  }, [onChange, enqueueSnackbar]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/jpeg, image/jpg, image/png, image/gif',
    maxFiles: 1,
    maxSize: 3 * 1024 * 1024 // 3MB
  });

  return (
    <Box
      {...getRootProps()}
      sx={{
        width: 144,
        height: 144,
        margin: 'auto',
        borderRadius: '50%',
        padding: 0.5,
        border: '1px dashed rgba(145, 158, 171, 0.32)',
        ...(isDragActive && {
          opacity: 0.72,
          backgroundColor: 'action.hover'
        }),
        position: 'relative',
        cursor: 'pointer'
      }}
    >
      <input {...getInputProps()} />
      
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
          <Typography variant="caption" align="center" sx={{ p: 1 }}>
            {isDragActive ? 'Drop image here' : 'Upload\nPhoto'}
          </Typography>
        </Box>
      )}
    </Box>
  );
} 