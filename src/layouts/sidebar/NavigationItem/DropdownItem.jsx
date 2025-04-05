import {
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  ListItemIcon,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

const DropdownItem = ({ itemText, itemLink, icon, active, setActive }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const colorMode = isLight ? 'primary' : 'info';

  return (
    <ListItem key={itemText}>
      <ListItemButton
        onClick={() => {
          navigate(itemLink);
        }}
        sx={{
          borderRadius: "8px",
          backgroundColor: "transparent",
          color: theme.palette.text.secondary,
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
            color: theme.palette[colorMode].main,
          },
          "& .MuiListItemIcon-root": {
            minWidth: 0,
            marginRight: theme.spacing(1),
          },
        }}
      >
        <ListItemIcon>
          <FiberManualRecordIcon
            sx={{
              color:
                active === itemText.toLowerCase()
                  ? theme.palette[colorMode].main
                  : theme.palette.text.secondary,
              width: active === itemText.toLowerCase() ? "0.8rem" : "0.5rem",
            }}
          />
        </ListItemIcon>
        <ListItemText
          inset
          primary={
            <Typography
              sx={{
                fontSize: "0.8rem",
                fontWeight: theme.typography.body2.fontWeight,
                color: theme.palette.text.primary,
              }}
            >
              {itemText}
            </Typography>
          }
        />
      </ListItemButton>
    </ListItem>
  );
};

export default DropdownItem;
