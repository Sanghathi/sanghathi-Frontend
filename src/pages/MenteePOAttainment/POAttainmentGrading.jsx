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
  Typography,
  Button,
  Tooltip
} from "@mui/material";
import api from "../../utils/axios";
import { AuthContext } from "../../context/AuthContext";
import { useSnackbar } from "notistack";
import { useSearchParams } from "react-router-dom";

const POAttainmentGrading = () => {
  const { user } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const [searchParams] = useSearchParams();
  const menteeId = searchParams.get('menteeId');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [poAttainmentData, setPOAttainmentData] = useState({});
  const [bloomLevelData, setBloomLevelData] = useState({});
  const [semesterData, setSemesterData] = useState([]);
  
  // Check if the user is a faculty member
  const isFaculty = user?.roleName === "faculty";
  
  // List of POs with descriptions
  const programOutcomes = [
    { code: "PO-01", desc: "University Results" },
    { code: "PO-02", desc: "University Results" },
    { code: "PO-03", desc: "University Results, Mini Projects" },
    { code: "PO-04", desc: "University Results, Mini Projects, Workshops" },
    { code: "PO-05", desc: "University Results, Mini Projects, Workshops, Relevant Expert Lectures, Certification" },
    { code: "PO-06", desc: "Mini Projects, Competitions, Relevant Expert Lectures, Internship, Industrial Visit, Sensitivity to society, Global perspective" },
    { code: "PO-07", desc: "Major Projects, Competitions, Relevant Expert Lectures" },
    { code: "PO-08", desc: "Major Projects, Competitions, Relevant Expert Lectures" },
    { code: "PO-09", desc: "Mini/Major Projects, Participation in clubs/chapters, Competitions, Internship, Core Human Values, Self-Discipline, Positive Attitude" },
    { code: "PO-10", desc: "Mini/Major Projects, Participation in clubs/chapters, Competition, Internship, Confidence" },
    { code: "PO-11", desc: "Major Project, Competition" },
    { code: "PO-12", desc: "MOOC" }
  ];
  
  // Choices for CL (Correlation Level)
  const correlationLevels = [1, 2, 3];
  
  // Bloom's Taxonomy Levels
  const bloomTaxonomyLevels = [
    "Remember",
    "Understand",
    "Apply",
    "Analyze",
    "Evaluate",
    "Create"
  ];

  useEffect(() => {
    fetchAllPOAttainmentData();
  }, [menteeId, user]);
  
  useEffect(() => {
    // When semesterData or selectedSemester changes, update the current PO data
    updateCurrentSemesterData();
  }, [semesterData, selectedSemester]);

  const fetchAllPOAttainmentData = async () => {
    try {
      setLoading(true);
      const userId = menteeId || user._id;
      const response = await api.get(`/po-attainment/${userId}/all`);
      
      if (response.data?.data?.semesters) {
        // Store all semesters data
        setSemesterData(response.data.data.semesters);
        
        // If no semester is selected and we have data, select the first one
        if (response.data.data.semesters.length > 0 && !selectedSemester) {
          setSelectedSemester(response.data.data.semesters[0].semester);
        }
      } else {
        setSemesterData([]);
        // Initialize empty data
        resetToEmptyData();
      }
      
      setLoading(false);
    } catch (err) {
      console.error("Error fetching PO attainment data:", err);
      setSemesterData([]);
      resetToEmptyData();
      setError("Failed to fetch data. Using empty template.");
      setLoading(false);
    }
  };
  
  const updateCurrentSemesterData = () => {
    if (!selectedSemester || semesterData.length === 0) {
      resetToEmptyData();
      return;
    }
    
    // Find the selected semester in our data
    const currentSemData = semesterData.find(sem => sem.semester === selectedSemester);
    
    if (currentSemData) {
      setPOAttainmentData(currentSemData.poAttainment || {});
      setBloomLevelData(currentSemData.bloomLevel || { level: 1 });
    } else {
      resetToEmptyData();
    }
  };
  
  const resetToEmptyData = () => {
    const emptyPOData = {};
    programOutcomes.forEach(po => {
      emptyPOData[po.code] = { cl: 1, justification: "" };
    });
    setPOAttainmentData(emptyPOData);
    setBloomLevelData({ level: 1 });
  };

  const handleSemesterChange = (event) => {
    setSelectedSemester(parseInt(event.target.value, 10));
  };

  const handlePOChange = (po, field, value) => {
    if (!isFaculty) return; // Only allow faculty to make changes
    
    setPOAttainmentData(prev => ({
      ...prev,
      [po]: {
        ...prev[po],
        [field]: value
      }
    }));
  };

  const handleBloomLevelChange = (value) => {
    if (!isFaculty) return; // Only allow faculty to make changes
    
    setBloomLevelData({ level: value });
  };

  const handleSave = async () => {
    if (!isFaculty) {
      enqueueSnackbar("Only faculty members can save changes", { variant: "error" });
      return;
    }
    
    try {
      const userId = menteeId || user._id;
      await api.post("/po-attainment", {
        userId,
        semester: selectedSemester,
        poAttainment: poAttainmentData,
        bloomLevel: bloomLevelData
      });
      
      // Refetch all data to update the UI
      await fetchAllPOAttainmentData();
      
      enqueueSnackbar("Grading saved successfully!", { variant: "success" });
    } catch (error) {
      console.error("Error saving grading data:", error);
      enqueueSnackbar("Failed to save grading data", { variant: "error" });
    }
  };

  // Get available semesters for the dropdown - either from data or default list
  const getAvailableSemesters = () => {
    // Always show all 8 semesters, regardless of data
    return [1, 2, 3, 4, 5, 6, 7, 8];
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Guide for Mentor to Grade Mentee's PO Attainment and Bloom Taxonomy Level
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <label>
          Select Semester:
          <Select
            value={selectedSemester}
            onChange={handleSemesterChange}
            sx={{ ml: 1 }}
          >
            {getAvailableSemesters().map((sem) => (
              <MenuItem key={sem} value={sem}>
                Semester {sem}
              </MenuItem>
            ))}
          </Select>
        </label>
      </Box>

      {/* PO Correlation Table */}
      <Typography variant="h5" gutterBottom align="center" sx={{ mt: 3 }}>
        Student Wise PO Correlation
      </Typography>
      <TableContainer sx={{ border: "1px solid gray", mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ border: "1px solid gray", fontWeight: 'bold' }}>PO</TableCell>
              <TableCell sx={{ border: "1px solid gray", fontWeight: 'bold' }}>CL</TableCell>
              <TableCell sx={{ border: "1px solid gray", fontWeight: 'bold' }}>Mentor Justification</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {programOutcomes.map((po) => (
              <TableRow key={po.code}>
                <TableCell sx={{ border: "1px solid gray" }}>
                  {po.code} 
                </TableCell>
                <TableCell sx={{ border: "1px solid gray" }}>
                  {isFaculty ? (
                    <Select
                      value={poAttainmentData[po.code]?.cl || 1}
                      onChange={(e) => handlePOChange(po.code, 'cl', e.target.value)}
                      fullWidth
                      size="small"
                    >
                      {correlationLevels.map((level) => (
                        <MenuItem key={level} value={level}>
                          {level}
                        </MenuItem>
                      ))}
                    </Select>
                  ) : (
                    <div>{poAttainmentData[po.code]?.cl || 1}</div>
                  )}
                </TableCell>
                <TableCell sx={{ border: "1px solid gray" }}>
                  {isFaculty ? (
                    <TextField
                      fullWidth
                      size="small"
                      value={poAttainmentData[po.code]?.justification || ""}
                      onChange={(e) => handlePOChange(po.code, 'justification', e.target.value)}
                      placeholder={`${po.desc}`}
                    />
                  ) : (
                    <div>{poAttainmentData[po.code]?.justification || ""}</div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Bloom Level Table */}
      <Typography variant="h5" gutterBottom align="center">
        Bloom Level
      </Typography>
      <TableContainer sx={{ border: "1px solid gray", mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ border: "1px solid gray", fontWeight: 'bold' }}>Bloom's Taxonomy Levels</TableCell>
              <TableCell sx={{ border: "1px solid gray", fontWeight: 'bold' }}>Select Level</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell sx={{ border: "1px solid gray" }}>
                {bloomTaxonomyLevels.join(", ")}
              </TableCell>
              <TableCell sx={{ border: "1px solid gray" }}>
                {isFaculty ? (
                  <Select
                    value={bloomLevelData?.level || 1}
                    onChange={(e) => handleBloomLevelChange(e.target.value)}
                    fullWidth
                    size="small"
                  >
                    {bloomTaxonomyLevels.map((level, index) => (
                      <MenuItem key={index} value={index + 1}>
                        {index + 1} - {level}
                      </MenuItem>
                    ))}
                  </Select>
                ) : (
                  <div>{bloomLevelData?.level ? `${bloomLevelData.level} - ${bloomTaxonomyLevels[bloomLevelData.level - 1]}` : "Not set"}</div>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {isFaculty && (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSave}
            disabled={loading}
          >
            Save Grading
          </Button>
        </Box>
      )}
      
      {!isFaculty && (
        <Typography align="center" color="textSecondary">
          Only faculty members can edit and save PO Attainment data.
        </Typography>
      )}
    </Box>
  );
};

export default POAttainmentGrading; 