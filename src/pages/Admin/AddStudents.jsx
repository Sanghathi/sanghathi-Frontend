import { useState } from "react";
import { useSnackbar } from "notistack";
import Papa from 'papaparse';
import { 
  Container, 
  Button, 
  Card, 
  Stack, 
  Typography,
  Box,
  Paper,
  Divider,
  CircularProgress,
  Tab,
  Tabs,
  IconButton,
  Alert,
  List,
  ListItem,
  ListItemText
} from "@mui/material";
import { 
  CloudUpload as CloudUploadIcon,
  FileDownload as FileDownloadIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  AdminPanelSettings as AdminIcon,
  HelpOutline as HelpOutlineIcon,
  SupervisorAccount as SupervisorAccountIcon
} from '@mui/icons-material';
import api from "../../utils/axios";
import { getUserSchema } from "../Users/UserForm";
import { alpha, useTheme } from "@mui/material/styles";

// Define role options with their related info
const ROLES = [
  { 
    value: "STUDENT", 
    label: "Students", 
    icon: <PersonIcon />,
    template: [
      "Name", "USN", "Email", "Phone", "Password", "Branch", "Semester", "Section", "PUC Percentage", "DOB"
    ],
    exampleRow: ["John Smith", "1MS21CS001", "john@example.com", "9876543210", "password123", "CSE", "3", "A", "92.5", "2003-05-15"]
  },
  { 
    value: "FACULTY", 
    label: "Faculty", 
    icon: <SchoolIcon />,
    template: [
      "Name", "Email", "Phone", "Password", "Department", "Designation", "DOB"
    ],
    exampleRow: ["Dr. Jane Doe", "jane@example.com", "9876543211", "password123", "Computer Science", "Associate Professor", "1985-10-20"]
  },
  { 
    value: "ADMIN", 
    label: "Admin", 
    icon: <SupervisorAccountIcon />,
    template: [
      "Name", "Email", "Phone", "Password", "Department", "DOB"
    ],
    exampleRow: ["Admin User", "admin@example.com", "9876543212", "password123", "Administration", "1980-01-01"]
  }
];

const AddStudents = () => {
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const [selectedRole, setSelectedRole] = useState("STUDENT");
  const [processing, setProcessing] = useState(false);
  const [successCount, setSuccessCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [errors, setErrors] = useState([]);
  const [file, setFile] = useState(null);

  // Get the color based on the current theme mode
  const activeColor = isLight ? theme.palette.primary.main : theme.palette.info.main;
  
  // Get current role object
  const currentRole = ROLES.find(role => role.value === selectedRole);

  const handleRoleChange = (event, newValue) => {
    setSelectedRole(newValue);
    // Reset state when changing roles
    setFile(null);
    setErrors([]);
    setSuccessCount(0);
    setErrorCount(0);
    // Reset file input
    const fileInput = document.getElementById("upload-file");
    if (fileInput) fileInput.value = "";
  };

  const downloadTemplate = () => {
    const headers = currentRole.template;
    const exampleRow = currentRole.exampleRow;
    
    const csvContent = Papa.unparse({
      fields: headers,
      data: [exampleRow]
    }, { quotes: true });
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute("download", `${selectedRole.toLowerCase()}_template.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setFile(file);
    setProcessing(true);
    setErrors([]);
    setSuccessCount(0);
    setErrorCount(0);

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
        });
        rows = results.data;
      }
      await processRows(rows);
    };
    reader.readAsText(file);
  };

  const processRows = async (rows) => {
    let success = 0;
    let errors = 0;
    const newErrors = [];

    for (const [index, row] of rows.entries()) {
      try {
        // Check required fields based on role
        let endpoint;
        let data;

        // Role is automatically determined based on the selected tab
        if (selectedRole === "STUDENT") {
          if (!row.Name || !row.USN || !row.Email || !row.Password) {
            throw new Error("Missing required fields (Name, USN, Email, Password)");
          }
          endpoint = `/auth/student/register`;
          data = {
            name: row.Name,
            usn: row.USN,
            email: row.Email,
            phone: row.Phone,
            password: row.Password,
            branch: row.Branch,
            semester: row.Semester ? parseInt(row.Semester, 10) : undefined,
            section: row.Section,
            pucPercentage: row.PUC_Percentage ? parseFloat(row.PUC_Percentage) : undefined,
            dob: row.DOB,
          };
        } else if (selectedRole === "FACULTY") {
          if (!row.Name || !row.Email || !row.Password) {
            throw new Error("Missing required fields (Name, Email, Password)");
          }
          endpoint = `/auth/faculty/register`;
          data = {
            name: row.Name,
            email: row.Email,
            phone: row.Phone,
            password: row.Password,
            department: row.Department,
            designation: row.Designation,
            dob: row.DOB,
          };
        } else if (selectedRole === "ADMIN") {
          if (!row.Name || !row.Email || !row.Password) {
            throw new Error("Missing required fields (Name, Email, Password)");
          }
          endpoint = `/auth/admin/register`;
          data = {
            name: row.Name,
            email: row.Email,
            phone: row.Phone,
            password: row.Password,
            department: row.Department,
            dob: row.DOB,
          };
        }

        await api.post(endpoint, data);
        success++;
      } catch (error) {
        errors++;
        newErrors.push(`Row ${index + 1}: ${error.response?.data?.message || error.message}`);
      }
    }

    setSuccessCount(success);
    setErrorCount(errors);
    setErrors(newErrors);
    setProcessing(false);
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
          mb: 4
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
            Add Users
          </Typography>
          
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ maxWidth: 600, mx: 'auto' }}
          >
            Upload a CSV file to add multiple users at once
          </Typography>
        </Box>
        
        <Tabs
          value={selectedRole}
          onChange={handleRoleChange}
          variant="fullWidth"
          textColor="inherit"
          TabIndicatorProps={{
            style: {
              backgroundColor: activeColor
            }
          }}
          sx={{ 
            mb: 4,
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: '3px 3px 0 0',
            }
          }}
        >
          {ROLES.map(role => (
            <Tab
              key={role.value}
              value={role.value}
              label={role.label}
              icon={role.icon}
              iconPosition="start"
              sx={{
                fontWeight: 'medium',
                borderRadius: '8px 8px 0 0',
                '&.Mui-selected': {
                  color: activeColor,
                }
              }}
            />
          ))}
        </Tabs>

        <Box
          sx={{
            backgroundColor: isLight 
              ? alpha(theme.palette.primary.main, 0.04)
              : alpha(theme.palette.info.main, 0.08),
            p: 3,
            borderRadius: 2,
            mb: 3,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Upload {currentRole.label}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Please ensure your CSV file has the following columns:
          </Typography>
          
          <Box 
            sx={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: 0.5,
              mb: 3,
              pl: 2,
              borderLeft: `4px solid ${activeColor}`,
              py: 1,
            }}
          >
            {currentRole.template.map((field, index) => (
              <Typography key={index} variant="body2" color="text.secondary">
                • {field}{index < 4 ? " (required)" : ""}
              </Typography>
            ))}
          </Box>

          <Divider sx={{ my: 3 }} />

          <Stack 
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems="center"
            justifyContent="center"
          >
            <Button 
              variant="outlined" 
              onClick={downloadTemplate}
              startIcon={<FileDownloadIcon />}
              sx={{
                borderRadius: '8px',
                py: 1.2,
                px: 3,
                width: { xs: '100%', sm: 'auto' },
                borderColor: activeColor,
                color: activeColor,
                '&:hover': {
                  borderColor: activeColor,
                  backgroundColor: alpha(activeColor, 0.04),
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
                accept=".csv,.json"
                style={{ display: 'none' }}
                id="upload-file"
                type="file"
                onChange={handleFileUpload}
              />
              <label htmlFor="upload-file">
                <Button 
                  variant="contained" 
                  component="span"
                  startIcon={<CloudUploadIcon />}
                  disabled={processing}
                  sx={{
                    borderRadius: '8px',
                    py: 1.2,
                    px: 3,
                    width: { xs: '100%', sm: 'auto' },
                    position: 'relative',
                    bgcolor: activeColor,
                    '&:hover': {
                      bgcolor: isLight 
                        ? theme.palette.primary.dark
                        : theme.palette.info.dark,
                    }
                  }}
                >
                  {processing ? (
                    <>
                      <CircularProgress
                        size={24}
                        thickness={4}
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          marginTop: '-12px',
                          marginLeft: '-12px',
                          color: 'white',
                        }}
                      />
                      Processing...
                    </>
                  ) : (
                    `${file ? 'File Selected' : 'Upload File'}`
                  )}
                </Button>
              </label>
            </Box>
          </Stack>
        </Box>

        {!processing && (successCount > 0 || errorCount > 0) && (
          <Box sx={{ mt: 3 }}>
            {successCount > 0 && (
              <Alert 
                severity="success" 
                sx={{ 
                  mb: 2,
                  borderRadius: 2,
                }}
              >
                Successfully added: {successCount} {currentRole.label.toLowerCase()}
              </Alert>
            )}
            
            {errorCount > 0 && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 2,
                  borderRadius: 2,
                }}
              >
                Errors encountered: {errorCount} record(s)
              </Alert>
            )}
            
            {errors.length > 0 && (
              <Box 
                sx={{ 
                  mt: 2,
                  backgroundColor: isLight 
                    ? alpha(theme.palette.error.main, 0.05)
                    : alpha(theme.palette.error.dark, 0.1),
                  borderRadius: 2,
                  p: 2,
                  maxHeight: 200,
                  overflowY: "auto",
                  border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                }}
              >
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Error Details:</Typography>
                <List dense>
                  {errors.map((error, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemText 
                        primary={error}
                        primaryTypographyProps={{ 
                          variant: 'body2', 
                          color: 'error.main' 
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Box>
        )}

        <Paper 
          elevation={1} 
          sx={{ 
            p: 2,
            mt: 4,
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
            <strong>Note:</strong> Ensure all required fields are properly filled. 
            Use strong passwords. Emails should be unique across the system.
          </Typography>
        </Paper>
      </Paper>
    </Container>
  );
};

export default AddStudents;