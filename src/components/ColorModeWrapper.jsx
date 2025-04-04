import React from 'react';
import { useTheme } from '@mui/material/styles';

/**
 * ColorModeWrapper - A utility component to apply different MUI colors based on theme mode
 * 
 * This component helps apply 'primary' color in light mode and 'info' color in dark mode
 * for any MUI component that accepts a color prop.
 * 
 * Usage example:
 * <ColorModeWrapper>
 *   {(colorProp) => <Button color={colorProp}>Click me</Button>}
 * </ColorModeWrapper>
 */
const ColorModeWrapper = ({ children, darkModeColor = 'info', lightModeColor = 'primary' }) => {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  
  // Determine the appropriate color based on the theme mode
  const color = isLight ? lightModeColor : darkModeColor;
  
  // Pass the color to the children function
  return children(color);
};

export default ColorModeWrapper; 