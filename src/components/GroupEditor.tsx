import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stack,
  IconButton,
} from "@mui/material";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { extractTags } from "../utils/templateUtils";
import type { ButtonGroup } from "../types";
import { ChildEditor } from "./ChildEditor";

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

export const GroupEditor: React.FC<GroupEditorProps> = ({
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

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: group.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSave = () => {
    const oldTags = extractTags(group.template);
    const newTags = extractTags(editTemplate);
    const removedTags = oldTags.filter((t) => !newTags.includes(t));

    if (removedTags.length > 0 && group.buttons.length > 0) {
      confirmAction(
        `Saving will remove the following option(s): "${removedTags.join(", ")}", and their data. Continue?`,
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
    <Paper ref={setNodeRef} style={style} sx={{ overflow: "hidden" }}>
      <Box
        sx={{
          bgcolor: "grey.100",
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        {isEditing ? (
          <Stack spacing={2} sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Label
            </Typography>
            <TextField
              fullWidth
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              placeholder="Group Label"
              size="small"
            />
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Template
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={editTemplate}
              onChange={(e) => setEditTemplate(e.target.value)}
              placeholder="Template text e.g. Hello {name}"
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
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gridTemplateRows: "auto auto",
              columnGap: 1,
              rowGap: 1,
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", cursor: "pointer" }}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {group.label}
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              sx={{ alignItems: "center", justifyContent: "flex-end" }}
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
                variant="outlined"
                size="small"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
              <Button variant="outlined" size="small" onClick={deleteGroup}>
                Delete
              </Button>
            </Stack>
            <Typography
              variant="caption"
              sx={{
                fontFamily: "monospace",
                bgcolor: "grey.200",
                p: 1,
                borderRadius: 1,
                cursor: "pointer",
              }}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {group.template}
            </Typography>
            <IconButton
              size="small"
              {...attributes}
              {...listeners}
              sx={{ cursor: "grab", color: "text.secondary" }}
            >
              <DragHandleIcon />
            </IconButton>
          </Box>
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
              confirmAction={confirmAction}
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
