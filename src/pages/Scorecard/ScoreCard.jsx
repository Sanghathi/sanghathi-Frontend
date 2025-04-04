// @mui
import { Container, Tab, Box, Tabs, useTheme } from "@mui/material";
// hooks
import useTabs from "../../hooks/useTabs";
// components
import Page from "../../components/Page";
import Iconify from "../../components/Iconify";
import React from "react";

import Iat from "./Iat";
import External from "./External";


export default function ScoreCard() {
  const { currentTab, onChangeTab } = useTabs("Iat");
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  
  const ACCOUNT_TABS = [
    {
      value: "Iat",
      icon: <Iconify icon={"ic:round-account-box"} width={20} height={20} />,
      component: <Iat/>,
    },
    {
      value: "External",
      icon: <Iconify icon={"ic:round-account-box"} width={20} height={20} />,
      component: <External/>,
    },
    
  ];
  
  return (
    <Page title="ScoreCard">
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