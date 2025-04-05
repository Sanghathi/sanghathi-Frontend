import PropTypes from "prop-types";
import { forwardRef } from "react";
import { useTheme } from "@mui/material/styles";
import { Avatar as MUIAvatar } from "@mui/material";

// ----------------------------------------------------------------------

const Avatar = forwardRef(
  ({ color = "default", children, sx, ...other }, ref) => {
    const theme = useTheme();
    const isLight = theme.palette.mode === 'light';
    
    // Map color to theme-appropriate color in dark mode
    const getThemeColor = (colorValue) => {
      if (theme.palette.mode === 'dark' && colorValue === 'primary') {
        return 'info';
      }
      return colorValue;
    };
    
    const mappedColor = getThemeColor(color);

    if (color === "default") {
      return (
        <MUIAvatar ref={ref} sx={sx} {...other}>
          {children}
        </MUIAvatar>
      );
    }

    return (
      <MUIAvatar
        ref={ref}
        sx={{
          fontWeight: theme.typography.fontWeightMedium,
          color: theme.palette[mappedColor].contrastText,
          backgroundColor: theme.palette[mappedColor].main,
          ...sx,
        }}
        {...other}
      >
        {children}
      </MUIAvatar>
    );
  }
);

Avatar.propTypes = {
  children: PropTypes.node,
  sx: PropTypes.object,
  color: PropTypes.oneOf([
    "default",
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
  ]),
};

export default Avatar;
