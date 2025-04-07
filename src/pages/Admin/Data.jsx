import { capitalCase } from "change-case";
import { useState } from "react";
// @mui
import { 
  Container, 
  Tab, 
  Box, 
  Tabs, 
  Paper,
  Typography 
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

// routes

// hooks
import useTabs from "../../hooks/useTabs";

// components
import Page from "../../components/Page";
import Iconify from "../../components/Iconify";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
// sections

import AddIat from "./AddIat";
import AddAttendance from "./AddAttendance";
import AddStudents from "./AddStudents";
import AddMarks from "../Scorecard/AddMarks";
import React from "react";

// ----------------------------------------------------------------------

export default function Data() {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const [editingUser, setEditingUser] = useState(null);
  const { currentTab, onChangeTab } = useTabs("Add Users");

  // Get the color based on the current theme mode
  const activeColor = isLight ? theme.palette.primary.main : theme.palette.info.main;

  const ACCOUNT_TABS = [
    {
      value: "Add Users",
      icon: <Iconify icon={"ic:round-account-box"} width={20} height={20} />,
      component: <AddStudents editingUser={editingUser} />,
    },
    {
      value: "Add Attendance",
      icon: <Iconify icon={"ic:round-account-box"} width={20} height={20} />,
      component: <AddAttendance editingUser={editingUser} />,
    },
    {
      value: "Add IAT Marks",
      icon: <Iconify icon={"ic:round-account-box"} width={20} height={20} />,
      component: (
        <AddIat
          onEdit={(user) => {
            setEditingUser(user);
            onChangeTab(null, "Add IAT Marks");
          }}
        />
      ),
    },
    {
      value: "Add External Marks",
      icon: <Iconify icon={"ic:round-account-box"} width={20} height={20} />,
      component: (
        <AddMarks
          onEdit={(user) => {
            setEditingUser(user);
            onChangeTab(null, "Add External Marks");
          }}
        />
      ),
    },
  ];

  return (
    <Page title="User: Account Settings">
      <Container maxWidth="lg">
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
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
              mb: 3
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
              Data Management
            </Typography>
            
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto' }}
            >
              Upload and manage data for students, attendance, and academic records
            </Typography>
          </Box>

          <Tabs
            allowScrollButtonsMobile
            variant="scrollable"
            scrollButtons="auto"
            value={currentTab}
            onChange={onChangeTab}
            textColor="inherit"
            TabIndicatorProps={{
              style: {
                backgroundColor: activeColor
              }
            }}
            sx={{
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '3px 3px 0 0',
              },
              '& .MuiTab-root': {
                minHeight: 48,
                px: 3,
                mx: 0.5,
                borderRadius: '8px 8px 0 0',
                transition: 'all 0.2s',
                '&.Mui-selected': {
                  color: activeColor,
                  backgroundColor: alpha(activeColor, isLight ? 0.1 : 0.2),
                  fontWeight: 'bold',
                },
                '&:hover': {
                  backgroundColor: alpha(activeColor, isLight ? 0.05 : 0.1),
                  color: theme.palette.text.primary,
                },
              }
            }}
          >
            {ACCOUNT_TABS.map((tab) => (
              <Tab
                disableRipple
                key={tab.value}
                label={capitalCase(tab.value)}
                icon={tab.icon}
                value={tab.value}
              />
            ))}
          </Tabs>
        </Paper>

        {ACCOUNT_TABS.map((tab) => {
          const isMatched = tab.value === currentTab;
          return isMatched && <Box key={tab.value}>{tab.component}</Box>;
        })}
      </Container>
    </Page>
  );
}
