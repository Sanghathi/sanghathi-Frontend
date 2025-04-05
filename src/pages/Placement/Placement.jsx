import React from 'react'
import { Container, Tab, Box, Tabs, useTheme } from "@mui/material";
import useTabs from "../../hooks/useTabs";
import Page from "../../components/Page";
import Iconify from "../../components/Iconify";
import PlacementDetails from './PlacementDetails';
import InternshipDetails from './InternshipDetails';
import Project from './Project';

export default function Placement() {
    const { currentTab, onChangeTab } = useTabs("Placement Details");
    const theme = useTheme();
    const isLight = theme.palette.mode === 'light';
    const colorMode = isLight ? 'primary' : 'info';
    
    const ACCOUNT_TABS = [
      {
        value: "Placement Details",
        icon: <Iconify icon={"ic:round-account-box"} width={20} height={20} />,
        component: <PlacementDetails colorMode={colorMode} />,
      },
      {
        value: "Internship Details",
        icon: <Iconify icon={"ic:round-account-box"} width={20} height={20} />,
        component: <InternshipDetails colorMode={colorMode} />,
      },
      {
        value: "Final Year Project Details",
        icon: <Iconify icon={"ic:round-account-box"} width={20} height={20} />,
        component: <Project colorMode={colorMode} />,
      },
     
    ];


  return (
    <div>
       <Page title="Stduent Profile">
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
    </div>
  )
}
