import { Container, Grid, Typography, Box, useTheme, Paper } from "@mui/material";
import Page from "../../components/Page";
import { Card, CardHeader, CardContent, CardActionArea } from "@mui/material";
import { useState, useEffect } from "react"; // Import useEffect
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Fab,
} from "@mui/material";
import {
  BugReport as BugReportIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  CheckCircle as CheckCircleIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Book as BookIcon,
  EmojiEvents as EmojiEventsIcon,
  Today as TodayIcon,
  Group as GroupIcon,
} from "@mui/icons-material";
import { blueGrey } from "@mui/material/colors";
import { alpha } from "@mui/material/styles";

import { Link, useParams } from "react-router-dom"; // Import useParams
import axios from "axios"; // Import axios

const BASE_URL = import.meta.env.VITE_API_URL;
const StudentTile = ({ title, icon, link, menteeId }) => {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const updatedLink = link.includes('?') ? `${link}&menteeId=${menteeId}` : `${link}?menteeId=${menteeId}`;

  return (
    <Card
      sx={{
        transition: "all 0.3s ease",
        borderRadius: 3,
        borderLeft: isLight 
          ? `4px solid ${theme.palette.primary.main}` 
          : `4px solid ${theme.palette.info.main}`,
        overflow: 'hidden',
        backgroundColor: isLight 
          ? alpha(theme.palette.primary.main, 0.08) 
          : alpha(theme.palette.info.main, 0.1),
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: isLight 
            ? '0 8px 24px 0 rgba(0,0,0,0.1)' 
            : `0 8px 24px 0 ${alpha(theme.palette.info.dark, 0.3)}`,
        },
      }}
    >
      <CardActionArea component={Link} to={updatedLink}>
        <CardContent
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            flexDirection: "row",
            minHeight: "auto",
            p: 3,
            "&:hover": {
              backgroundColor: isLight 
                ? alpha(theme.palette.primary.main, 0.12) 
                : alpha(theme.palette.info.main, 0.2),
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 64,
              height: 64,
              borderRadius: '12px',
              mr: 3,
              backgroundColor: isLight
                ? alpha(theme.palette.primary.main, 0.12)
                : alpha(theme.palette.info.main, 0.15),
              color: isLight
                ? theme.palette.primary.main
                : theme.palette.info.light,
            }}
          >
            {React.cloneElement(icon, { fontSize: "large" })}
          </Box>
          
          <Box>
            <Typography 
              variant="h6" 
              component="div"
              sx={{ 
                fontWeight: 600,
                color: theme.palette.text.primary,
                mb: 0.5
              }}
            >
              {title}
            </Typography>
            
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{
                opacity: 0.8
              }}
            >
              Click to access
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

const StudentDashboard = () => {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const [bugReportDialogOpen, setBugReportDialogOpen] = useState(false);
  const { menteeId } = useParams(); // Get menteeId from URL
  const [menteeData, setMenteeData] = useState(null); // Store mentee data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleBugReportDialogOpen = () => {
    setBugReportDialogOpen(true);
  };
  const handleBugReportDialogClose = () => {
    setBugReportDialogOpen(false);
  };

  useEffect(() => {
    const fetchMenteeData = async () => {
      try {
        // Fetch the student profile
        const profileResponse = await axios.get(
          `${BASE_URL}/student-profiles/${menteeId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
        console.log("Student profile response:", profileResponse.data);
        
        let userData = profileResponse.data;
        
        // Skip the user endpoint since it's returning 500 error
        setMenteeData(userData);
      } catch (err) {
        setError("Error fetching mentee data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (menteeId) {
      fetchMenteeData();
    }
  }, [menteeId]); // Fetch data when menteeId changes

  if (loading) {
    return <Typography>Loading Mentee Dashboard...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  console.log("Full menteeData structure:", menteeData);
  
  // Get mentee name based on the student profile structure
  const getFullName = () => {
    if (menteeData?.fullName) {
      const { firstName, middleName, lastName } = menteeData.fullName;
      if (middleName) {
        return `${firstName} ${middleName} ${lastName}`;
      }
      return `${firstName} ${lastName}`;
    }
    
    // Fallbacks if fullName structure is not available
    return menteeData?.name || 
           (menteeData?.firstName && menteeData?.lastName 
             ? `${menteeData.firstName} ${menteeData.lastName}`
             : menteeData?.firstName) ||
           menteeData?.studentName ||
           menteeData?.usn || // Use USN if nothing else is available
           "Mentee";
  };
  
  const menteeName = getFullName();

  console.log("Extracted mentee name:", menteeName);
  
  return (
    <Page title={`${menteeName}'s Dashboard`}>
      <Box
        sx={{
          pt: 3,
          pb: 5,
          backgroundColor: isLight 
            ? alpha(theme.palette.primary.lighter, 0.4)
            : alpha(theme.palette.background.default, 0.7),
          minHeight: '100vh',
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            p: 2,
          }}
        >
          {isLight ? (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                mb: 4,
                mt: 1,
                borderRadius: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(20px)',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              }}
            >
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  textAlign: 'center',
                  mb: 3
                }}
              >
                <Typography 
                  variant="h4" 
                  color="primary" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 'bold',
                    position: 'relative',
                    display: 'inline-block',
                    '&:after': {
                      content: '""',
                      position: 'absolute',
                      width: '40%',
                      height: '4px',
                      borderRadius: '2px',
                      backgroundColor: theme.palette.primary.main,
                      bottom: '-8px',
                      left: '30%'
                    }
                  }}
                >
                  {menteeName}'s Dashboard
                </Typography>
                
                <Typography 
                  variant="body1" 
                  color="text.secondary" 
                  sx={{ maxWidth: '600px', mt: 3 }}
                >
                  View and manage all information related to your mentee from this dashboard.
                </Typography>
              </Box>
            </Paper>
          ) : (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                mb: 4,
                mt: 1,
                borderRadius: 3,
                backgroundColor: alpha(theme.palette.background.paper, 0.6),
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.info.main, 0.15)}`,
              }}
            >
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  textAlign: 'center',
                  mb: 3
                }}
              >
                <Typography 
                  variant="h4" 
                  color="info" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 'bold',
                    position: 'relative',
                    display: 'inline-block',
                    '&:after': {
                      content: '""',
                      position: 'absolute',
                      width: '40%',
                      height: '4px',
                      borderRadius: '2px',
                      backgroundColor: theme.palette.info.main,
                      bottom: '-8px',
                      left: '30%'
                    }
                  }}
                >
                  {menteeName}'s Dashboard
                </Typography>
                
                <Typography 
                  variant="body1" 
                  color="text.secondary" 
                  sx={{ maxWidth: '600px', mt: 3 }}
                >
                  View and manage all information related to your mentee from this dashboard.
                </Typography>
              </Box>
            </Paper>
          )}
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={6} lg={4}>
              <StudentTile
                title="Profile"
                icon={<PersonIcon />}
                link="/student/profile"
                menteeId={menteeId}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={4}>
              <StudentTile
                title="Career review"
                icon={<PersonIcon />}
                link="/CareerReview/CareerReview"
                menteeId={menteeId}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={6} lg={4}>
              <StudentTile
                title="Scorecard"
                icon={<AssignmentIcon />}
                link="/Scorecard/ScoreCard"
                menteeId={menteeId}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={6} lg={4}>
              <StudentTile
                title="Placement"
                icon={<EmojiEventsIcon />}
                link="/Placement/Placement"
                menteeId={menteeId}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={6} lg={4}>
              <StudentTile
                title="Attendance"
                icon={<TodayIcon />}
                link="/student/attendance"
                menteeId={menteeId}
              />
            </Grid>
            
            {/* <Grid item xs={12} sm={6} md={6} lg={4}>
              <StudentTile
                title="Parent Teacher Meeting"
                icon={<GroupIcon />}
                link="/student/ptm"
                menteeId={menteeId}
              />
            </Grid> */}
            
            <Grid item xs={12} sm={6} md={6} lg={4}>
              <StudentTile
                title="PO Attainment and Bloom's Level"
                icon={<GroupIcon />}
                link="/po-attainment-grading"
                menteeId={menteeId}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={4}>
              <StudentTile
                title="TYL Scorecard"
                icon={<AssignmentIcon />}
                link="/student/tyl-scorecard"
                menteeId={menteeId}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Page>
  );
};
export default StudentDashboard;