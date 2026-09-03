import "./App.css";
import { Box, IconButton } from "@mui/material";
import { useState } from "react";
import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import { Output } from "./pages/Output";
import { Help } from "./pages/Help";
import { Settings } from "./pages/Settings";
import { Templates } from "./pages/Templates";

const DARK_MODE_KEY = "dark_mode";
const ADVANCED_MODE_KEY = "advanced_mode";

function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(DARK_MODE_KEY) === "true";
      document.documentElement.setAttribute(
        "data-theme",
        saved ? "dark" : "light",
      );
      return saved;
    } catch {
      return false;
    }
  });

  const [advancedMode, setAdvancedMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem(ADVANCED_MODE_KEY) === "true";
    } catch {
      return false;
    }
  });

  const toggleTheme = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    localStorage.setItem(DARK_MODE_KEY, String(next));
    document.documentElement.setAttribute(
      "data-theme",
      next ? "dark" : "light",
    );
  };

  const toggleAdvancedMode = () => {
    const next = !advancedMode;
    setAdvancedMode(next);
    localStorage.setItem(ADVANCED_MODE_KEY, String(next));
  };

  return (
    <Box className="app-shell" data-theme={isDarkMode ? "dark" : "light"}>
      <Box component="nav" className="top-nav" aria-label="Main navigation">
        <span className="brand-mark">EzQuote</span>
        <Box className="nav-links">
          <NavLink to="/output">Output</NavLink>
          <NavLink to="/templates">Templates</NavLink>
          <NavLink to="/help">Help</NavLink>
          <NavLink to="/settings">Settings</NavLink>
        </Box>
        <IconButton
          className="theme-toggle"
          aria-label={
            isDarkMode ? "Switch to light mode" : "Switch to dark mode"
          }
          title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          onClick={toggleTheme}
        >
          <span aria-hidden="true">{isDarkMode ? "☀" : "☾"}</span>
        </IconButton>
      </Box>

<Box component="main" className="main-content">
         <Routes>
           <Route path="/output" element={<Output advancedMode={advancedMode} onToggleAdvancedMode={toggleAdvancedMode} />} />
           <Route path="/templates" element={<Templates />} />
           <Route path="/help" element={<Help />} />
           <Route path="/settings" element={<Settings />} />
           <Route path="*" element={<Navigate to="/output" replace />} />
         </Routes>
       </Box>
    </Box>
  );
}

export default App;
