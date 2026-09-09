import "./App.css";
import { Box, createTheme, IconButton, ThemeProvider } from "@mui/material";
import { useEffect, useState } from "react";
import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import { Output } from "./pages/Output";
import { Help } from "./pages/Help";
import { Settings } from "./pages/Settings";
import { Templates } from "./pages/Templates";
import {
  applyThemeVars,
  DARK_THEMES,
  LIGHT_THEMES,
} from "./themeOptions";

const DARK_MODE_KEY = "dark_mode";
const ADVANCED_MODE_KEY = "advanced_mode";
const SETTINGS_DATA_KEY = "settings_data";
const LIGHT_THEME_KEY = "light_theme_index";
const DARK_THEME_KEY = "dark_theme_index";

function readInitialThemeIndices(): {
  light: number;
  dark: number;
} {
  try {
    const raw = localStorage.getItem(SETTINGS_DATA_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return {
      light:
        typeof parsed?.[LIGHT_THEME_KEY] === "number"
          ? parsed[LIGHT_THEME_KEY]
          : 0,
      dark:
        typeof parsed?.[DARK_THEME_KEY] === "number"
          ? parsed[DARK_THEME_KEY]
          : 0,
    };
  } catch {
    return { light: 0, dark: 0 };
  }
}

function App() {
  const [themeIndices, setThemeIndices] = useState(readInitialThemeIndices);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(DARK_MODE_KEY) === "true";
      document.documentElement.setAttribute(
        "data-theme",
        saved ? "dark" : "light",
      );
      applyThemeVars(saved, saved ? themeIndices.dark : themeIndices.light);
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

  useEffect(() => {
    const handleSettingsChanged = () => {
      setThemeIndices(readInitialThemeIndices());
    };
    window.addEventListener("settings-changed", handleSettingsChanged);
    return () => window.removeEventListener("settings-changed", handleSettingsChanged);
  });

  const toggleTheme = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    localStorage.setItem(DARK_MODE_KEY, String(next));
    document.documentElement.setAttribute(
      "data-theme",
      next ? "dark" : "light",
    );
    applyThemeVars(next, next ? themeIndices.dark : themeIndices.light);
  };

  const toggleAdvancedMode = () => {
    const next = !advancedMode;
    setAdvancedMode(next);
    localStorage.setItem(ADVANCED_MODE_KEY, String(next));
  };

  const availableThemes = isDarkMode ? DARK_THEMES : LIGHT_THEMES;
  const activeTheme = availableThemes[isDarkMode ? themeIndices.dark : themeIndices.light] ?? availableThemes[0];

  const muiTheme = createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
      primary: {
        main: activeTheme.accent,
      },
      background: {
        default: activeTheme.pageBg,
        paper: activeTheme.surface,
      },
      text: {
        primary: activeTheme.text,
        secondary: activeTheme.textMuted,
      },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={muiTheme}>
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
    </ThemeProvider>
  );
}

export default App;
