import PropTypes from "prop-types";
import { noCase } from "change-case";
import { useState } from "react";
// @mui
import {
  Box,
  List,
  Badge,
  Button,
  Tooltip,
  Divider,
  Typography,
  ListSubheader,
  useTheme,
} from "@mui/material";

import NotificationItem from "../../components/notification/NotificationItem";
// components
import Iconify from "../../components/Iconify";
import Scrollbar from "../../components/Scrollbar";
import MenuPopover from "../../components/MenuPopover";
import IconButtonAnimate from "../../components/animate/IconButtonAnimate";

import { useUnreadNotifications } from "../../hooks/useNotifications";

// ----------------------------------------------------------------------

export default function NotificationsPopover() {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const { unreadNotifications, markAllAsRead } = useUnreadNotifications();

  const totalUnRead = unreadNotifications.filter(
    (item) => item.isUnread === true
  ).length;

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  return (
    <>
      <IconButtonAnimate
        color={open ? (isLight ? "primary" : "info") : "default"}
        onClick={handleOpen}
        sx={{ 
          width: 40, 
          height: 40, 
          color: isLight && !open ? theme.palette.text.primary : undefined 
        }}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify icon="eva:bell-fill" width={20} height={20} />
        </Badge>
      </IconButtonAnimate>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{ width: 360, p: 0, mt: 1.5, ml: 0.75 }}
      >
        <Box sx={{ display: "flex", alignItems: "center", py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              You have {totalUnRead} unread messages
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title=" Mark all as read">
              <IconButtonAnimate color={isLight ? "primary" : "info"} onClick={markAllAsRead}>
                <Iconify icon="eva:done-all-fill" width={20} height={20} />
              </IconButtonAnimate>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

        <Scrollbar sx={{ height: { xs: 340, sm: "auto" } }}>
          <List
            disablePadding
            subheader={
              <ListSubheader
                disableSticky
                sx={{ 
                  py: 1, 
                  px: 2.5, 
                  typography: "overline",
                  color: theme.palette.text.secondary
                }}
              >
                New
              </ListSubheader>
            }
          >
            {unreadNotifications.slice(0, 2).map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
              />
            ))}
          </List>

          <List
            disablePadding
            subheader={
              <ListSubheader
                disableSticky
                sx={{ 
                  py: 1, 
                  px: 2.5, 
                  typography: "overline",
                  color: theme.palette.text.secondary 
                }}
              >
                Before that
              </ListSubheader>
            }
          ></List>
        </Scrollbar>

        <Divider sx={{ borderStyle: "dashed" }} />

        <Box sx={{ p: 1 }}>
          <Button fullWidth disableRipple>
            View All
          </Button>
        </Box>
      </MenuPopover>
    </>
  );
}
