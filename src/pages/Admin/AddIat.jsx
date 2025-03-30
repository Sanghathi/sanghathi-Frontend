import { useState } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import Papa from "papaparse";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const AddIat = () => {
  const [processing, setProcessing] = useState(false);
  const [successCount, setSuccessCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [errors, setErrors] = useState([]);

  const downloadTemplate = () => {
    const headers = [
      "USN",
      "Sem",
      "SubjectCode", // Added SubjectCode
      "SubjectName",
      "IAT1",
      "IAT2",
      "IAT3",
    ];
    const exampleRow = ["USN123", "1", "CS101", "Introduction to Programming", "85", "92", "78"];
    const csvContent = Papa.unparse([headers, exampleRow], { quotes: true });
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute("download", "iat_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target.result;
      let rows = [];
      if (file.type === "application/json") {
        try {
          rows = JSON.parse(content);
        } catch (error) {
          setErrors(["Invalid JSON format."]);
          setErrorCount(1);
          setProcessing(false);
          return;
        }
      } else {
        const results = Papa.parse(content, {
          header: true,
          skipEmptyLines: true,
          transform: (value) => (value === "" ? undefined : value), //  Convert empty strings to undefined
        });
        rows = results.data;
      }
      await processRows(rows);
    };
    reader.readAsText(file);
  };

  const processRows = async (rows) => {
    setProcessing(true);
    let success = 0;
    let errors = 0;
    const newErrors = [];

    // Group rows by USN and Semester
    const groupedData = {};
    for (const row of rows) {
      if (!row.USN || !row.Sem || !row.SubjectCode || !row.SubjectName) {
        newErrors.push(`Row with missing USN, Sem, SubjectCode, or SubjectName: ${JSON.stringify(row)}`);
        errors++;
        continue; // Skip to the next row
      }

      const key = `${row.USN}-${row.Sem}`;
      if (!groupedData[key]) {
        groupedData[key] = {
          usn: row.USN,
          semester: parseInt(row.Sem, 10),
          subjects: [],
        };
      }
      groupedData[key].subjects.push({
        subjectCode: row.SubjectCode,
        subjectName: row.SubjectName,
        iat1: row.IAT1 !== undefined ? parseInt(row.IAT1, 10) : undefined, // Parse, handle undefined
        iat2: row.IAT2 !== undefined ? parseInt(row.IAT2, 10) : undefined,
        iat3: row.IAT3 !== undefined ? parseInt(row.IAT3, 10) : undefined,
      });
    }

    // Process each group (USN and Semester combination)
    for (const key in groupedData) {
      const data = groupedData[key];
      try {
        // Get userId by USN (as before)
        const response = await axios.get(
          `${BASE_URL}/users/usn/${data.usn}`
        );
        if (!response.data?.userId) {
          throw new Error(`User with USN ${data.usn} not found`);
        }
        const userId = response.data.userId;

        // Prepare the data for the IAT API
        const iatData = {
          semester: data.semester,
          subjects: data.subjects,
        };

        // Submit IAT data
        await axios.post(
          `${BASE_URL}/students/iat/${userId}`,
          iatData
        );
        success++;
      } catch (error) {
        errors++;
        newErrors.push(`Error for USN ${data.usn}, Semester ${data.semester}: ${error.message}`);
      }
    }

    setSuccessCount(success);
    setErrorCount(errors);
    setErrors(newErrors);
    setProcessing(false);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Upload IAT Marks
      </Typography>
      <Button variant="contained" onClick={downloadTemplate} sx={{ mr: 2 }}>
        Download Template
      </Button>
      <input
        accept=".csv,.json"
        style={{ display: "none" }}
        id="upload-file"
        type="file"
        onChange={handleFileUpload}
      />
      <label htmlFor="upload-file">
        <Button variant="contained" component="span">
          Upload File
        </Button>
      </label>

      {processing && <CircularProgress sx={{ mt: 2 }} />}

      {!processing && (successCount > 0 || errorCount > 0) && (
        <Box sx={{ mt: 2 }}>
          <Typography>Successfully processed: {successCount}</Typography>
          <Typography>Errors: {errorCount}</Typography>
          {errors.length > 0 && (
            <Box sx={{ mt: 1, maxHeight: 200, overflowY: "auto" }}>
              {errors.map((error, index) => (
                <Typography key={index} color="error">
                  {error}
                </Typography>
              ))}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default AddIat;