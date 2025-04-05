import { Container, Tab, Box, Tabs, useTheme } from "@mui/material";
import useTabs from "../../hooks/useTabs";
import Page from "../../components/Page";
import Iconify from "../../components/Iconify";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import React from "react";
import Counselling from "./Counselling";
import ParentTeacherMeet from "./ParentTeacherMeet";

export default function Ptm() {
    const { currentTab, onChangeTab } = useTabs("Counselling Record");
    const theme = useTheme();
    const isLight = theme.palette.mode === 'light';
    const colorMode = isLight ? 'primary' : 'info';
    
    const ACCOUNT_TABS = [
      {
        value: "Counselling Record",
        icon: <Iconify icon={"ic:round-account-box"} width={20} height={20} />,
        component: <Counselling colorMode={colorMode} />,
      },
      {
        value: "Parent-Teachers Meet Record",
        icon: <Iconify icon={"ic:round-account-box"} width={20} height={20} />,
        component: <ParentTeacherMeet colorMode={colorMode} />,
      },
     
    ];
  return (
    <div>
       <Page title="PTM">
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
