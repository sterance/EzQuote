import "./App.css";
import { Box, createTheme, IconButton, ThemeProvider, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import { Output } from "./pages/Output";
import { Help } from "./pages/Help";
import { Settings } from "./pages/Settings";
import { Templates } from "./pages/Templates";
import { ConfirmationModal } from "./components/ConfirmationModal";
import { applyDemoDataPreseeding, getInitialDemoTemplates } from "./hooks/useTemplateStore";
import { applyThemeVars, DARK_THEMES, LIGHT_THEMES } from "./themeOptions";

const DARK_MODE_KEY = "dark_mode";
const SETTINGS_DATA_KEY = "settings_data";
const LIGHT_THEME_KEY = "light_theme_index";
const DARK_THEME_KEY = "dark_theme_index";
const DEMO_STORAGE_KEY = "template_data_demo";
const DEMO_OUTPUT_STORAGE_KEY = "output_data_demo";

function readInitialThemeIndices(): {
  light: number;
  dark: number;
} {
  try {
    const raw = localStorage.getItem(SETTINGS_DATA_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return {
      light: typeof parsed?.[LIGHT_THEME_KEY] === "number" ? parsed[LIGHT_THEME_KEY] : 0,
      dark: typeof parsed?.[DARK_THEME_KEY] === "number" ? parsed[DARK_THEME_KEY] : 0,
    };
  } catch {
    return { light: 0, dark: 0 };
  }
}

function App() {
  const isDemoRoute = location.pathname.startsWith("/demo");
  const [themeIndices, setThemeIndices] = useState(readInitialThemeIndices);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(DARK_MODE_KEY) === "true";
      document.documentElement.setAttribute("data-theme", saved ? "dark" : "light");
      applyThemeVars(saved, saved ? themeIndices.dark : themeIndices.light);
      return saved;
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

  useEffect(() => {
    if (!isDemoRoute) return;

    if (localStorage.getItem(DEMO_STORAGE_KEY) === null) {
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(getInitialDemoTemplates()));
    }
    if (localStorage.getItem(DEMO_OUTPUT_STORAGE_KEY) === null) {
      localStorage.setItem(DEMO_OUTPUT_STORAGE_KEY, JSON.stringify({ enabledGroups: {}, textFills: {} }));
    }
  }, [isDemoRoute]);

  const toggleTheme = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    localStorage.setItem(DARK_MODE_KEY, String(next));
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    applyThemeVars(next, next ? themeIndices.dark : themeIndices.light);
  };

  const resetDemoTemplates = () => {
    const initialTemplates = applyDemoDataPreseeding(getInitialDemoTemplates());
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(initialTemplates));
    setIsResetModalOpen(false);
    window.location.reload();
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
            {isDemoRoute && (
              <Box sx={{ display: "flex", gap: 1, mr: 1, alignItems: "center" }}>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => {
                    window.location.href = location.pathname.replace(/^\/demo/, "") || "/output";
                  }}
                >
                  Try It!
                </Button>
                <Button size="small" variant="outlined" color="inherit" onClick={() => setIsResetModalOpen(true)}>
                  Reset
                </Button>
              </Box>
            )}
            {isDemoRoute ? (
              <>
                <NavLink to="/demo/output">Output</NavLink>
                <NavLink to="/demo/templates">Templates</NavLink>
                <NavLink to="/demo/help">Help</NavLink>
                <NavLink to="/demo/settings">Settings</NavLink>
              </>
            ) : (
              <>
                <NavLink to="/output">Output</NavLink>
                <NavLink to="/templates">Templates</NavLink>
                <NavLink to="/help">Help</NavLink>
                <NavLink to="/settings">Settings</NavLink>
              </>
            )}
          </Box>
          <IconButton className="theme-toggle" onClick={toggleTheme} aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"} title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}>
            <span aria-hidden="true">{isDarkMode ? "☀" : "☾"}</span>
          </IconButton>
        </Box>

        <Box component="main" className="main-content">
          <Routes>
            <Route path="*" element={<Navigate to="/output" replace />} />
            <Route path="/output" element={<Output key="output" />} />
            <Route path="/templates" element={<Templates key="templates" />} />
            <Route path="/help" element={<Help />} />
            <Route path="/settings" element={<Settings />} />

            <Route path="/demo" element={<Navigate to="/demo/output" replace />} />
            <Route path="/demo/output" element={<Output key="demo-output" />} />
            <Route path="/demo/templates" element={<Templates key="demo-templates" />} />
            <Route path="/demo/help" element={<Help />} />
            <Route path="/demo/settings" element={<Settings />} />
          </Routes>
        </Box>
        <ConfirmationModal isOpen={isResetModalOpen} message="Reset demo to its initial state?" onConfirm={resetDemoTemplates} onCancel={() => setIsResetModalOpen(false)} />
      </Box>
    </ThemeProvider>
  );
}

export default App;
