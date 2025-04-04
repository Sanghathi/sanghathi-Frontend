import { useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import {
  Box,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import { AuthContext } from "../../context/AuthContext";
const BASE_URL = import.meta.env.VITE_API_URL;

const FacultyProfileInfo = () => {
  const theme = useTheme(); // Use theme for consistent styling
  const { user } = useContext(AuthContext);
  const [mentorId, setMentorId] = useState("");
  const [facultyProfile, setFacultyProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const isLight = theme.palette.mode === "light";

  const fetchMentorId = useCallback(async () => {
    if (!user || !user._id) {
      console.error("User ID not found");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${BASE_URL}/mentorship/mentor/${user._id}`
      );
      const mentor = response.data?.mentor;

      if (mentor?._id) {
        setMentorId(mentor._id);
      } else {
        console.error("Mentor ID not found");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching mentor ID:", error);
      setLoading(false);
    }
  }, [user?._id]);

  const fetchFacultyProfile = useCallback(async () => {
    if (!mentorId) return;

    try {
      const response = await axios.get(
        `${BASE_URL}/faculty/profile/${mentorId}`
      );
      const faculty = response.data?.data?.facultyProfile;

      if (faculty) {
        setFacultyProfile({
          fullName: `${faculty.fullName.firstName} ${faculty.fullName.middleName || ' '} ${faculty.fullName.lastName || ' '}`,
          department: faculty.department,
          email: faculty.email,
          mobileNumber: faculty.mobileNumber,
          cabin: faculty.cabin,
        });
      } else {
        console.error("Faculty profile not found");
      }
    } catch (error) {
      console.error("Error fetching faculty profile:", error);
    } finally {
      setLoading(false);
    }
  }, [mentorId]);

  useEffect(() => {
    fetchMentorId();
  }, [fetchMentorId]);

  useEffect(() => {
    if (mentorId) {
      fetchFacultyProfile();
    }
  }, [mentorId, fetchFacultyProfile]);

  return (
    <Container
      maxWidth="xl"
      sx={{
        p: 8,
        backgroundColor: theme.palette.background.default, 
        color: theme.palette.text.primary, 
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h4"
        sx={{ textAlign: "center", mb: 3, color: theme.palette.text.primary }}
      >
        Mentor Details
      </Typography>
      {loading ? (
        <Typography variant="h6" sx={{ textAlign: "center", color: "#aaa" }}>
          Loading faculty profile...
        </Typography>
      ) : facultyProfile ? (
        <TableContainer
          component={Paper}
          sx={{
            maxWidth: 600,
            margin: "auto",
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper, 
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: isLight ? theme.palette.primary.main : theme.palette.info.main }}>
                <TableCell
                  colSpan={2}
                  sx={{
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                    color: "#fff",
                  }}
                >
                  Contact Mentor
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                { label: "Full Name", value: facultyProfile.fullName },
                { label: "Department", value: facultyProfile.department },
                { label: "Email", value: facultyProfile.email },
                { label: "Mobile Number", value: facultyProfile.mobileNumber },
                { label: "Cabin", value: facultyProfile.cabin },
              ].map((row, index) => (
                <TableRow key={index}>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: theme.palette.text.secondary,
                      borderBottom: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    {row.label}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: theme.palette.text.primary,
                      borderBottom: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    {row.value}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="h6" sx={{ textAlign: "center", color: "red" }}>
          No faculty profile found.
        </Typography>
      )}
    </Container>
  );
};

export default FacultyProfileInfo;
