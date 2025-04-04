import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_API_URL;

const fetchStudentProfiles = async (userId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/student-profiles/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching student profile:", error);
    return null;
  }
};

const MenteesList = () => {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const { user } = useContext(AuthContext);
  const [mentees, setMentees] = useState([]);
  const [profiles, setProfiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setError("User not authenticated.");
      setLoading(false);
      return;
    }

    const fetchMentees = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/mentorship/${user._id}/mentees`
        );
        setMentees(response.data.mentees);
      } catch (err) {
        setError("No mentees found.");
      } finally {
        setLoading(false);
      }
    };

    fetchMentees();
  }, [user]);

  useEffect(() => {
    const fetchProfiles = async () => {
      const profileData = {};
      for (const mentee of mentees) {
        const data = await fetchStudentProfiles(mentee._id);
        if (data) {
          profileData[mentee._id] = data;
        }
      }
      setProfiles(profileData);
    };

    if (mentees.length > 0) {
      fetchProfiles();
    }
  }, [mentees]);

  if (loading) return <Typography>Loading mentees...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <TableContainer
      component={Paper}
      sx={{
        maxWidth: 900,
        margin: "auto",
        mt: 5,
        bgcolor: theme.palette.background.paper,
      }}
    >
      <Typography
        variant="h6"
        align="center"
        sx={{ 
          bgcolor: isLight ? theme.palette.primary.main : theme.palette.info.main, 
          color: theme.palette.primary.contrastText, 
          py: 2 
        }}
      >
        My Mentees
      </Typography>
      <Table>
        <TableHead sx={{ bgcolor: isLight ? theme.palette.grey[100] : "#2a2d32" }}>
          <TableRow>
            <TableCell sx={{ color: isLight ? theme.palette.text.primary : "white" }}>
              <b>Full Name</b>
            </TableCell>
            <TableCell sx={{ color: isLight ? theme.palette.text.primary : "white" }}>
              <b>Email</b>
            </TableCell>
            <TableCell sx={{ color: isLight ? theme.palette.text.primary : "white" }}>
              <b>Phone</b>
            </TableCell>
            <TableCell sx={{ color: isLight ? theme.palette.text.primary : "white" }}>
              <b>Department</b>
            </TableCell>
            <TableCell sx={{ color: isLight ? theme.palette.text.primary : "white" }}>
              <b>Semester</b>
            </TableCell>
            <TableCell sx={{ color: isLight ? theme.palette.text.primary : "white" }}>
              <b>Actions</b>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mentees.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ color: theme.palette.text.primary }}>
                No mentees allotted.
              </TableCell>
            </TableRow>
          ) : (
            mentees.map((mentee) => (
              <TableRow key={mentee._id} hover>
                <TableCell sx={{ color: theme.palette.text.primary }}>{mentee.name}</TableCell>
                <TableCell sx={{ color: theme.palette.text.primary }}>{mentee.email}</TableCell>
                <TableCell sx={{ color: theme.palette.text.primary }}>{mentee.phone}</TableCell>
                <TableCell sx={{ color: theme.palette.text.primary }}>
                  {profiles[mentee._id]?.department || "N/A"}
                </TableCell>
                <TableCell sx={{ color: theme.palette.text.primary }}>
                  {profiles[mentee._id]?.sem || "N/A"}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color={isLight ? "primary" : "info"}
                    onClick={() => navigate(`/faculty/mentee-profile/${mentee._id}`)}
                  >
                    Dashboard
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MenteesList;