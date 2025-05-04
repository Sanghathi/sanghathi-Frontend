import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import { Box, Stack, Typography } from '@mui/material';
import { AccountCircle as AccountCircleIcon } from '@mui/icons-material';
import { isString } from 'lodash';

UploadAvatar.propTypes = {
  error: PropTypes.bool,
  file: PropTypes.any,
  maxSize: PropTypes.number,
  onDrop: PropTypes.func,
  accept: PropTypes.string,
  helperText: PropTypes.node
};

export default function UploadAvatar({ error, file, maxSize, onDrop, accept, helperText, ...other }) {
  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    multiple: false,
    accept: accept ? { 'image/*': [] } : undefined,
    maxSize: maxSize,
    onDrop: onDrop,
    ...other
  });

  const isFileTooLarge = fileRejections.length > 0 && fileRejections[0].file.size > maxSize;

  const renderPreview = () => {
    if (isString(file) && file) {
      return (
        <Box
          sx={{
            width: 144,
            height: 144,
            borderRadius: '50%',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          <img
            src={file}
            alt="Avatar"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </Box>
      );
    }

    return (
      <Box
        sx={{
          width: 144,
          height: 144,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          bgcolor: 'background.neutral'
        }}
      >
        <AccountCircleIcon sx={{ width: 80, height: 80, color: 'text.secondary' }} />
      </Box>
    );
  };

  return (
    <>
      <Box sx={{ mb: 5 }}>
        {renderPreview()}
      </Box>

      <Box
        {...getRootProps()}
        sx={{
          p: 1,
          borderRadius: 1,
          border: (theme) => `1px dashed ${theme.palette.grey[500_32]}`,
          cursor: 'pointer',
          '&:hover': {
            opacity: 0.72
          }
        }}
      >
        <input {...getInputProps()} />
        <Stack spacing={1} alignItems="center">
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {isDragActive ? 'Drop the file here' : 'Drop or click to upload'}
          </Typography>
        </Stack>
      </Box>

      {error && (
        <Box sx={{ color: 'error.main', mt: 1 }}>
          {isFileTooLarge ? 'File is too large' : 'File type must be image/*'}
        </Box>
      )}
    </>
  );
}