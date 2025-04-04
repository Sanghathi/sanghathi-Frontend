// @mui
import { Container, Tab, Box, Tabs, useTheme } from "@mui/material";
// hooks
import useTabs from "../../hooks/useTabs";
// components
import Page from "../../components/Page";
import Iconify from "../../components/Iconify";
import React from "react";

import CareerCounselling from "./CareerCounselling";
import Mooc from "./Mooc";
import ProfessionalBodiesSection from "./ProfessionalBodiesSection";
import ClubsSection from "./ClubsSection";
import MiniProject from "./MiniProject";
import Activity from "./Activity";
import Hobbies from "./Hobbies";


export default function CareerReview() {
  const { currentTab, onChangeTab } = useTabs("Career Counselling");
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  
  const ACCOUNT_TABS = [
    {
      value: "Career Counselling",
      icon: <Iconify icon={"ic:round-account-box"} width={20} height={20} />,
      component: <CareerCounselling/>,
    },
    
    {
      value: "Clubs",
      icon: <Iconify icon={"ic:round-account-box"} width={20} height={20} />,
      component: <ClubsSection />, 
    },

    {
      value: "Professional Bodies",
      icon: <Iconify icon={"ic:round-account-box"} width={20} height={20} />,
      component: <ProfessionalBodiesSection/>,
    },

    {
      value: "Mooc Courses",
      icon: <Iconify icon={"ic:round-account-box"} width={20} height={20} />,
      component: <Mooc/>,
    },
    
    {
      value: "Mini Project",
      icon: <Iconify icon={"ic:round-account-box"} width={20} height={20} />,
      component: <MiniProject/>,
    },

    {
      value: "Activity",
      icon: <Iconify icon={"ic:round-account-box"} width={20} height={20} />,
      component: <Activity/>,
    },
    {
      value: "Hobbies",
      icon: <Iconify icon={"ic:round-account-box"} width={20} height={20} />,
      component: <Hobbies />,
    },

  ];
  
  return (
    <Page title="Career Review">
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