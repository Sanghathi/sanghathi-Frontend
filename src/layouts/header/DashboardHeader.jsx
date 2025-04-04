import { useContext, createRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LightModeOutlined,
  DarkModeOutlined,
  Menu as MenuIcon,
  Search,
  SettingsOutlined,
  ArrowDropDownOutlined,
  NotificationsOutlined,
  PersonOutlined,
  LogoutOutlined,
} from "@mui/icons-material";
import { useState } from "react";
import AccountPopover from "./AccountPopover";
import NotificationsPopover from "./NotificationsPopover";
import FlexBetween from "../../components/FlexBetween";
import {
  AppBar,
  Button,
  Box,
  Typography,
  IconButton,
  InputBase,
  Toolbar,
  Menu,
  MenuItem,
  Divider,
  useTheme,
} from "@mui/material";
import { AuthContext } from "../../context/AuthContext";
import useSettings from "../../hooks/useSettings";

const DashboardHeader = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const { onToggleMode } = useSettings();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleThemeChange = (mode) => {
    onToggleMode.toggleThemeMode(mode);
    handleClose();
  };

  return (
    <AppBar
      position="static"
      sx={{
        background: isLight ? theme.palette.background.paper : "none",
        boxShadow: isLight ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
        borderBottom: isLight ? `1px solid ${theme.palette.divider}` : "none",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* LEFT SIDE */}
        <FlexBetween gap="1.5rem">
          <IconButton 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            sx={{ color: isLight ? theme.palette.text.primary : "inherit" }}
          >
            <MenuIcon />
          </IconButton>
          {/* Search Bar */}
          {/* <FlexBetween backgroundColor={theme.palette.background.alt} borderRadius="9px" gap="3rem" p="0.1rem 1.5rem">
            <InputBase placeholder="Search..." />
            <IconButton>
              <Search />
            </IconButton>
          </FlexBetween> */}
        </FlexBetween>

        {/* RIGHT SIDE */}
        <FlexBetween gap="1rem">
          <IconButton 
            onClick={handleClick}
            sx={{ color: isLight ? theme.palette.text.primary : "inherit" }}
          >
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlined />
            ) : (
              <LightModeOutlined />
            )}
          </IconButton>

          <NotificationsPopover />

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            sx={{
              "& .MuiMenuItem-root": {
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              },
            }}
          >
            <MenuItem onClick={() => handleThemeChange("light")}>
              <LightModeOutlined sx={{ marginRight: "16px", color: isLight ? theme.palette.primary.main : theme.palette.info.main }} />
              Light Mode
            </MenuItem>
            <MenuItem onClick={() => handleThemeChange("dark")}>
              <DarkModeOutlined sx={{ marginRight: "16px", color: isLight ? theme.palette.primary.main : theme.palette.info.main }} />
              Dark Mode
            </MenuItem>
            <MenuItem onClick={() => handleThemeChange("system")}>
              <SettingsOutlined sx={{ marginRight: "16px", color: isLight ? theme.palette.primary.main : theme.palette.info.main }} />
              System
            </MenuItem>
          </Menu>

          <AccountPopover />
        </FlexBetween>
      </Toolbar>
    </AppBar>
  );
};

export default DashboardHeader;
