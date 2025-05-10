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
  Tooltip,
} from "@mui/material";
import { AuthContext } from "../../context/AuthContext";
import useSettings from "../../hooks/useSettings";

const DashboardHeader = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const { onToggleMode } = useSettings();
  const navigate = useNavigate();

  const toggleThemeMode = () => {
    onToggleMode.toggleThemeMode();
  };

  return (
    <AppBar
      position="static"
      sx={{
        background: theme.palette.background.paper,
        boxShadow: isLight ? "0 1px 3px rgba(0,0,0,0.1)" : "0 1px 3px rgba(0,0,0,0.2)",
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* LEFT SIDE */}
        <FlexBetween gap="1.5rem">
          <IconButton 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            sx={{ color: theme.palette.text.primary }}
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
          <Tooltip title={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}>
            <IconButton 
              onClick={toggleThemeMode}
              sx={{ color: theme.palette.text.primary }}
            >
              {theme.palette.mode === "dark" ? (
                <DarkModeOutlined />
              ) : (
                <LightModeOutlined />
              )}
            </IconButton>
          </Tooltip>

          <NotificationsPopover />
          <AccountPopover />
        </FlexBetween>
      </Toolbar>
    </AppBar>
  );
};

export default DashboardHeader;
