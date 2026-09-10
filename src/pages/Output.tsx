import { Alert, Box, Button, Link, Snackbar, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import * as React from "react";
import { Link as RouterLink } from "react-router-dom";
import { useTemplateStore } from "../hooks/useTemplateStore";
import OutputGroup from "../components/OutputGroup";
import OutputOptions from "../components/OutputOptions";
import Textbox from "../components/Textbox";
import { extractTags } from "../utils/templateUtils";
import { formatSelections } from "../utils/textFormatting";
import { ConfirmationModal } from "../components/ConfirmationModal";
import AdjustIcon from "@mui/icons-material/Adjust";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";

const STORAGE_KEY = "output_data";
const SETTINGS_DATA_KEY = "settings_data";
const SPACES_BETWEEN_PARAGRAPHS_KEY = "spaces_between_paragraphs";

function getSettings(): Record<string, unknown> {
  try {
    const saved = localStorage.getItem(SETTINGS_DATA_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

function fillTemplate(template: string, fills: Record<string, string[]>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => formatSelections(fills[key] ?? []));
}

export function Output({ advancedMode, onToggleAdvancedMode }: { advancedMode: boolean; onToggleAdvancedMode: () => void }) {
  const { groups } = useTemplateStore();
  const [enabledGroups, setEnabledGroups] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.enabledGroups ?? {};
      } catch {
        console.error("Failed to parse local storage data.");
      }
    }
    return {};
  });
  const [textFills, setTextFills] = useState<Record<string, Record<string, string[]>>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.textFills ?? {};
      } catch {
        console.error("Failed to parse local storage data.");
      }
    }
    return {};
  });
  const [spacesBetweenParagraphs, setSpacesBetweenParagraphs] = useState<number>(() => {
    const settings = getSettings();
    return typeof settings[SPACES_BETWEEN_PARAGRAPHS_KEY] === "number" ? settings[SPACES_BETWEEN_PARAGRAPHS_KEY] : 1;
  });

  React.useEffect(() => {
    const handleSettingsChanged = () => {
      const settings = getSettings();
      setSpacesBetweenParagraphs(typeof settings[SPACES_BETWEEN_PARAGRAPHS_KEY] === "number" ? settings[SPACES_BETWEEN_PARAGRAPHS_KEY] : 1);
    };
    window.addEventListener("settings-changed", handleSettingsChanged);
    return () => window.removeEventListener("settings-changed", handleSettingsChanged);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ enabledGroups, textFills }));
  }, [enabledGroups, textFills]);

  const handleToggleGroup = (groupId: string, enabled: boolean) => {
    setEnabledGroups((current) => ({ ...current, [groupId]: enabled }));
  };

  const output = useMemo(() => {
    return groups
      .map((group) => {
        if (!enabledGroups[group.id]) return null;

        const tags = extractTags(group.template);
        if (tags.length === 0) {
          return group.template;
        }
        const fills: Record<string, string[]> = {};
        const groupFills = textFills[group.id] ?? {};
        for (const tag of tags) {
          if (groupFills[tag] === undefined) {
            fills[tag] = (group.fills[tag] ?? []).filter((f) => f.starred).map((f) => f.text);
          } else {
            fills[tag] = groupFills[tag];
          }
        }
        return fillTemplate(group.template, fills);
      })
      .filter((line): line is string => Boolean(line))
      .join("\n".repeat(spacesBetweenParagraphs + 1));
  }, [enabledGroups, groups, textFills, spacesBetweenParagraphs]);

  const hasDataToClear = useMemo(() => {
    return Object.values(enabledGroups).some(Boolean) || Object.keys(textFills).length > 0;
  }, [enabledGroups, textFills]);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCopy = async () => {
    try {
      if (window.electronAPI?.writeClipboardText) {
        await window.electronAPI.writeClipboardText(output);
      } else {
        await navigator.clipboard.writeText(output);
      }
      setSnackbar({
        open: true,
        message: "Copied to clipboard!",
        severity: "success",
      });
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to copy to clipboard. Please copy manually.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = (_: unknown, reason?: string) => {
    if (reason === "clickaway") return;
    setSnackbar((current) => ({ ...current, open: false }));
  };

  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);

  const handleClearAll = () => {
    setEnabledGroups({});
    setTextFills({});
  };

  return (
    <>
      <Box
        className="button-sections"
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={onToggleAdvancedMode}
          className="advanced-btn"
          startIcon={advancedMode ? <RocketLaunchIcon /> : <AdjustIcon />}
          sx={{
            position: "absolute",
            top: 8,
            left: 8,
            zIndex: 1,
            display: "none", // button disabled until simple/advanced functionality implemented, remove this line to re-enable
          }}
        >
          {advancedMode ? "Advanced Mode" : "Simple Mode"}
        </Button>
        {groups.length > 0 && (
          <>
            <Typography variant="h5" sx={{ position: "absolute", left: "50%", transform: "translate(-50%, -50%)" }}>
              Output Selections
            </Typography>
            <Button variant="outlined" color="error" size="small" onClick={() => setClearConfirmOpen(true)} disabled={!hasDataToClear} className="clear-all-btn" sx={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}>
              Clear All
            </Button>
          </>
        )}
        {groups.length === 0 && (
          <Box sx={{ m: 0, textAlign: "center" }}>
            No template groups exist yet. Create or import templates on the{" "}
            <Link component={RouterLink} to="/templates">
              Templates page
            </Link>
            .
          </Box>
        )}
        {groups.map((group, index) => {
          const tags = extractTags(group.template);
          const hasTags = tags.length > 0;

          if (!hasTags) {
            return <OutputGroup key={group.id} label={group.label} enabled={Boolean(enabledGroups[group.id])} onToggleEnabled={(enabled) => handleToggleGroup(group.id, enabled)} sx={{ mt: index === 0 ? 6 : 0 }} />;
          }

          return (
            <OutputGroup key={group.id} label={group.label} enabled={Boolean(enabledGroups[group.id])} onToggleEnabled={(enabled) => handleToggleGroup(group.id, enabled)} sx={{ mt: index === 0 ? 4 : 0 }}>
              <OutputOptions
                fills={group.fills || {}}
                template={group.template}
                textFills={textFills[group.id] ?? {}}
                enabled={Boolean(enabledGroups[group.id])}
                onChange={(fills) =>
                  setTextFills((current) => ({
                    ...current,
                    [group.id]: fills,
                  }))
                }
              />
            </OutputGroup>
          );
        })}
      </Box>
      <Typography variant="h5" sx={{ textAlign: "center", mt: 2 }}>
        Output
      </Typography>
      <Textbox placeholder="Output will appear here once options are selected above." value={output} />
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button className="copy-clipboard-btn" variant="contained" color="primary" onClick={handleCopy} disabled={!output}>
          Copy to Clipboard
        </Button>
      </Box>
      <ConfirmationModal
        isOpen={clearConfirmOpen}
        message="Are you sure you want to clear all selections?"
        onConfirm={() => {
          handleClearAll();
          setClearConfirmOpen(false);
        }}
        onCancel={() => setClearConfirmOpen(false)}
      />
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
