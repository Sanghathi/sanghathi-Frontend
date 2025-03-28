import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import getNavConfig from "./NavConfig";
import SidebarDrawer from "./SidebarDrawer";
import NavItemsList from "./NavItemsList";
import FlexBetween from "../../components/FlexBetween";
import logo from "../../public/logo.png";
import { Box, IconButton, useTheme } from "@mui/material";
import { ChevronLeft } from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";

const Sidebar = ({
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile,
  onBackdropClick,
}) => {
  const { pathname } = useLocation();
  const [active, setActive] = useState("dashboard");
  const theme = useTheme();
  const { user } = useContext(AuthContext);

  const normalizeText = (text) => {
    return text.toLowerCase().replace(/[\s_-]/g, "");
  };

  useEffect(() => {
    if (pathname === "/") {
      setActive("dashboard");
    } else {
      setActive(normalizeText(pathname.substring(1)));
    }
  }, [pathname]);

  const navConfig = getNavConfig(user?.roleName);

  return (
    <Box component="nav">
      {isSidebarOpen && (
        <SidebarDrawer
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          drawerWidth={drawerWidth}
          onBackdropClick={onBackdropClick}
        >
          <Box display="flex" alignSelf="center">
            <img
              src={logo}
              alt="CMRIT Logo"
              width="100"
              style={{
                transform: "scale(2)",
                filter:
                  theme.palette.mode === "dark"
                    ? "invert(100%) hue-rotate(180deg)"
                    : "none",
              }}
            />
          </Box>
          <FlexBetween color={theme.palette.secondary.main}>
            {!isNonMobile && (
              <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                <ChevronLeft />
              </IconButton>
            )}
          </FlexBetween>
          <NavItemsList
            navConfig={navConfig}
            active={active}
            setActive={setActive}
          />
        </SidebarDrawer>
      )}
    </Box>
  );
};

export default Sidebar;
