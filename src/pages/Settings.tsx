import { Box, FormLabel, ToggleButton, ToggleButtonGroup } from "@mui/material";
import * as React from "react";
import { applyThemeVars, DARK_THEMES, LIGHT_THEMES } from "../themeOptions";
import NumberField from "../components/NumberField";

const SETTINGS_DATA_KEY = "settings_data";
const TEXT_ALIGNMENT_KEY = "text_alignment";
const SPACES_BETWEEN_PARAGRAPHS_KEY = "spaces_between_paragraphs";
const LIGHT_THEME_KEY = "light_theme_index";
const DARK_THEME_KEY = "dark_theme_index";
type TextAlignment = "left" | "center" | "right";

function getSettings(): Record<string, unknown> {
  try {
    const saved = localStorage.getItem(SETTINGS_DATA_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

function saveSettings(updates: Record<string, unknown>) {
  const current = getSettings();
  localStorage.setItem(SETTINGS_DATA_KEY, JSON.stringify({ ...current, ...updates }));
}

export function Settings() {
  const [isDarkMode, setIsDarkMode] = React.useState(() => {
    return document.documentElement.getAttribute("data-theme") === "dark";
  });

  React.useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.getAttribute("data-theme") === "dark");
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  const [textAlignment, setTextAlignment] = React.useState<TextAlignment>(() => {
    const settings = getSettings();
    return (settings[TEXT_ALIGNMENT_KEY] as TextAlignment) || "left";
  });

  const [spacesBetweenParagraphs, setSpacesBetweenParagraphs] = React.useState<number>(() => {
    const settings = getSettings();
    return typeof settings[SPACES_BETWEEN_PARAGRAPHS_KEY] === "number" ? settings[SPACES_BETWEEN_PARAGRAPHS_KEY] : 1;
  });

  const [lightThemeIndex, setLightThemeIndex] = React.useState<number>(() => {
    const settings = getSettings();
    const value = settings[LIGHT_THEME_KEY];
    return typeof value === "number" ? value : 0;
  });

  const [darkThemeIndex, setDarkThemeIndex] = React.useState<number>(() => {
    const settings = getSettings();
    const value = settings[DARK_THEME_KEY];
    return typeof value === "number" ? value : 0;
  });

  const handleAlignmentChange = (_event: React.MouseEvent<HTMLElement>, newAlignment: TextAlignment | null) => {
    if (newAlignment !== null) {
      setTextAlignment(newAlignment);
      saveSettings({ [TEXT_ALIGNMENT_KEY]: newAlignment });
      window.dispatchEvent(new Event("settings-changed"));
    }
  };

  const handleSpacesBetweenParagraphsChange = (value: number | null) => {
    if (value !== null && value >= 0) {
      setSpacesBetweenParagraphs(value);
      saveSettings({ [SPACES_BETWEEN_PARAGRAPHS_KEY]: value });
      window.dispatchEvent(new Event("settings-changed"));
    }
  };

  const handleLightThemeChange = (_event: React.MouseEvent<HTMLElement>, newIndex: number | null) => {
    if (newIndex !== null) {
      setLightThemeIndex(newIndex);
      saveSettings({ [LIGHT_THEME_KEY]: newIndex });
      if (!isDarkMode) {
        applyThemeVars(false, newIndex);
      }
      window.dispatchEvent(new Event("settings-changed"));
    }
  };

  const handleDarkThemeChange = (_event: React.MouseEvent<HTMLElement>, newIndex: number | null) => {
    if (newIndex !== null) {
      setDarkThemeIndex(newIndex);
      saveSettings({ [DARK_THEME_KEY]: newIndex });
      if (isDarkMode) {
        applyThemeVars(true, newIndex);
      }
      window.dispatchEvent(new Event("settings-changed"));
    }
  };

  return (
    <>
      <Box
        className="settings-sections"
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box sx={{ mb: 3, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <FormLabel
            sx={{
              display: "block",
              mb: 1,
              fontSize: "1.25rem",
              fontWeight: "bold",
              color: "var(--text)",
              textAlign: "center",
            }}
          >
            Input Text Alignment
          </FormLabel>
          <ToggleButtonGroup value={textAlignment} exclusive onChange={handleAlignmentChange} aria-label="text alignment" size="small" sx={toggleGroupSx(isDarkMode)}>
            <ToggleButton value="left" aria-label="left align">
              Left
            </ToggleButton>
            <ToggleButton value="center" aria-label="center align">
              Center
            </ToggleButton>
            <ToggleButton value="right" aria-label="right align">
              Right
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box sx={{ mb: 3, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <FormLabel
            sx={{
              display: "block",
              mb: 1,
              fontSize: "1.25rem",
              fontWeight: "bold",
              color: "var(--text)",
              textAlign: "center",
            }}
          >
            Spaces Between Paragraphs
          </FormLabel>
          <NumberField size="small" value={spacesBetweenParagraphs} onValueChange={handleSpacesBetweenParagraphsChange} sx={{ width: 70 }} />
        </Box>

        <Box sx={{ mb: 3 }}>
          <FormLabel
            sx={{
              display: "block",
              mb: 1,
              fontSize: "1.25rem",
              fontWeight: "bold",
              color: "var(--text)",
              textAlign: "center",
            }}
          >
            Light Mode Theme
          </FormLabel>
          <ToggleButtonGroup value={lightThemeIndex} exclusive onChange={handleLightThemeChange} aria-label="light mode theme" size="small" sx={toggleGroupSx(isDarkMode)}>
            {LIGHT_THEMES.map((theme, index) => (
              <ToggleButton key={theme.label} value={index} aria-label={theme.label} title={theme.label} sx={toggleButtonSx}>
                <Box
                  component="span"
                  aria-hidden="true"
                  sx={{
                    display: "inline-block",
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    backgroundColor: theme.accent,
                    border: "1px solid rgba(0,0,0,0.2)",
                    mr: 0.75,
                    verticalAlign: "middle",
                  }}
                />
                {theme.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        <Box sx={{ mb: 3 }}>
          <FormLabel
            sx={{
              display: "block",
              mb: 1,
              fontSize: "1.25rem",
              fontWeight: "bold",
              color: "var(--text)",
              textAlign: "center",
            }}
          >
            Dark Mode Theme
          </FormLabel>
          <ToggleButtonGroup value={darkThemeIndex} exclusive onChange={handleDarkThemeChange} aria-label="dark mode theme" size="small" sx={toggleGroupSx(isDarkMode)}>
            {DARK_THEMES.map((theme, index) => (
              <ToggleButton key={theme.label} value={index} aria-label={theme.label} title={theme.label} sx={toggleButtonSx}>
                <Box
                  component="span"
                  aria-hidden="true"
                  sx={{
                    display: "inline-block",
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    backgroundColor: theme.accent,
                    border: "1px solid rgba(0,0,0,0.2)",
                    mr: 0.75,
                    verticalAlign: "middle",
                  }}
                />
                {theme.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
      </Box>
    </>
  );
}

function toggleGroupSx(isDarkMode: boolean) {
  return {
    flexWrap: "wrap",
    justifyContent: "center", // <-- centers buttons in each row
    bgcolor: isDarkMode ? "var(--surface)" : "transparent",
    "& .MuiToggleButton-root": {
      color: "var(--text)",
      border: isDarkMode ? "1px solid var(--border)" : undefined,
      "&.Mui-selected": {
        bgcolor: isDarkMode ? "var(--surface-muted)" : undefined,
        color: "var(--text)",
      },
      "&:hover": {
        bgcolor: isDarkMode ? "var(--surface-muted)" : undefined,
      },
    },
  } as const;
}

function toggleButtonSx() {
  return {
    color: "var(--text)",
    "&.Mui-selected": {
      bgcolor: "var(--surface-muted)",
      color: "var(--text)",
    },
    "&:hover": {
      bgcolor: "var(--surface-muted)",
    },
  } as const;
}
