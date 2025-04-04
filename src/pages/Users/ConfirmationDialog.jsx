import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
  useTheme
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";

export default function ConfirmationDialog({
  title,
  message,
  open,
  onClose,
  onConfirm,
}) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pb: 1,
        }}
      >
        <WarningIcon sx={{ color: "error.main", mr: 1, fontSize: "2rem" }} />
        <Typography variant="h6">{title}</Typography>
      </Box>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color={isLight ? "primary" : "info"}>
          Cancel
        </Button>
        <Button onClick={onConfirm} color={isLight ? "primary" : "info"} autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
