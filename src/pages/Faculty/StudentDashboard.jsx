import { Container, Grid, Typography, Box, useTheme } from "@mui/material";
import Page from "../../components/Page";
import { Card, CardHeader, CardContent, CardActionArea } from "@mui/material";
import { useState, useEffect } from "react"; // Import useEffect
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

import { Link, useParams } from "react-router-dom"; // Import useParams
import axios from "axios"; // Import axios

const BASE_URL = import.meta.env.VITE_API_URL;
const StudentTile = ({ title, icon, link, menteeId }) => {
  const theme = useTheme();
    const updatedLink = link.includes('?') ? `${link}&menteeId=${menteeId}` : `${link}?menteeId=${menteeId}`;

  return (
    <Card
      sx={{
        transition: "transform 0.2s",
        "&:hover": {
          transform: "scale(1.05)",
        },
      }}
    >
      <CardActionArea component={Link} to={updatedLink}>
        <CardContent
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            backgroundColor: theme.palette.secondary[200],
            color: blueGrey[100],
            minHeight: "230px",
            "&:hover": {
              backgroundColor: theme.palette.primary[600],
            },
          }}
        >
          {icon}
          <Typography variant="h6" component="div" sx={{ mt: 1 }}>
            {title}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

const StudentDashboard = () => {
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
        // Example: Fetch basic mentee profile data.  You'll likely need
        // separate API calls for each section (profile, career review, etc.)
        const response = await axios.get(
          `${BASE_URL}/student-profiles/${menteeId}`
        );
        setMenteeData(response.data);
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
  return (
    <Page title="Mentee Dashboard">
      <Container
        maxWidth="xl"
        sx={{
          p: 2,
        }}
      >
        <Typography
          variant="h2"
          align="center"
          gutterBottom
          sx={{
            mb: 6,
            fontWeight: "bold",
          }}
        >
          Mentee Dashboard
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <StudentTile
              title="Profile"
              icon={<PersonIcon fontSize="large" />}
              link="/student/profile"
              menteeId={menteeId}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <StudentTile
              title="Career review"
              icon={<PersonIcon fontSize="large" />}
              link="/CareerReview/CareerReview"
              menteeId={menteeId}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StudentTile
              title="Scorecard"
              icon={<AssignmentIcon fontSize="large" />}
              link="/Scorecard/ScoreCard"
              menteeId={menteeId}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StudentTile
              title="Placement"
              icon={<EmojiEventsIcon fontSize="large" />}
              link="/Placement/Placement"
              menteeId={menteeId}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StudentTile
              title="Attendance"
              icon={<TodayIcon fontSize="large" />}
              link="/student/attendance"
              menteeId={menteeId}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StudentTile
              title="Parent Teacher Meeting"
              icon={<GroupIcon fontSize="large" />}
              link="/student/ptm"
              menteeId={menteeId}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StudentTile
              title="PO Attainment and Bloom's Level"
              icon={<GroupIcon fontSize="large" />}
              link="/po-attainment-grading"
              menteeId={menteeId}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};
export default StudentDashboard;