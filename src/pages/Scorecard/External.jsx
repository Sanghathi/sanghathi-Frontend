import { useState, useEffect, useContext, useCallback } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useSearchParams } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_API_URL;

const External = () => {
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const menteeId = searchParams.get('menteeId');
  
  const [externalData, setExternalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [availableSemesters, setAvailableSemesters] = useState([1, 2, 3, 4, 5, 6, 7, 8]);

  // Get token from local storage - using "token" instead of "accessToken"
  const token = localStorage.getItem("token");

  const fetchExternalData = useCallback(async () => {
    // Use menteeId from URL params if available, otherwise use logged-in user ID
    const userId = menteeId || user?._id;
    
    if (!userId || !token) {
      setError("User not authenticated or mentee ID not provided.");
      setLoading(false);
      return;
    }

    try {
      console.log(`Fetching external marks for user ID: ${userId} (${menteeId ? 'menteeId from URL' : 'logged-in user'})`);
      
      const response = await axios.get(
        `${BASE_URL}/students/external/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      console.log("Response data:", response.data);
      
      if (response.data && response.data.data && response.data.data.external) {
        const data = response.data.data.external;
        if (data.semesters && data.semesters.length > 0) {
          setExternalData(data.semesters);
          setSelectedSemester(data.semesters[0].semester);
        } else {
          setExternalData([]);
          setSelectedSemester(1); // Default to first semester
        }
      } else {
        setExternalData([]);
        setSelectedSemester(1); // Default to first semester
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching external marks:", err);
      
      // For any error, including 404, just show an empty table
      setExternalData([]);
      setSelectedSemester(1); // Default to first semester
      setLoading(false);
    }
  }, [user, token, menteeId]);

  useEffect(() => {
    fetchExternalData();
  }, [fetchExternalData]);

  const handleSemesterChange = (event) => {
    setSelectedSemester(parseInt(event.target.value, 10));
  };

  const getSubjectsForSemester = () => {
    if (!selectedSemester) return [];
    const semesterData = externalData.find((s) => s.semester === selectedSemester);
    if (!semesterData) return [];

    const subjectsMap = new Map();
    semesterData.subjects.forEach((subject) => {
      subjectsMap.set(subject.subjectCode, subject);
    });
    return Array.from(subjectsMap.values());
  };

  // Get the CGPA for the current semester
  const getSemesterCGPA = () => {
    if (!selectedSemester) return null;
    const semesterData = externalData.find((s) => s.semester === selectedSemester);
    if (!semesterData || !semesterData.subjects || semesterData.subjects.length === 0) return null;
    
    // Get CGPA from the first subject that has it (assuming all subjects in a semester have the same CGPA)
    const subjectWithCGPA = semesterData.subjects.find(subject => subject.cgpa);
    return subjectWithCGPA ? subjectWithCGPA.cgpa : null;
  };

  const handleRefresh = () => {
    setLoading(true);
    setError("");
    fetchExternalData();
  };

  if (loading) {
    return (
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography color="error" gutterBottom>{error}</Typography>
        <Button variant="outlined" onClick={handleRefresh} sx={{ mt: 2 }}>
          Try Again
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        External Marks Report
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <label>
          Select Semester:
          <Select
            value={selectedSemester || 1}
            onChange={handleSemesterChange}
            sx={{ ml: 1 }}
          >
            {availableSemesters.map((sem) => (
              <MenuItem key={sem} value={sem}>
                Semester {sem}
              </MenuItem>
            ))}
          </Select>
        </label>
      </Box>

      <TableContainer sx={{ border: "1px solid gray" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ border: "1px solid gray", fontWeight: "bold" }}>
                Subject Code
              </TableCell>
              <TableCell sx={{ border: "1px solid gray", fontWeight: "bold" }}>
                Subject Name
              </TableCell>
              <TableCell sx={{ border: "1px solid gray", fontWeight: "bold" }}>
                Marks
              </TableCell>
              <TableCell sx={{ border: "1px solid gray", fontWeight: "bold" }}>
                Attempt
              </TableCell>
              <TableCell sx={{ border: "1px solid gray", fontWeight: "bold" }}>
                Result
              </TableCell>
              <TableCell sx={{ border: "1px solid gray", fontWeight: "bold" }}>
                Passing Date
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getSubjectsForSemester().length > 0 ? (
              getSubjectsForSemester().map((subject) => (
                <TableRow key={subject.subjectCode}>
                  <TableCell sx={{ border: "1px solid gray" }}>
                    {subject.subjectCode}
                  </TableCell>
                  <TableCell sx={{ border: "1px solid gray" }}>
                    {subject.subjectName}
                  </TableCell>
                  <TableCell sx={{ border: "1px solid gray" }}>
                    {subject.externalMarks || "-"}
                  </TableCell>
                  <TableCell sx={{ border: "1px solid gray" }}>
                    {subject.attempt || "1"}
                  </TableCell>
                  <TableCell sx={{ 
                    border: "1px solid gray",
                    color: subject.result === "PASS" ? "success.main" : "error.main",
                    fontWeight: "bold" 
                  }}>
                    {subject.result || "-"}
                  </TableCell>
                  <TableCell sx={{ border: "1px solid gray" }}>
                    {subject.passingDate || "-"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  No external marks data available for this semester.
                </TableCell>
              </TableRow>
            )}
            
            {/* CGPA Row - only show if there's data and a CGPA value */}
            {getSubjectsForSemester().length > 0 && getSemesterCGPA() && (
              <TableRow>
                <TableCell 
                  colSpan={6} 
                  align="center" 
                  sx={{ 
                    border: "1px solid gray", 
                    fontWeight: "bold",
                    bgcolor: "action.hover",
                    textAlign: "center"
                  }}
                >
                  SGPA: {getSemesterCGPA() || "-"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default External;