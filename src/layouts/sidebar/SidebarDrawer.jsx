import { Box, Drawer, useTheme, useMediaQuery } from "@mui/material";

const SidebarDrawer = ({
  isSidebarOpen,
  setIsSidebarOpen,
  drawerWidth,
  children,
  onBackdropClick,
}) => {
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width : 600px)");

  return (
    <Drawer
      open={isSidebarOpen}
      onClose={() => setIsSidebarOpen(false)}
      variant={isNonMobile ? "persistent" : "temporary"}
      anchor="left"
      ModalProps={{
        keepMounted: true, // Better performance on mobile
        onBackdropClick: onBackdropClick || (() => setIsSidebarOpen(false)),
      }}
      sx={{
        flexShrink: 0,
        width: drawerWidth,
        boxShadow:
          theme.palette.mode === "light"
            ? "0 0 6px rgba(0, 0, 0, 0.1)"
            : "none",
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          borderRight: "1px dashed rgba(145, 158, 171, 0.2)",
          boxShadow:
            theme.palette.mode === "light"
              ? "0 0 6px rgba(0, 0, 0, 0.1)"
              : "none",
        },
      }}
    >
      {children}
    </Drawer>
  );
};

export default SidebarDrawer;
