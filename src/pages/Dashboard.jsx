import { Container, Grid, Typography, Box, useTheme } from "@mui/material";
import Page from "../components/Page";
import { Card, CardHeader, CardContent, CardActionArea } from "@mui/material";
import { useState } from "react";
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

import { Link } from "react-router-dom";

const StudentTile = ({ title, icon, link }) => {
  const theme = useTheme();
  return (
    <Card
      sx={{
        transition: "transform 0.2s",
        "&:hover": {
          transform: "scale(1.05)",
        },
      }}
    >
      <CardActionArea component={Link} to={link}>
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

const Dashboard = () => {
  const [bugReportDialogOpen, setBugReportDialogOpen] = useState(false);
  const handleBugReportDialogOpen = () => {
    setBugReportDialogOpen(true);
  };
  const handleBugReportDialogClose = () => {
    setBugReportDialogOpen(false);
  };
  return (
    <Page title="Home">
      <Container
        maxWidth="xl"
        sx={{
          p: 8,
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <StudentTile
              title="Profile"
              icon={<PersonIcon fontSize="large" />}
              link="/student/profile"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <StudentTile
              title="Career review"
              icon={<PersonIcon fontSize="large" />}
              link="/CareerReview/CareerReview"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StudentTile
              title="Scorecard"
              icon={<AssignmentIcon fontSize="large" />}
              link="/Scorecard/ScoreCard"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StudentTile
              title="Placement"
              icon={<EmojiEventsIcon fontSize="large" />}
              link="/Placement/Placement"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StudentTile
              title="Attendance"
              icon={<TodayIcon fontSize="large" />}
              link="/student/attendance"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StudentTile
              title="Parent Teacher Meeting"
              icon={<GroupIcon fontSize="large" />}
              link="/student/ptm"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StudentTile
              title="PO Attainment and Bloom's Level"
              icon={<GroupIcon fontSize="large" />}
              link="/po-attainment-grading"
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};
export default Dashboard;
