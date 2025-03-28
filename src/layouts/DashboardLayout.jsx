import React, { useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar/Sidebar";
import DashboardHeader from "./header/DashboardHeader";

const DashboardLayout = () => {
  const isNonMobile = useMediaQuery("(min-width : 600px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(isNonMobile);

  const handleBackdropClick = () => {
    if (!isNonMobile) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <Box display={isNonMobile ? "flex" : "block"} width="100%" height="100%">
      <Sidebar
        isNonMobile={isNonMobile}
        drawerWidth="250px"
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        onBackdropClick={handleBackdropClick}
      />
      <Box flexGrow={1}>
        <DashboardHeader
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
