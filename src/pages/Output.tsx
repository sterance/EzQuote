import { Alert, Box, Button, Snackbar } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useTemplateStore } from "../hooks/useTemplateStore";
import OutputGroup from "../components/OutputGroup";
import OutputOptions from "../components/OutputOptions";
import Textbox from "../components/Textbox";
import { extractTags } from "../utils/templateUtils";
import { ConfirmationModal } from "../components/ConfirmationModal";
import AdjustIcon from "@mui/icons-material/Adjust";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";

const STORAGE_KEY = "output_data";

function fillTemplate(template: string, fills: Record<string, string>) {
  return template.replace(
    /\{(\w+)\}/g,
    (_, key: string) => fills[key] ?? `{${key}}`,
  );
}

export function Output({
  advancedMode,
  onToggleAdvancedMode,
}: {
  advancedMode: boolean;
  onToggleAdvancedMode: () => void;
}) {
  const { groups } = useTemplateStore();
  const [enabledGroups, setEnabledGroups] = useState<Record<string, boolean>>(
    () => {
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
    },
  );
  const [textFills, setTextFills] = useState<
    Record<string, Record<string, string>>
  >(() => {
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

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ enabledGroups, textFills }),
    );
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
        const fills: Record<string, string> = {};
        const groupFills = textFills[group.id] ?? {};
        for (const tag of tags) {
          fills[tag] = groupFills[tag] ?? "";
        }
        return fillTemplate(group.template, fills);
      })
      .filter((line): line is string => Boolean(line))
      .join("\n\n");
  }, [enabledGroups, groups, textFills]);

  const hasDataToClear = useMemo(() => {
    return (
      Object.values(enabledGroups).some(Boolean) ||
      Object.keys(textFills).length > 0
    );
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
      <Box className="button-sections" sx={{ position: "relative" }}>
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={onToggleAdvancedMode}
          className="advanced-btn"
          startIcon={advancedMode ? <RocketLaunchIcon /> : <AdjustIcon />}
          sx={{ position: "absolute", top: 8, left: 8, zIndex: 1 }}
        >
          {advancedMode ? "Advanced Mode" : "Simple Mode"}
        </Button>
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={() => setClearConfirmOpen(true)}
          disabled={!hasDataToClear}
          className="clear-all-btn"
          sx={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}
        >
          Clear All
        </Button>
        {groups.map((group) => {
        const tags = extractTags(group.template);
        const hasTags = tags.length > 0;

        if (!hasTags) {
          // State 1: No tags → checkbox only, no child components
          return (
            <OutputGroup
              key={group.id}
              label={group.label}
              enabled={Boolean(enabledGroups[group.id])}
              onToggleEnabled={(enabled) =>
                handleToggleGroup(group.id, enabled)
              }
            />
          );
        }

        // States 2-4: Has tags → checkbox + Options (handles dropdowns + text fields)
        return (
          <OutputGroup
            key={group.id}
            label={group.label}
            enabled={Boolean(enabledGroups[group.id])}
            onToggleEnabled={(enabled) =>
              handleToggleGroup(group.id, enabled)
            }
          >
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

      <Textbox label="Output" placeholder="" value={output} />
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          className="copy-clipboard-btn"
          variant="contained"
          color="primary"
          onClick={handleCopy}
          disabled={!output}
        >
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
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
