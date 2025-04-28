import { useState, useEffect, useContext } from "react";
import { useSearchParams } from 'react-router-dom';
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
} from "@mui/material";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const BASE_URL = import.meta.env.VITE_API_URL;
const Attendance = () => {
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSemester, setSelectedSemester] = useState(null); // Initialize to null
  const [selectedMonth, setSelectedMonth] = useState(0); // 0 for "All"

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        // Get menteeId from URL params if viewing as faculty
        const menteeId = searchParams.get('menteeId') || user._id;
        
        console.log("Fetching attendance for ID:", menteeId); // Debug log
        
        const response = await axios.get(
          `${BASE_URL}/students/attendance/${menteeId}`
        );
        
        console.log("Attendance API response:", response.data); // Debug log
        
        const data = response.data.data.attendance;
        if (data && data.semesters) {
          setAttendanceData(data.semesters);
          if (data.semesters.length > 0) {
            setSelectedSemester(data.semesters[0].semester);
          }
        } else {
          setAttendanceData([]);
        }
        setLoading(false);
      } catch (err) {
        console.error("Attendance fetch error:", err); // Debug log
        setError("Failed to fetch attendance data");
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [user._id, searchParams]); // Add searchParams to dependencies

  // No need for transformBackendData in the old way

    const getCumulativeAttendance = (subjectName, semester) => {
        const semesterData = attendanceData.find(s => s.semester === semester);
        if (!semesterData) return "No Data";

        let totalAttended = 0;
        let totalTaken = 0;

        semesterData.months.forEach(monthData => {
            const sub = monthData.subjects.find(s => s.subjectName === subjectName);
            if (sub) {
                totalAttended += sub.attendedClasses;
                totalTaken += sub.totalClasses;
            }
        });

        if (totalTaken === 0) return "No Data";
        const percentage = ((totalAttended / totalTaken) * 100).toFixed(2);
        return `${totalAttended}/${totalTaken} (${percentage}%)`;
    };
    const getOverallAttendance = (semester) => {
        const semesterData = attendanceData.find(s => s.semester === semester);
        if (!semesterData) return "No Data";
        let totalAttended = 0;
        let totalTaken = 0;

        semesterData.months.forEach((monthData) => {
          monthData.subjects.forEach((subject) => {
            totalAttended += subject.attendedClasses;
            totalTaken += subject.totalClasses;
          });
        });
        if (totalTaken === 0) return "No Data";

        const percentage = ((totalAttended / totalTaken) * 100).toFixed(2);
        return `${totalAttended}/${totalTaken} (${percentage}%)`;
      };

  const getMonthAttendance = (subjectName, semester, month) => {
    if (month === 0) {
      // "All" months: show cumulative for the semester
      return getCumulativeAttendance(subjectName, semester);
    }

    const semesterData = attendanceData.find((s) => s.semester === semester);
    if (!semesterData) return "No Data";

    const monthData = semesterData.months.find((m) => m.month === month);
    if (!monthData) return "No Data";

    const subject = monthData.subjects.find((s) => s.subjectName === subjectName);
    if (!subject) return "No Data";

    const { attendedClasses, totalClasses } = subject;
    if (totalClasses === 0) return "No Data";
    const percentage = ((attendedClasses / totalClasses) * 100).toFixed(2);
    return `${attendedClasses}/${totalClasses} (${percentage}%)`;
  };

  const handleSemesterChange = (event) => {
    setSelectedSemester(parseInt(event.target.value, 10)); // Ensure it's a number
    setSelectedMonth(0); // Reset month selection
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(parseInt(event.target.value, 10)); // Ensure it's a number
  };

  const getAvailableMonths = () => {
    if (!selectedSemester) return []; // No semester selected
    const semesterData = attendanceData.find((s) => s.semester === selectedSemester);
    if (!semesterData) return []; // No data for the selected semester
    const months = semesterData.months.map((m) => m.month);
    return [0, ...months]; // Add 0 for "All"
  };

    // Helper function to get unique subjects for the selected semester
    const getSubjectsForSemester = () => {
        if (!selectedSemester) return [];
        const semesterData = attendanceData.find(s => s.semester === selectedSemester);
        if (!semesterData) return [];

        const subjectsMap = new Map(); // Use a Map to ensure uniqueness
        semesterData.months.forEach(monthData => {
            monthData.subjects.forEach(subject => {
                subjectsMap.set(subject.subjectName, {
                    subjectName: subject.subjectName,
                    subjectCode: subject.subjectCode || "N/A", // Ensure you have subjectCode in your model
                });
            });
        });

        return Array.from(subjectsMap.values());
    };

  return (
    <Box sx={{ p: 2 }}>
      <h1 sx={{ textAlign: "center", mb: 2 }}>Attendance Report</h1>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <label>
          Select Semester:
          <Select
            value={selectedSemester}
            onChange={handleSemesterChange}
            sx={{ ml: 1 }}
          >
            {attendanceData.map((sem) => (
              <MenuItem key={sem.semester} value={sem.semester}>
                Semester {sem.semester}
              </MenuItem>
            ))}
          </Select>
        </label>
        <Box sx={{ ml: 2 }}>
          <label>
            Select Month:
            <Select
              value={selectedMonth}
              onChange={handleMonthChange}
              sx={{ ml: 1 }}
            >
              {getAvailableMonths().map((month) => (
                <MenuItem key={month} value={month}>
                  {month === 0 ? "All" : `Month ${month}`}
                </MenuItem>
              ))}
            </Select>
          </label>
        </Box>
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
              <TableCell sx={{ border: "1px solid gray" }}>
                Attendance
              </TableCell>
              <TableCell sx={{ border: "1px solid gray" }}>
                Cumulative Attendance
              </TableCell>
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
                    {getMonthAttendance(subject.subjectName, selectedSemester, selectedMonth)}
                  </TableCell>
                  <TableCell sx={{ border: "1px solid gray" }}>
                    {getCumulativeAttendance(subject.subjectName, selectedSemester)}
                  </TableCell>
                </TableRow>
              ))}
            <TableRow sx={{ fontWeight: "bold" }}>
              <TableCell colSpan={2}>Overall Attendance</TableCell>
              <TableCell>
                {getOverallAttendance(selectedSemester)}
                <Box component="span" sx={{ ml: 1 }}>
                  (for selected semester)
                </Box>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Attendance;