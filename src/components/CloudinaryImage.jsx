import PropTypes from 'prop-types';
import { Image, Transformation } from 'cloudinary-react';

// Get cloud name from environment variables or use default
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dc5xtrpnm';

CloudinaryImage.propTypes = {
  publicId: PropTypes.string.isRequired,
  alt: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  crop: PropTypes.string,
  gravity: PropTypes.string,
  radius: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  quality: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  fetchFormat: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object
};

export default function CloudinaryImage({
  publicId,
  alt = '',
  width = 'auto',
  height = 'auto',
  crop = 'fill',
  gravity = 'auto',
  radius = 0,
  quality = 'auto',
  fetchFormat = 'auto',
  className,
  style,
  ...other
}) {
  // Extract public ID from full Cloudinary URL if needed
  const getPublicIdFromUrl = (url) => {
    if (!url || !url.includes('cloudinary.com')) return url;
    
    // Extract the path after the upload/ part
    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex === -1) return url;
    
    const pathAfterUpload = url.substring(uploadIndex + 8);
    
    // If there are transformations in the URL, they end with a /
    const transformEndIndex = pathAfterUpload.lastIndexOf('/');
    
    // Return the part without the file extension
    const fullPath = transformEndIndex === -1 
      ? pathAfterUpload 
      : pathAfterUpload.substring(transformEndIndex + 1);
      
    // Remove file extension if present
    const dotIndex = fullPath.lastIndexOf('.');
    return dotIndex === -1 ? fullPath : fullPath.substring(0, dotIndex);
  };

  const cleanPublicId = getPublicIdFromUrl(publicId);

  return (
    <Image 
      cloudName={CLOUD_NAME}
      publicId={cleanPublicId}
      alt={alt}
      className={className}
      style={style}
      {...other}
    >
      <Transformation width={width} height={height} crop={crop} gravity={gravity} />
      {radius > 0 && <Transformation radius={radius} />}
      <Transformation quality={quality} fetchFormat={fetchFormat} />
    </Image>
  );
} 