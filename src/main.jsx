import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

import { HelmetProvider } from "react-helmet-async";
import { AuthContext } from "./context/AuthContext";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import { SettingsProvider } from "./context/SettingsContext";

const domNode = document.getElementById("root");
const root = createRoot(domNode);

root.render(
  <AuthContextProvider>
    <HelmetProvider>
      <SettingsProvider>
        <Router>
          <App />
        </Router>
      </SettingsProvider>
    </HelmetProvider>
  </AuthContextProvider>

);
