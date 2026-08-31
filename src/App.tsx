import "./App.css";
import { Box, IconButton } from "@mui/material";
import { useState } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import Output from "./pages/Output";
import { Templates } from "./pages/Templates";

const DARK_MODE_KEY = "dark_mode";

function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(DARK_MODE_KEY) === "true";
      document.documentElement.setAttribute("data-theme", saved ? "dark" : "light");
      return saved;
    } catch {
      return false;
    }
  });

  const toggleTheme = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    localStorage.setItem(DARK_MODE_KEY, String(next));
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
  };

  return (
    <Box className="app-shell" data-theme={isDarkMode ? "dark" : "light"}>
      <Box component="nav" className="top-nav" aria-label="Main navigation">
        <span className="brand-mark">App</span>
        <Box className="nav-links">
          <NavLink to="/output">Output</NavLink>
          <NavLink to="/templates">Templates</NavLink>
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
          <Route path="/output" element={<Output />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="*" element={<Output />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
