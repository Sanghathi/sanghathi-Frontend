import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import CollapsibleIcon from "./CollapsibleIcon";

const NavItemButton = ({
  text,
  icon,
  lcText,
  theme,
  active,
  navButtonBackgroundColor,
  isDropdown,
  onToggleDropdown,
}) => {
  const isLight = theme.palette.mode === 'light';
  const colorMode = isLight ? 'primary' : 'info';
  
  return (
    <ListItemButton
      onClick={onToggleDropdown}
      sx={{
        borderRadius: "8px",
        backgroundColor:
          active === lcText 
            ? isLight 
              ? theme.palette.grey[100] 
              : theme.palette.action.selected
            : "transparent",
        color:
          active === lcText
            ? theme.palette[colorMode].main
            : theme.palette.text.primary,
        "&:hover": {
          backgroundColor: theme.palette.action.hover,
          color: theme.palette[colorMode].main,
        },
      }}
    >
      <ListItemIcon
        sx={{
          ml: "1rem",
          color:
            active === lcText
              ? theme.palette[colorMode].main
              : theme.palette.text.primary,
        }}
      >
        {icon}
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography
            sx={{
              fontSize: "0.9rem",
              fontWeight: active === lcText ? 600 : theme.typography.body2.fontWeight,
              color: active === lcText
                ? theme.palette[colorMode].main
                : theme.palette.text.primary,
            }}
          >
            {text}
          </Typography>
        }
      />
      {isDropdown && (
        <CollapsibleIcon
          isOpen={active === lcText}
          onClick={onToggleDropdown}
        />
      )}
    </ListItemButton>
  );
};

export default NavItemButton;
