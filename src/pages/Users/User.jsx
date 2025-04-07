import { capitalCase } from "change-case";
import { useState } from "react";
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

import UserForm from "./UserForm";
import UserList from "./UserList";
import React from "react";

// ----------------------------------------------------------------------

export default function User() {
  const theme = useTheme();
  const [editingUser, setEditingUser] = useState(null);
  const { currentTab, onChangeTab } = useTabs("Create User");

  const ACCOUNT_TABS = [
    {
      value: "Create User",
      icon: <Iconify icon={"ic:round-account-box"} width={20} height={20} />,
      component: <UserForm editingUser={editingUser} />,
    },
    // {
    //   value: "User List",
    //   icon: <Iconify icon={"ic:round-account-box"} width={20} height={20} />,
    //   component: (
    //     <UserList
    //       onEdit={(user) => {
    //         setEditingUser(user);
    //         onChangeTab(null, "Create User");
    //       }}
    //     />
    //   ),
    // },
  ];

  return (
    <Page title="User: Account Settings">
      <Container maxWidth="lg">
        <Tabs
          allowScrollButtonsMobile
          variant="scrollable"
          scrollButtons="auto"
          value={currentTab}
          onChange={onChangeTab}
          sx={{
            '& .MuiTab-root': {
              color: theme.palette.text.secondary,
              '&.Mui-selected': {
                color: theme.palette.info.main,
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: theme.palette.info.main,
            },
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

        <Box sx={{ mb: 5 }} />

        {ACCOUNT_TABS.map((tab) => {
          const isMatched = tab.value === currentTab;
          return isMatched && <Box key={tab.value}>{tab.component}</Box>;
        })}
      </Container>
    </Page>
  );
}
