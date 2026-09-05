import {
  Box,
  FormLabel,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import * as React from "react";

const SETTINGS_DATA_KEY = "settings_data";
const TEXT_ALIGNMENT_KEY = "text_alignment";
type TextAlignment = "left" | "center" | "right";

function getSettings(): Record<string, unknown> {
  try {
    const saved = localStorage.getItem(SETTINGS_DATA_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

function saveSettings(alignment: TextAlignment) {
  const current = getSettings();
  localStorage.setItem(
    SETTINGS_DATA_KEY,
    JSON.stringify({ ...current, [TEXT_ALIGNMENT_KEY]: alignment }),
  );
}

export function Settings() {
  const [isDarkMode, setIsDarkMode] = React.useState(() => {
    return document.documentElement.getAttribute("data-theme") === "dark";
  });

  React.useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(
        document.documentElement.getAttribute("data-theme") === "dark",
      );
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  const [textAlignment, setTextAlignment] = React.useState<TextAlignment>(
    () => {
      const settings = getSettings();
      return (settings[TEXT_ALIGNMENT_KEY] as TextAlignment) || "center";
    },
  );

  const handleAlignmentChange = (
    _event: React.MouseEvent<HTMLElement>,
    newAlignment: TextAlignment | null,
  ) => {
    if (newAlignment !== null) {
      setTextAlignment(newAlignment);
      saveSettings(newAlignment);
      window.dispatchEvent(new Event("settings-changed"));
    }
  };

  return (
    <>
      <Box className="settings-sections" sx={{ position: "relative" }}>
        <Box sx={{ mb: 3 }}>
          <FormLabel
            sx={{
              display: "block",
              mb: 1,
              fontWeight: "bold",
              color: isDarkMode ? "white" : "text.primary",
            }}
          >
            Text Alignment
          </FormLabel>
          <ToggleButtonGroup
            value={textAlignment}
            exclusive
            onChange={handleAlignmentChange}
            aria-label="text alignment"
            size="small"
            sx={{
              bgcolor: isDarkMode ? "#17272d" : "transparent",
              border: isDarkMode ? "1px solid #edf1e8" : undefined,
              "& .MuiToggleButton-root": {
                color: isDarkMode ? "#edf1e8" : undefined,
                border: isDarkMode ? "1px solid #edf1e8" : undefined,
                "&.Mui-selected": {
                  bgcolor: isDarkMode ? "#24313b" : undefined,
                  color: isDarkMode ? "#edf1e8" : undefined,
                },
                "&:hover": {
                  bgcolor: isDarkMode ? "#1f333d" : undefined,
                },
              },
            }}
          >
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
      </Box>
    </>
  );
}
