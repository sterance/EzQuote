import "./App.css";
import { Box, IconButton } from "@mui/material";
import { useState } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import Output from "./pages/Output";
import { Templates } from "./pages/Templates";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

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
          onClick={() => setIsDarkMode((current) => !current)}
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
