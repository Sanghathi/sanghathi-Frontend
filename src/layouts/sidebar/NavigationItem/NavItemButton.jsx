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
  
  return (
    <ListItemButton
      onClick={onToggleDropdown}
      sx={{
        borderRadius: "8px",
        backgroundColor:
          active === lcText ? navButtonBackgroundColor : "transparent",
        color:
          active === lcText
            ? isLight ? theme.palette.primary.main : theme.palette.info.main
            : isLight 
              ? theme.palette.text.primary 
              : theme.palette.secondary[200],
        "&:hover": {
          backgroundColor: isLight 
            ? theme.palette.grey[200] 
            : theme.palette.secondary[400],
          color: isLight ? theme.palette.primary.main : theme.palette.info.main,
        },
      }}
    >
      <ListItemIcon
        sx={{
          ml: "1rem",
          color:
            active === lcText
              ? isLight ? theme.palette.primary.main : theme.palette.info.main
              : isLight 
                ? theme.palette.text.primary 
                : theme.palette.secondary[200],
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
                ? isLight ? theme.palette.primary.main : theme.palette.info.main
                : isLight 
                  ? theme.palette.text.primary 
                  : theme.palette.secondary[200],
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
