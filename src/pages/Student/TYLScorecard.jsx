import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
  TextField,
  Button,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { AuthContext } from '../../context/AuthContext';
import { useSnackbar } from 'notistack';
import api from '../../utils/axios';
import { useSearchParams } from 'react-router-dom';

const TYLScorecard = () => {
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const colorMode = isLight ? 'primary' : 'info';
  const { user } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const [searchParams] = useSearchParams();
  const menteeId = searchParams.get('menteeId');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tylScores, setTYLScores] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(1);

  const isFaculty = user?.roleName === "faculty";

  const parameters = [
    "Language Proficiency in English",
    "Aptitude",
    "Core Fundamentals",
    "Certifications",
    "Experiential Mini Projects",
    "Internships",
    "Soft Skills"
  ];

  useEffect(() => {
    fetchTYLScores();
  }, [menteeId, user]);

  const fetchTYLScores = async () => {
    try {
      setLoading(true);
      const userId = menteeId || user._id;
      const response = await api.get(`/tyl-scores/${userId}`);
      
      if (response.data?.status === 'success' && Array.isArray(response.data.data)) {
        setTYLScores(response.data.data);
        setError("");
      } else {
        // Initialize with empty data if no scores available
        setTYLScores([]);
        setError("No scores available. Please add scores.");
      }
    } catch (err) {
      console.error("Error fetching TYL scores:", err);
      setError(`Failed to fetch TYL scores: ${err.message}`);
      setTYLScores([]);
    } finally {
      setLoading(false);
    }
  };

  const handleScoreChange = (parameter, semester, type, value) => {
    if (!isFaculty) return;
    
    setTYLScores(prev => {
      // Create a deep copy of the previous state
      const newScores = [...prev];
      
      // Find the semester to update
      const semIndex = newScores.findIndex(sem => sem.semester === semester);
      
      if (semIndex >= 0) {
        // Update existing semester
        const updatedScores = {...newScores[semIndex].scores};
        if (!updatedScores[parameter]) {
          updatedScores[parameter] = { target: "", actual: "" };
        }
        updatedScores[parameter] = {
          ...updatedScores[parameter],
          [type]: value
        };
        
        newScores[semIndex] = {
          ...newScores[semIndex],
          scores: updatedScores
        };
      } else {
        // If semester doesn't exist, create a new one
        const newSemester = {
          semester: semester,
          scores: {}
        };
        
        // Initialize with empty scores for all parameters
        parameters.forEach(param => {
          newSemester.scores[param] = { target: "", actual: "" };
        });
        
        // Set the value for the current parameter
        newSemester.scores[parameter][type] = value;
        
        // Add new semester to array
        newScores.push(newSemester);
      }
      
      return newScores;
    });
  };

  const handleSave = async () => {
    if (!isFaculty) {
      enqueueSnackbar("Only faculty members can save changes", { variant: "error" });
      return;
    }
    
    try {
      setLoading(true);
      const userId = menteeId || user._id;
      
      // Format scores object according to backend expectations
      // Don't rely on existing data, instead grab values directly from form fields
      const scoresObject = {};
      parameters.forEach(param => {
        const targetInput = document.querySelector(`input[name="${param}-target"]`);
        const actualInput = document.querySelector(`input[name="${param}-actual"]`);
        
        scoresObject[param] = {
          target: targetInput ? targetInput.value : "",
          actual: actualInput ? actualInput.value : ""
        };
      });
      
      console.log("Saving TYL scores:", {
        userId,
        semester: selectedSemester,
        scores: scoresObject
      });
      
      await api.post("/tyl-scores", {
        userId,
        semester: selectedSemester,
        scores: scoresObject
      });
      
      enqueueSnackbar("TYL scores saved successfully!", { variant: "success" });
      await fetchTYLScores(); // Refresh data after save
    } catch (error) {
      console.error("Error saving TYL scores:", error);
      enqueueSnackbar(`Error saving TYL scores: ${error.response?.data?.message || error.message}`, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const skillsData = [
    {
      skill: 'Language proficiency in English',
      description: 'Language Proficience is described as below mentioned levels:\nA1-Beginner\nA2-Elementary\nB1-Intermediate\nB2-Upper Intermediate\nC1-Advanced\nC2-Proficient',
      score: '1 for A1\n 2 for A2\n 3 for B1\n 4 for B2\n 5 for C1/C2',
      required: '4',
      comments: 'For effective business communication in Corporate World',
    },
    {
      skill: 'Aptitude',
      description: 'Aptitude has 3 Components:\n1. Verbal Ability\n2.Quantitative\n3. Logical Reasoning ',
      score: 'Test Score of 1 to 5 mapped to absolute score',
      required: '3',
      comments: 'Will use one of Aptitude Assessment(TBD)',
    },
    {
      skill: 'Core Technical',
      description: 'Fundamentals of Core subjects',
      score: 'Results rating on scale of 1 to 5',
      required: '3',
      comments: 'Administer a test similar to GATE',
    },
    {
      skill: 'Core Technical',
      description: 'Certifications in identified technical courses like: Python, DB, MATLAB, R Programming',
      score: 'No. of Cert.(with to 50%)',
      required: '4',
      comments: '',
    },
    {
      skill: 'Experiential',
      description: 'Mini Projects',
      score: 'No. of Projects',
      required: '4',
      comments: '',
    },
    {
      skill: 'Experiential',
      description: 'Internship',
      score: 'No. of Weeks/2',
      required: '4',
      comments: '',
    },
    {
      skill: 'Soft Skills',
      description: 'Presentation skills, Group Discussion, Business Etiquette',
      score: 'Trainer Rating on scale of 1 to 5',
      required: '3',
      comments: 'Will use ratings from Trainer',
    },
  ];

  // Table cell styles
  const tableCellStyle = {
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper
  };
  
  const tableHeadCellStyle = {
    ...tableCellStyle,
    fontWeight: 'bold',
    backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[800],
    color: theme.palette.text.primary,
  };

  // Get the current semester data
  const getCurrentSemesterScores = (parameter, type) => {
    if (!Array.isArray(tylScores) || tylScores.length === 0) {
      return "";
    }
    
    const semesterData = tylScores.find(sem => sem.semester === selectedSemester);
    if (!semesterData || !semesterData.scores || !semesterData.scores[parameter]) {
      return "";
    }
    
    return semesterData.scores[parameter][type] || "";
  };

  return (
    <Box sx={{ p: 2, maxWidth: 1200, mx: 'auto' }}>
      <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: theme.palette.background.paper }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          align="center" 
          color={colorMode}
        >
          TYL Scorecard
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            centered
            sx={{
              '& .MuiTab-root': {
                minHeight: 48,
                minWidth: 120,
                '&.Mui-selected': {
                  color: isLight ? theme.palette.primary.main : theme.palette.info.main,
                },
              },
            }}
          >
            <Tab 
              icon={<AssessmentIcon />} 
              label="TYL Scores" 
              iconPosition="start"
            />
            <Tab 
              icon={<DescriptionIcon />} 
              label="Description" 
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {tabValue === 0 && (
          <Paper elevation={1} sx={{ p: 3, backgroundColor: theme.palette.background.paper }}>
            <Typography variant="h5" gutterBottom align="center" sx={{ mb: 2, color: isLight ? theme.palette.primary.dark : theme.palette.info.main }}>
              TYL Scores
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                sx={{ minWidth: 120 }}
                size="small"
                color={colorMode}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <MenuItem key={sem} value={sem}>
                    Semester {sem}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress color={colorMode} />
              </Box>
            ) : (
              <TableContainer sx={{ mb: 2, border: `1px solid ${theme.palette.divider}` }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={tableHeadCellStyle}>Parameter</TableCell>
                      <TableCell sx={tableHeadCellStyle}>Target</TableCell>
                      <TableCell sx={tableHeadCellStyle}>Actual</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {parameters.map((parameter) => (
                      <TableRow 
                        key={parameter}
                        sx={{ 
                          '&:nth-of-type(odd)': {
                            backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
                          },
                        }}
                      >
                        <TableCell sx={tableCellStyle}>{parameter}</TableCell>
                        <TableCell sx={tableCellStyle}>
                          <TextField
                            fullWidth
                            size="small"
                            color={colorMode}
                            name={`${parameter}-target`}
                            disabled={!isFaculty}
                            value={getCurrentSemesterScores(parameter, 'target')}
                            onChange={(e) => handleScoreChange(parameter, selectedSemester, 'target', e.target.value)}
                          />
                        </TableCell>
                        <TableCell sx={tableCellStyle}>
                          <TextField
                            fullWidth
                            size="small"
                            color={colorMode}
                            name={`${parameter}-actual`}
                            disabled={!isFaculty}
                            value={getCurrentSemesterScores(parameter, 'actual')}
                            onChange={(e) => handleScoreChange(parameter, selectedSemester, 'actual', e.target.value)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {isFaculty && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Button 
                  variant="contained" 
                  color={colorMode}
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Save TYL Scores'}
                </Button>
              </Box>
            )}
          </Paper>
        )}

        {tabValue === 1 && (
          <Paper elevation={1} sx={{ p: 3, backgroundColor: theme.palette.background.paper }}>
            <Typography variant="h5" gutterBottom align="center" sx={{ mb: 2, color: isLight ? theme.palette.primary.dark : theme.palette.info.main }}>
              Skills Description
            </Typography>
            <TableContainer sx={{ mb: 2, border: `1px solid ${theme.palette.divider}` }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={tableHeadCellStyle}>Skills</TableCell>
                    <TableCell sx={tableHeadCellStyle}>Description</TableCell>
                    <TableCell sx={tableHeadCellStyle}>TYL Score</TableCell>
                    <TableCell sx={tableHeadCellStyle}>Required</TableCell>
                    <TableCell sx={tableHeadCellStyle}>Comments</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {skillsData.map((row, index) => (
                    <TableRow 
                      key={index}
                      sx={{ 
                        '&:nth-of-type(odd)': {
                          backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
                        },
                      }}
                    >
                      <TableCell sx={tableCellStyle}>{row.skill}</TableCell>
                      <TableCell sx={tableCellStyle}>{row.description}</TableCell>
                      <TableCell sx={tableCellStyle}>{row.score}</TableCell>
                      <TableCell sx={tableCellStyle}>{row.required}</TableCell>
                      <TableCell sx={tableCellStyle}>{row.comments}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Paper>
    </Box>
  );
};

export default TYLScorecard;