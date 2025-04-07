import { useState, useEffect, useContext } from "react";
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
  TextField,
  Typography, // For headings
} from "@mui/material";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useSearchParams } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_API_URL;

const Iat = () => {
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const menteeId = searchParams.get('menteeId');
  
  const [iatData, setIatData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSemester, setSelectedSemester] = useState(null);

  useEffect(() => {
    const fetchIatData = async () => {
      try {
        // Use menteeId from URL params if available, otherwise use logged-in user ID
        const userId = menteeId || user?._id;
        
        if (!userId) {
          setError("User not authenticated or mentee ID not provided.");
          setLoading(false);
          return;
        }
        
        console.log(`Fetching IAT marks for user ID: ${userId} (${menteeId ? 'menteeId from URL' : 'logged-in user'})`);
        
        //  Adapt the endpoint to your IAT data endpoint
        const response = await axios.get(
          `${BASE_URL}/students/iat/${userId}`, //  Replace with your actual endpoint
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
        const data = response.data.data.iat; // Adjust based on your API response structure

        if (data && data.semesters) {
          setIatData(data.semesters);
          if (data.semesters.length > 0) {
            setSelectedSemester(data.semesters[0].semester);
          }
        } else {
            setIatData([]);
        }

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch IAT data");
        setLoading(false);
        console.error(err); // Log the error for debugging
      }
    };

    fetchIatData();
  }, [user?._id, menteeId]);

  const handleSemesterChange = (event) => {
    setSelectedSemester(parseInt(event.target.value, 10));
  };

  const getSubjectsForSemester = () => {
    if (!selectedSemester) return [];
    const semesterData = iatData.find((s) => s.semester === selectedSemester);
    if (!semesterData) return [];

    const subjectsMap = new Map();
    semesterData.subjects.forEach((subject) => {
      subjectsMap.set(subject.subjectCode, subject);
    });
    return Array.from(subjectsMap.values());
  };

  //  Get IAT marks for a specific subject and IAT number
    const getIatMarks = (subjectCode, iatNumber) => {
        if (!selectedSemester) return "";
        const semesterData = iatData.find(s => s.semester === selectedSemester);
        if (!semesterData) return "";

        const subject = semesterData.subjects.find(s => s.subjectCode === subjectCode);
        if (!subject) return "";

        switch (iatNumber) {
            case 1: return subject.iat1 || ""; // Handle potential undefined/null
            case 2: return subject.iat2 || "";
            case 3: return subject.iat3 || "";
            default: return "";
        }
    };



  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        IAT Marks Report
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <label>
          Select Semester:
          <Select
            value={selectedSemester}
            onChange={handleSemesterChange}
            sx={{ ml: 1 }}
          >
            {iatData.map((sem) => (
              <MenuItem key={sem.semester} value={sem.semester}>
                Semester {sem.semester}
              </MenuItem>
            ))}
          </Select>
        </label>
      </Box>

      <TableContainer sx={{ border: "1px solid gray" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ border: "1px solid gray" }}>
                Subject Code
              </TableCell>
              <TableCell sx={{ border: "1px solid gray" }}>
                Subject Name
              </TableCell>
              <TableCell sx={{ border: "1px solid gray" }}>IAT 1</TableCell>
              <TableCell sx={{ border: "1px solid gray" }}>IAT 2</TableCell>
              <TableCell sx={{ border: "1px solid gray" }}>IAT 3</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getSubjectsForSemester().map((subject) => (
              <TableRow key={subject.subjectCode}>
                <TableCell sx={{ border: "1px solid gray" }}>
                  {subject.subjectCode}
                </TableCell>
                <TableCell sx={{ border: "1px solid gray" }}>
                  {subject.subjectName}
                </TableCell>
                <TableCell sx={{ border: "1px solid gray" }}>
                    {getIatMarks(subject.subjectCode, 1)}
                </TableCell>
                <TableCell sx={{ border: "1px solid gray" }}>
                    {getIatMarks(subject.subjectCode, 2)}
                </TableCell>
                <TableCell sx={{ border: "1px solid gray" }}>
                    {getIatMarks(subject.subjectCode, 3)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Iat;