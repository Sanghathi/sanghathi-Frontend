import { useState, useEffect } from "react";
import {
  Box,
  Card,
  Stack,
  TextField,
  Typography,
  Button,
  Alert,
  useTheme,
} from "@mui/material";
import { useSnackbar } from "notistack";
import api from "../../utils/axios";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const { user } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const colorMode = isLight ? 'primary' : 'info';
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    // Check if token exists
    const token = localStorage.getItem("token");
    if (!token) {
      enqueueSnackbar("Please log in to access this page", { variant: "error" });
      navigate("/login");
    }
  }, [navigate, enqueueSnackbar]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match");
      setLoading(false);
      return;
    }

    try {
      // Get the token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You are not logged in. Please log in again.");
        enqueueSnackbar("You are not logged in. Please log in again.", { variant: "error" });
        navigate("/login");
        return;
      }

      const response = await api.post("/users/reset-password", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        passwordConfirm: formData.confirmPassword,
        userId: user._id,
      });

      if (response.data.status === "success") {
        setSuccess("Password updated successfully");
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        enqueueSnackbar("Password updated successfully", { variant: "success" });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password");
      enqueueSnackbar(err.response?.data?.message || "Failed to update password", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom color={colorMode}>
        Settings
      </Typography>

      <Card sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
        <Typography variant="h6" gutterBottom>
          Change Password
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {error && (
              <Alert severity="error" onClose={() => setError("")}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" onClose={() => setSuccess("")}>
                {success}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Current Password"
              name="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={handleChange}
              required
              color={colorMode}
            />

            <TextField
              fullWidth
              label="New Password"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              required
              color={colorMode}
            />

            <TextField
              fullWidth
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              color={colorMode}
            />

            <Button
              type="submit"
              variant="contained"
              color={colorMode}
              size="large"
              disabled={loading}
            >
              Update Password
            </Button>
          </Stack>
        </form>
      </Card>
    </Box>
  );
} 