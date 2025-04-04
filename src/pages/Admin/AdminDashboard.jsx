import React from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  useTheme,
  Box,
  Paper,
} from "@mui/material";
import {
  PersonAdd as PersonAddIcon,
  PeopleAlt as PeopleAltIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  Summarize as SummarizeIcon,
  SupervisorAccount as SupervisorAccountIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { blueGrey } from "@mui/material/colors";
import { alpha } from "@mui/material/styles";


const AdminTile = ({ title, icon, link }) => {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  
  return (
    <Card
      sx={{
        transition: "all 0.3s ease",
        borderRadius: 3,
        borderLeft: `4px solid ${isLight ? theme.palette.primary.main : theme.palette.info.main}`,
        overflow: 'hidden',
        backgroundColor: isLight 
          ? alpha(theme.palette.primary.main, 0.05)
          : alpha(theme.palette.info.main, 0.12),
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: isLight 
            ? theme.customShadows.primary
            : `0 10px 28px 0 ${alpha(theme.palette.info.dark, 0.3)}`,
        },
      }}
    >
      <CardActionArea component={Link} to={link}>
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
                ? alpha(theme.palette.primary.main, 0.1)
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
                ? alpha(theme.palette.primary.main, 0.1)
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

const AdminDashboard = () => {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  
  return (
    <Box
      sx={{
        pt: 3,
        pb: 5,
        backgroundColor: isLight 
          ? alpha(theme.palette.primary.lighter, 0.4)
          : alpha(theme.palette.grey[900], 0.2),
        minHeight: '100vh',
      }}
    >
      <Container maxWidth="xl" sx={{ p: isLight ? 0 : 0 }}>
        {isLight && (
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
                Admin Dashboard
              </Typography>
              
              <Typography 
                variant="body1" 
                color="text.secondary" 
                sx={{ maxWidth: '600px', mt: 3 }}
              >
                Welcome to the e-Mithru admin portal. Manage users and system data from here.
              </Typography>
            </Box>
          </Paper>
        )}
        
        {!isLight && (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mb: 4,
              mt: 1,
              borderRadius: 3,
              backgroundColor: alpha(theme.palette.background.paper, 0.6),
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
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
                Admin Dashboard
              </Typography>
              
              <Typography 
                variant="body1" 
                color="text.secondary" 
                sx={{ maxWidth: '600px', mt: 3 }}
              >
                Welcome to the e-Mithru admin portal. Manage users and system data from here.
              </Typography>
            </Box>
          </Paper>
        )}
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={isLight ? 6 : 6} lg={isLight ? 4 : 4}>
            <AdminTile
              title="Profile"
              icon={<PersonIcon />}
              link="/faculty/FacultyProfile"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={isLight ? 6 : 6} lg={isLight ? 4 : 4}>
            <AdminTile
              title="Add New User"
              icon={<PersonAddIcon />}
              link="/admin/add-user"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={isLight ? 6 : 6} lg={isLight ? 4 : 4}>
            <AdminTile
              title="Add Data"
              icon={<AssignmentIcon />}
              link="/admin/data"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={isLight ? 6 : 6} lg={isLight ? 4 : 4}>
            <AdminTile
              title="View All Users"
              icon={<PeopleAltIcon />}
              link="/admin/users"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={isLight ? 6 : 6} lg={isLight ? 4 : 4}>
            <AdminTile
              title="Assign Mentors"
              icon={<SupervisorAccountIcon />}
              link="/admin/mentor-assignment"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={isLight ? 6 : 6} lg={isLight ? 4 : 4}>
            <AdminTile
              title="Thread Reports"
              icon={<SummarizeIcon />}
              link="/report"
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminDashboard;