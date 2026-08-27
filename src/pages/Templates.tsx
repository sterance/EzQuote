import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stack,
  Chip,
  IconButton,
} from "@mui/material";
import { useTemplateStore } from "../hooks/useTemplateStore";
import { extractTags } from "../utils/templateUtils";
import { ConfirmationModal } from "../components/ConfirmationModal";
import type { ButtonGroup, ChildOption } from "../types";

export const Templates: React.FC = () => {
  const {
    groups,
    updateGroup,
    deleteGroup,
    addGroup,
    updateChild,
    deleteChild,
    addChild,
    importData,
  } = useTemplateStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const confirmAction = (message: string, action: () => void) => {
    setModalConfig({
      isOpen: true,
      message,
      onConfirm: () => {
        action();
        setModalConfig(null);
      },
    });
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(groups, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "templates_export.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importData(content);
      if (!success) alert("Invalid JSON schema provided.");
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <Box sx={{ maxWidth: "1200px", mx: "auto", p: 3 }}>
      <Stack spacing={2}>
        {groups.map((group) => (
          <GroupEditor
            key={group.id}
            group={group}
            updateGroup={updateGroup}
            deleteGroup={() =>
              confirmAction(
                "Are you sure you want to delete this entire group?",
                () => deleteGroup(group.id),
              )
            }
            addChild={() => addChild(group.id)}
            updateChild={(childId, label, fills) =>
              updateChild(group.id, childId, label, fills)
            }
            deleteChild={(childId) =>
              confirmAction(
                "Are you sure you want to delete this option?",
                () => deleteChild(group.id, childId),
              )
            }
            confirmAction={confirmAction}
          />
        ))}
      </Stack>
      <Button
        fullWidth
        variant="outlined"
        sx={{
          borderStyle: "dashed",
          py: 1.5,
          mt: 2,
          color: "text.secondary",
          "&:hover": { bgcolor: "action.hover", color: "text.primary" },
        }}
        onClick={addGroup}
      >
        + Add Group
      </Button>
      <Stack
        direction="row"
        spacing={2}
        sx={{ mt: 3, mb: 3, alignItems: "center", justifyContent: "center" }}
      >
        <input
          type="file"
          accept=".json"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleImport}
        />
        <Button
          variant="outlined"
          onClick={() => fileInputRef.current?.click()}
        >
          Import Templates
        </Button>
        <Button variant="contained" color="primary" onClick={handleExport}>
          Export Templates
        </Button>
      </Stack>

      <ConfirmationModal
        isOpen={!!modalConfig?.isOpen}
        message={modalConfig?.message || ""}
        onConfirm={() => modalConfig?.onConfirm()}
        onCancel={() => setModalConfig(null)}
      />
    </Box>
  );
};

interface GroupEditorProps {
  group: ButtonGroup;
  updateGroup: (id: string, label: string, template: string) => void;
  deleteGroup: () => void;
  addChild: () => void;
  updateChild: (
    id: string,
    label: string,
    fills: Record<string, string>,
  ) => void;
  deleteChild: (id: string) => void;
  confirmAction: (msg: string, action: () => void) => void;
}

const GroupEditor: React.FC<GroupEditorProps> = ({
  group,
  updateGroup,
  deleteGroup,
  addChild,
  updateChild,
  deleteChild,
  confirmAction,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [editLabel, setEditLabel] = useState(group.label);
  const [editTemplate, setEditTemplate] = useState(group.template);

  const handleSave = () => {
    const oldTags = extractTags(group.template);
    const newTags = extractTags(editTemplate);
    const removedTags = oldTags.filter((t) => !newTags.includes(t));

    if (removedTags.length > 0 && group.buttons.length > 0) {
      confirmAction(
        `Saving will remove fields: ${removedTags.join(", ")}. This will delete existing child data. Continue?`,
        () => {
          updateGroup(group.id, editLabel, editTemplate);
          setIsEditing(false);
        },
      );
    } else {
      updateGroup(group.id, editLabel, editTemplate);
      setIsEditing(false);
    }
  };

  const groupTags = extractTags(group.template);

  return (
    <Paper sx={{ overflow: "hidden" }}>
      <Box
        sx={{
          bgcolor: "grey.100",
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        {isEditing ? (
          <Stack spacing={2} sx={{ flex: 1, mr: 2 }}>
            <TextField
              fullWidth
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              placeholder="Group Label"
              size="small"
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              value={editTemplate}
              onChange={(e) => setEditTemplate(e.target.value)}
              placeholder="Template string e.g. Hello {name}"
            />
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  setEditLabel(group.label);
                  setEditTemplate(group.template);
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        ) : (
          <Box
            sx={{ flex: 1, cursor: "pointer" }}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {group.label}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                display: "block",
                mt: 1,
                fontFamily: "monospace",
                bgcolor: "grey.200",
                p: 1,
                borderRadius: 1,
              }}
            >
              {group.template}
            </Typography>
          </Box>
        )}

        {!isEditing && (
          <Stack
            direction="row"
            spacing={1}
            sx={{ ml: 2, alignItems: "center" }}
          >
            <IconButton
              size="small"
              onClick={() => setIsExpanded(!isExpanded)}
              sx={{
                transform: isExpanded ? "rotate(90deg)" : "rotate(-90deg)",
                transition: "transform 0.3s",
              }}
            >
              <Typography sx={{ fontSize: "1.5rem", lineHeight: 1 }}>
                ‹
              </Typography>
            </IconButton>
            <Button
              variant="contained"
              color="warning"
              size="small"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={deleteGroup}
            >
              Delete
            </Button>
          </Stack>
        )}
      </Box>

      {isExpanded && !isEditing && (
        <Box
          sx={{
            p: 2,
            bgcolor: "grey.50",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {group.buttons.map((child) => (
            <ChildEditor
              key={child.id}
              child={child}
              tags={groupTags}
              onSave={(label, fills) => updateChild(child.id, label, fills)}
              onDelete={() => deleteChild(child.id)}
            />
          ))}
          <Button
            fullWidth
            variant="outlined"
            sx={{
              borderStyle: "dashed",
              py: 1.5,
              color: "text.secondary",
              "&:hover": { bgcolor: "action.hover", color: "text.primary" },
            }}
            onClick={addChild}
          >
            + Add Option
          </Button>
        </Box>
      )}
    </Paper>
  );
};

interface ChildEditorProps {
  child: ChildOption;
  tags: string[];
  onSave: (label: string, fills: Record<string, string>) => void;
  onDelete: () => void;
}

const ChildEditor: React.FC<ChildEditorProps> = ({
  child,
  tags,
  onSave,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(child.label);
  const [editFills, setEditFills] = useState<Record<string, string>>(
    child.fills || {},
  );

  const handleFillChange = (tag: string, value: string) => {
    setEditFills((prev) => ({ ...prev, [tag]: value }));
  };

  const handleSave = () => {
    onSave(editLabel, editFills);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <Paper
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          bgcolor: "background.paper",
        }}
      >
        <Box>
          <Typography sx={{ fontWeight: "600" }}>{child.label}</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mt: 1 }}>
            {tags.flatMap((tag) => [
              <Typography key={`${tag}-tag`} variant="caption" sx={{ fontWeight: "bold" }}>
                {tag}
              </Typography>,
              <Chip
                key={`${tag}-chip`}
                label={child.fills?.[tag] || "—"}
                size="small"
                variant="outlined"
              />
            ])}
          </Box>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            color="warning"
            size="small"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={onDelete}
          >
            Delete
          </Button>
        </Stack>
      </Paper>
    );
  }

  if (isEditing) {
    return (
      <Paper
        sx={{
          p: 2,
          bgcolor: "background.paper",
          border: 2,
          borderColor: "primary.light",
        }}
      >
        <Stack spacing={2}>
          <Box>
            <Typography
              variant="caption"
              sx={{ fontWeight: "bold", color: "text.secondary" }}
            >
              Label
            </Typography>
            <TextField
              fullWidth
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              size="small"
              sx={{ mt: 0.5 }}
            />
          </Box>

          {tags.map((tag) => (
            <Box key={tag}>
              <Typography
                variant="caption"
                sx={{ fontWeight: "bold", color: "text.secondary" }}
              >
                {tag}
              </Typography>
              <TextField
                fullWidth
                value={editFills[tag] ?? ""}
                onChange={(e) => handleFillChange(tag, e.target.value)}
                size="small"
                sx={{ mt: 0.5 }}
              />
            </Box>
          ))}

          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={handleSave}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                setEditLabel(child.label);
                setEditFills(child.fills);
                setIsEditing(false);
              }}
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Paper>
    );
  }
};
