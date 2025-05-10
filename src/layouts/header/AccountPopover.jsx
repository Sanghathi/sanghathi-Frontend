import { useSnackbar } from "notistack";
import { useState, useContext } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
// @mui
import { alpha } from "@mui/material/styles";
import { Box, Divider, Typography, Stack, MenuItem } from "@mui/material";
// routes
// import { PATH_DASHBOARD, PATH_AUTH } from "../../../routes/paths";
// hooks
// import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from "../../hooks/useIsMountedRef";
// components
import MyAvatar from "../../components/MyAvatar";
import MenuPopover from "../../components/MenuPopover";
import IconButtonAnimate from "../../components/animate/IconButtonAnimate";
import { AuthContext } from "../../context/AuthContext";

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function AccountPopover() {
   const navigate = useNavigate();
  const { user, dispatch } = useContext(AuthContext); // Now user is available

  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(null);

  const studentlink = "/student/profile";
  const facultylink = "/faculty/FacultyProfile";
  const adminlink = "/admin/dashboard";

  const getprofileconfig = (role) => {
    switch (role) {
      case "admin":
        return adminlink;
      case "faculty":
        return facultylink;
      case "student":
        return studentlink;
      default:
        return null;
    }
  };

  const profile = getprofileconfig(user?.roleName); // ✅ safe now that user exists

  const MENU_OPTIONS = [
    {
      label: "Home",
      linkTo: "/admin/dashboard",
    },
    {
      label: "Profile",
      linkTo: profile,
    },
    {
      label: "Settings",
      linkTo: "/settings",
    },
  ];

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleLogout = async () => {
    try {
      dispatch({ type: "LOGOUT" });
      navigate("/login");

      if (isMountedRef.current) {
        handleClose();
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Unable to logout!", { variant: "error" });
    }
  };

  return (
    <>
      <IconButtonAnimate
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            "&:before": {
              zIndex: 1,
              content: "''",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              position: "absolute",
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <MyAvatar user={user} />
      </IconButtonAnimate>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          "& .MuiMenuItem-root": {
            typography: "body2",
            borderRadius: 0.75,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2">{user?.name}</Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {user?.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem
              key={option.label}
              to={option.linkTo}
              component={RouterLink}
              onClick={handleClose}
            >
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: "dashed" }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </MenuPopover>
    </>
  );
}
