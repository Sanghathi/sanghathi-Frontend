import { capitalCase } from "change-case";
import { AuthContext } from "../../context/AuthContext";
import { useState, useContext } from "react";
// @mui
import { Container, Tab, Box, Tabs, useTheme } from "@mui/material";
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
  const isLight = theme.palette.mode === 'light';
  
  const ACCOUNT_TABS = [
    {
      value: "Student Details",
      icon: <Iconify icon={"ic:round-account-box"} width={20} height={20} />,
      component: <StudentDetailsForm />,
    },
    {
      value: "Parent Details",
      icon: <Iconify icon={"ic:round-account-box"} width={20} height={20} />,
      component: <ParentsDetails />,
    },
    {
      value: "Guardian Details",
      icon: <Iconify icon={"ic:round-receipt"} width={20} height={20} />,
      component: <LocalGuardianForm />,
    },
    {
      value: "Contact Details",
      icon: <Iconify icon={"eva:bell-fill"} width={20} height={20} />,
      component: <ContactDetails />,
    },
    {
      value: "Academic Details",
      icon: <Iconify icon={"eva:share-fill"} width={20} height={20} />,
      component: <PrevAcademic />,
    },
    {
      value: "Admission Details",
      icon: <Iconify icon={"eva:share-fill"} width={20} height={20} />,
      component: <AdmissionDetails />,
    },
  ];

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
