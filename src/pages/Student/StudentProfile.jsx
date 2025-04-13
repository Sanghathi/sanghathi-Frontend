import { capitalCase } from "change-case";
import { AuthContext } from "../../context/AuthContext";
import { useState, useContext, useEffect } from "react";
// @mui
import { Container, Tab, Box, Tabs, useTheme } from "@mui/material";
import { useLocation } from "react-router-dom";
// routes

// hooks
import useTabs from "../../hooks/useTabs";

// components
import Page from "../../components/Page";
import Iconify from "../../components/Iconify";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
// sections

import React from "react";
import StudentDetailsForm from "./StudentDetailsForm";
import AdmissionDetails from "./AdmissionDetails";
import LocalGuardianForm from "./LocalGuardianForm";
import ParentsDetails from "./ParentsDetails";
import ContactDetails from "./ContactDetails";
import Academic from "./Academic";
import PrevAcademic from "./PrevAcademic";

// ----------------------------------------------------------------------


export default function StudentProfile() {
  const { currentTab, onChangeTab } = useTabs("Student Details");
  const theme = useTheme();
  const location = useLocation();
  const isLight = theme.palette.mode === 'light';
  const colorMode = isLight ? 'primary' : 'info';
  
  // Check if we're in admin edit mode
  const searchParams = new URLSearchParams(location.search);
  const isAdminEdit = searchParams.get('adminEdit') === 'true';
  const menteeId = searchParams.get('menteeId');

  // Define all available tabs
  const ALL_TABS = [
    {
      value: "Student Details",
      icon: <Iconify icon={"ic:round-account-box"} width={20} height={20} />,
      component: <StudentDetailsForm colorMode={colorMode} menteeId={menteeId} isAdminEdit={isAdminEdit} />,
    },
    {
      value: "Parent Details",
      icon: <Iconify icon={"ic:round-account-box"} width={20} height={20} />,
      component: <ParentsDetails colorMode={colorMode} />,
    },
    {
      value: "Guardian Details",
      icon: <Iconify icon={"ic:round-receipt"} width={20} height={20} />,
      component: <LocalGuardianForm colorMode={colorMode} />,
    },
    {
      value: "Contact Details",
      icon: <Iconify icon={"eva:bell-fill"} width={20} height={20} />,
      component: <ContactDetails colorMode={colorMode} />,
    },
    {
      value: "Academic Details",
      icon: <Iconify icon={"eva:share-fill"} width={20} height={20} />,
      component: <PrevAcademic colorMode={colorMode} />,
    },
    {
      value: "Admission Details",
      icon: <Iconify icon={"eva:share-fill"} width={20} height={20} />,
      component: <AdmissionDetails colorMode={colorMode} />,
    },
  ];

  // Use only student details tab for admin edit mode, all tabs for regular student view
  const ACCOUNT_TABS = isAdminEdit ? [ALL_TABS[0]] : ALL_TABS;

  return (
    <Page title="Student Profile">
      <Container maxWidth="lg">
        <Tabs
          allowScrollButtonsMobile
          variant="scrollable"
          scrollButtons="auto"
          value={currentTab}
          onChange={onChangeTab}
          sx={{
            '& .MuiTab-root': {
              color: isLight ? theme.palette.text.secondary : theme.palette.text.primary,
              '&.Mui-selected': {
                color: isLight ? theme.palette.primary.main : theme.palette.info.main
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: isLight ? theme.palette.primary.main : theme.palette.info.main
            }
          }}
        >
          {ACCOUNT_TABS.map((tab) => (
            <Tab
              disableRipple
              key={tab.value}
              label={tab.value}
              icon={tab.icon}
              value={tab.value}
            />
          ))}
        </Tabs>

        <Box sx={{ mb: 5 }} />

        {ACCOUNT_TABS.map((tab) => {
          const isMatched = tab.value === currentTab;
          return isMatched && <Box key={tab.value}>{tab.component}</Box>;
        })}
      </Container>
    </Page>
  );
}
