import { Alert, Box, Button, Snackbar } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useTemplateStore } from "../hooks/useTemplateStore";
import Buttons from "../components/Buttons";
import FillableGroup from "../components/FillableGroup";
import Textbox from "../components/Textbox";
import { extractTags } from "../utils/templateUtils";
import { ConfirmationModal } from "../components/ConfirmationModal";

const STORAGE_KEY = "output_data";

function fillTemplate(template: string, fills: Record<string, string>) {
  return template.replace(
    /\{(\w+)\}/g,
    (_, key: string) => fills[key] ?? `{${key}}`,
  );
}

export function Output() {
  const { groups } = useTemplateStore();
  const [selections, setSelections] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.selections ?? {};
      } catch {
        console.error("Failed to parse local storage data.");
      }
    }
    return {};
  });
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
      JSON.stringify({ selections, enabledGroups, textFills }),
    );
  }, [selections, enabledGroups, textFills]);

  const handleSelect = (groupId: string, optionId: string) => {
    setSelections((current) => ({ ...current, [groupId]: optionId }));
  };

  const handleToggleGroup = (groupId: string, enabled: boolean) => {
    setEnabledGroups((current) => ({ ...current, [groupId]: enabled }));
  };

  const handleTextChange = (groupId: string, tag: string, value: string) => {
    setTextFills((current) => ({
      ...current,
      [groupId]: { ...(current[groupId] ?? {}), [tag]: value },
    }));
  };

  const output = useMemo(() => {
    return groups
      .map((group) => {
        if (!enabledGroups[group.id]) return null;

        if (group.options.length === 0) {
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
        }

        const selectedOptionId = selections[group.id];
        const option = group.options.find((o) => o.id === selectedOptionId);
        return option ? fillTemplate(group.template, option.fills) : null;
      })
      .filter((line): line is string => Boolean(line))
      .join("\n\n");
  }, [selections, enabledGroups, groups, textFills]);

  const hasDataToClear = useMemo(() => {
    return (
      Object.values(enabledGroups).some(Boolean) ||
      Object.keys(selections).length > 0 ||
      Object.keys(textFills).length > 0
    );
  }, [selections, enabledGroups, textFills]);

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
    setSelections({});
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
          onClick={() => setClearConfirmOpen(true)}
          disabled={!hasDataToClear}
          className="clear-all-btn"
          sx={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}
        >
          Clear All
        </Button>
        {groups.map((group) =>
          group.options.length === 0 ? (
            <FillableGroup
              key={group.id}
              label={group.label}
              template={group.template}
              value={textFills[group.id] ?? {}}
              enabled={Boolean(enabledGroups[group.id])}
              onChange={(tag, value) => handleTextChange(group.id, tag, value)}
              onToggleEnabled={(enabled) =>
                handleToggleGroup(group.id, enabled)
              }
            />
          ) : (
            <Buttons
              key={group.id}
              label={group.label}
              options={group.options.map(({ id, label }) => ({ id, label }))}
              selectedId={selections[group.id]}
              onSelect={(optionId) => handleSelect(group.id, optionId)}
              enabled={Boolean(enabledGroups[group.id])}
              onToggleEnabled={(enabled) =>
                handleToggleGroup(group.id, enabled)
              }
            />
          ),
        )}
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
