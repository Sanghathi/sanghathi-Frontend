import { useState, useContext } from "react";
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Container,
  Stack,
  Divider,
} from "@mui/material";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import Papa from "papaparse";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { alpha, useTheme } from "@mui/material/styles";
const BASE_URL = import.meta.env.VITE_API_URL;

const AddMarks = () => {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [file, setFile] = useState(null);
  const token = localStorage.getItem("token");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setFile(file);
  };

  const downloadTemplate = () => {
    // Create CSV content
    const headers = ["Semester", "USN", "Subject Code", "Subject Name", "External Marks", "Attempt", "Passing Date", "CGPA", "Result"];
    const row1 = ["1", "1MS21CS001", "CS101", "Computer Science Basics", "85", "1", "2023-05-15", "8.5", "PASS"];
    const row2 = ["1", "1MS21CS001", "MA101", "Mathematics I", "75", "1", "2023-05-20", "8.5", "PASS"];
    
    const csvContent = [
      headers.join(','),
      row1.join(','),
      row2.join(',')
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'external_marks_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const processCSV = (csvData) => {
    const studentGroups = new Map(); // Group by student USN first
    
    // Skip header row and process data
    for (let i = 1; i < csvData.length; i++) {
      const row = csvData[i];
      // Check if row has all required fields
      if (row.length >= 9) {
        const semester = parseInt(row[0]);
        const usn = row[1].trim();
        const subjectCode = row[2];
        const subjectName = row[3];
        const externalMarks = parseInt(row[4]);
        const attempt = parseInt(row[5]);
        const passingDate = row[6];
        const cgpa = parseFloat(row[7]);
        const result = row[8].toUpperCase();

        if (!isNaN(semester) && usn && subjectCode && subjectName && !isNaN(externalMarks)) {
          if (!studentGroups.has(usn)) {
            studentGroups.set(usn, new Map());
          }
          
          const semesterGroups = studentGroups.get(usn);
          if (!semesterGroups.has(semester)) {
            semesterGroups.set(semester, []);
          }
          
          semesterGroups.get(semester).push({
            subjectCode,
            subjectName,
            externalMarks,
            attempt: isNaN(attempt) ? 1 : attempt,
            passingDate: passingDate || null,
            cgpa: isNaN(cgpa) ? null : cgpa,
            result: result === "PASS" || result === "FAIL" ? result : "FAIL",
          });
        }
      }
    }
    
    return studentGroups;
  };

  // Function to look up a student's userId by their USN
  const fetchUserIdByUSN = async (usn) => {
    try {
      // Call the API to get user ID from USN
      const response = await axios.get(`${BASE_URL}/users/usn/${usn}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data && response.data.userId) {
        return response.data.userId;
      } else {
        console.error(`No userId found for USN: ${usn}`);
        return null;
      }
    } catch (error) {
      console.error(`Error looking up userId for USN ${usn}:`, error.response?.data || error.message);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!file) {
      setError("Please select a CSV file");
      setLoading(false);
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const csvText = event.target.result;
          const parsedData = Papa.parse(csvText).data;
          const studentGroups = processCSV(parsedData);
          
          // Create an array to track results for each student
          const results = [];
          
          // Process each student
          for (const [usn, semesterGroups] of studentGroups) {
            try {
              // First look up student ID by USN
              console.log(`Looking up student with USN: ${usn}`);
              
              let studentId = null;
              try {
                console.log(`Making API call to fetch user ID for USN: ${usn}`);
                studentId = await fetchUserIdByUSN(usn);
                console.log(`Result of user lookup for USN ${usn}:`, studentId ? `Found: ${studentId}` : "Not found");
              } catch (lookupError) {
                console.error(`Error looking up student with USN ${usn}:`, lookupError);
              }
              
              // If lookup failed, fall back to admin ID
              if (!studentId) {
                console.warn(`Could not find userId for USN ${usn}, falling back to admin ID: ${user._id}`);
                studentId = user._id;
              }
              
              // Submit data for each semester
              for (const [semester, subjects] of semesterGroups) {
                console.log(`Submitting semester ${semester} data for USN ${usn}:`, subjects);
                
                // Make sure we're sending all fields properly
                const formattedSubjects = subjects.map(subject => ({
                  subjectCode: subject.subjectCode,
                  subjectName: subject.subjectName,
                  externalMarks: subject.externalMarks,
                  attempt: subject.attempt || 1,
                  passingDate: subject.passingDate || null, // Make sure this is sent
                  cgpa: subject.cgpa || null, // Make sure this is sent
                  result: subject.result || "FAIL"
                }));
                
                await axios.post(
                  `${BASE_URL}/students/external/${studentId}`, 
                  {
                    semester,
                    subjects: formattedSubjects,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`
                    }
                  }
                );
              }
              
              // Add success result for this student
              results.push({ usn, status: 'success' });
            } catch (error) {
              // Add failure result for this student
              results.push({ 
                usn, 
                status: 'error', 
                message: error.response?.data?.message || error.message
              });
              console.error(`Error processing student ${usn}:`, error);
            }
          }
          
          // Show summary results
          const successCount = results.filter(r => r.status === 'success').length;
          const totalCount = results.length;
          
          if (successCount === totalCount) {
            setSuccess(`All ${totalCount} students processed successfully!`);
          } else {
            setSuccess(`Processed ${successCount} out of ${totalCount} students successfully.`);
            setError(`Failed to process ${totalCount - successCount} students. See console for details.`);
          }
          
          setFile(null);
          // Reset file input
          const fileInput = document.getElementById("csv-file-input");
          if (fileInput) fileInput.value = "";
        } catch (err) {
          setError("Error processing CSV file: " + (err.message || "Unknown error"));
          console.error("CSV processing error:", err);
        }
        setLoading(false);
      };

      reader.onerror = () => {
        setError("Error reading file");
        setLoading(false);
      };

      reader.readAsText(file);
    } catch (err) {
      setError("Error uploading marks: " + (err.message || "Unknown error"));
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          backgroundColor: isLight 
            ? 'rgba(255, 255, 255, 0.8)'
            : alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(8px)',
          boxShadow: isLight
            ? '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
            : '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
        }}
      >
        <Box 
          sx={{ 
            textAlign: 'center',
            mb: 4
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            align="center"
            sx={{
              fontWeight: 'bold',
              background: isLight 
                ? `-webkit-linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                : `-webkit-linear-gradient(45deg, ${theme.palette.info.main}, ${theme.palette.info.dark})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
            }}
          >
            Upload External Marks
          </Typography>
          
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ maxWidth: 600, mx: 'auto' }}
          >
            Upload a CSV file with student external marks data
          </Typography>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 2,
            }}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 3,
              borderRadius: 2,
            }}
          >
            {success}
          </Alert>
        )}

        <Box 
          component="form" 
          onSubmit={handleSubmit}
          sx={{
            borderRadius: 2,
            backgroundColor: isLight 
              ? alpha(theme.palette.primary.main, 0.04)
              : alpha(theme.palette.info.main, 0.08),
            p: 3,
            mb: 3,
          }}
        >
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{ mb: 2 }}
          >
            CSV Format Instructions
          </Typography>
          
          <Box 
            sx={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: 0.5,
              mb: 3,
              pl: 2,
              borderLeft: `4px solid ${isLight ? theme.palette.primary.main : theme.palette.info.main}`,
              py: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary">• Column 1: Semester Number</Typography>
            <Typography variant="body2" color="text.secondary">• Column 2: USN</Typography>
            <Typography variant="body2" color="text.secondary">• Column 3: Subject Code</Typography>
            <Typography variant="body2" color="text.secondary">• Column 4: Subject Name</Typography>
            <Typography variant="body2" color="text.secondary">• Column 5: External Marks</Typography>
            <Typography variant="body2" color="text.secondary">• Column 6: Attempt Number (1-4)</Typography>
            <Typography variant="body2" color="text.secondary">• Column 7: Passing Date (YYYY-MM-DD)</Typography>
            <Typography variant="body2" color="text.secondary">• Column 8: CGPA</Typography>
            <Typography variant="body2" color="text.secondary">• Column 9: Result (PASS/FAIL)</Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            justifyContent="center"
            alignItems="center"
            sx={{ mt: 3 }}
          >
            <Button
              variant="outlined"
              onClick={downloadTemplate}
              startIcon={<FileDownloadIcon />}
              sx={{
                borderRadius: '8px',
                py: 1.2,
                px: 3,
                borderColor: isLight ? theme.palette.primary.main : theme.palette.info.main,
                color: isLight ? theme.palette.primary.main : theme.palette.info.main,
                '&:hover': {
                  borderColor: isLight ? theme.palette.primary.main : theme.palette.info.main,
                  backgroundColor: isLight 
                    ? alpha(theme.palette.primary.main, 0.04)
                    : alpha(theme.palette.info.main, 0.08),
                }
              }}
            >
              Download Template
            </Button>

            <Box 
              sx={{ 
                position: 'relative',
                width: { xs: '100%', sm: 'auto' }
              }}
            >
              <input
                id="csv-file-input"
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <label htmlFor="csv-file-input">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<UploadFileIcon />}
                  sx={{
                    borderRadius: '8px',
                    py: 1.2,
                    px: 3,
                    width: { xs: '100%', sm: 'auto' },
                    borderColor: isLight ? theme.palette.primary.main : theme.palette.info.main,
                    color: isLight ? theme.palette.primary.main : theme.palette.info.main,
                    '&:hover': {
                      borderColor: isLight ? theme.palette.primary.main : theme.palette.info.main,
                      backgroundColor: isLight 
                        ? alpha(theme.palette.primary.main, 0.04)
                        : alpha(theme.palette.info.main, 0.08),
                    }
                  }}
                >
                  {file ? file.name : "Choose File"}
                </Button>
              </label>
            </Box>

            <Button
              variant="contained"
              type="submit"
              disabled={loading || !file}
              startIcon={loading ? null : <CloudUploadIcon />}
              sx={{ 
                position: "relative",
                borderRadius: '8px',
                py: 1.2,
                px: 3,
                width: { xs: '100%', sm: 'auto' },
                bgcolor: isLight ? theme.palette.primary.main : theme.palette.info.main,
                '&:hover': {
                  bgcolor: isLight 
                    ? theme.palette.primary.dark
                    : theme.palette.info.dark,
                },
                '&.Mui-disabled': {
                  backgroundColor: isLight 
                    ? alpha(theme.palette.primary.main, 0.3)
                    : alpha(theme.palette.info.main, 0.3),
                }
              }}
            >
              {loading ? (
                <>
                  <CircularProgress
                    size={24}
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      marginTop: "-12px",
                      marginLeft: "-12px",
                      color: 'white',
                    }}
                  />
                  Uploading...
                </>
              ) : (
                "Upload Marks"
              )}
            </Button>
          </Stack>
        </Box>

        <Paper 
          elevation={1} 
          sx={{ 
            p: 2,
            backgroundColor: isLight 
              ? alpha(theme.palette.warning.main, 0.05)
              : alpha(theme.palette.warning.dark, 0.05),
            border: `1px dashed ${alpha(theme.palette.warning.main, 0.2)}`,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <HelpOutlineIcon 
            fontSize="small" 
            color="warning" 
            sx={{ flexShrink: 0 }}
          />
          <Typography variant="body2" color="text.secondary">
            <strong>Sample format:</strong> Each row should include semester number, USN, subject details, marks, and results.
            Make sure the USN matches a student in the system.
          </Typography>
        </Paper>
      </Paper>
    </Container>
  );
};

export default AddMarks; 
