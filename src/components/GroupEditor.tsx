import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stack,
  IconButton,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { extractTags, generateId } from "../utils/templateUtils";
import type { ButtonGroup, TagFill } from "../types";
import { InputModal } from "./InputModal";

interface GroupEditorProps {
  group: ButtonGroup;
  updateGroup: (id: string, label: string, template: string) => void;
  deleteGroup: () => void;
  updateGroupFills: (fills: Record<string, TagFill[]>) => void;
  confirmAction: (msg: string, action: () => void) => void;
}

export const GroupEditor: React.FC<GroupEditorProps> = ({
  group,
  updateGroup,
  deleteGroup,
  updateGroupFills,
  confirmAction,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const [editLabel, setEditLabel] = useState(group.label);
  const [editTemplate, setEditTemplate] = useState(group.template);
  const templateRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(
    null,
  );
  const cursorPosRef = useRef<number | null>(null);

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

    const hasFills = Object.values(group.fills || {}).some(
      (list) => list.length > 0,
    );

    if (removedTags.length > 0 && hasFills) {
      confirmAction(
        `Saving will remove the following variable(s) and their fill values: "${removedTags.join(", ")}". Continue?`,
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

  const handleAddValue = (tag: string) => {
    const next: Record<string, TagFill[]> = {
      ...(group.fills || {}),
      [tag]: [
        ...((group.fills || {})[tag] ?? []),
        { id: generateId(`${tag}-fill`), value: "" },
      ],
    };
    updateGroupFills(next);
  };

  const handleUpdateValue = (tag: string, fillId: string, value: string) => {
    const list = (group.fills || {})[tag] ?? [];
    const next: Record<string, TagFill[]> = {
      ...(group.fills || {}),
      [tag]: list.map((f) => (f.id === fillId ? { ...f, value } : f)),
    };
    updateGroupFills(next);
  };

  const handleDeleteValue = (tag: string, fillId: string) => {
    const list = (group.fills || {})[tag] ?? [];
    const target = list.find((f) => f.id === fillId);
    if (!target) return;
    if (target.value) {
      confirmAction(
        `Are you sure you want to delete this "${tag}" fill value?`,
        () => commitDeleteValue(tag, fillId),
      );
      return;
    }
    commitDeleteValue(tag, fillId);
  };

  const commitDeleteValue = (tag: string, fillId: string) => {
    const list = (group.fills || {})[tag] ?? [];
    const next: Record<string, TagFill[]> = {
      ...(group.fills || {}),
      [tag]: list.filter((f) => f.id !== fillId),
    };
    updateGroupFills(next);
  };

  return (
    <>
      <Paper
        ref={setNodeRef}
        className="tmpl-card"
        style={style}
        sx={{ overflow: "hidden" }}
      >
        <Box
          sx={{
            bgcolor: "var(--surface)",
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1,
            borderBottom: 1,
            borderColor: "var(--border)",
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
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Template
                </Typography>
                <Typography>[text explaining how templates work]</Typography>
                <Button onClick={() => setIsInputOpen(true)}>
                  Insert Variable
                </Button>
              </Box>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={editTemplate}
                onChange={(e) => {
                  setEditTemplate(e.target.value);
                  cursorPosRef.current = e.target.selectionStart;
                }}
                onClick={(e) => {
                  cursorPosRef.current = (
                    e.target as HTMLInputElement | HTMLTextAreaElement
                  ).selectionStart;
                }}
                onKeyUp={(e) => {
                  cursorPosRef.current = (
                    e.target as HTMLInputElement | HTMLTextAreaElement
                  ).selectionStart;
                }}
                inputRef={(
                  el: HTMLInputElement | HTMLTextAreaElement | null,
                ) => {
                  templateRef.current = el;
                }}
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
                  bgcolor: "var(--surface-muted)",
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
              bgcolor: "var(--surface-muted)",
              display: "flex",
              flexDirection: "row",
              width: "100%",
              boxSizing: "border-box",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            {groupTags.length === 0 ? (
              <Typography variant="caption" color="text.secondary">
                No variables in this template yet. Add {"{tag}"} placeholders
                using "Insert Variable" in Edit mode.
              </Typography>
            ) : (
              groupTags.map((tag) => {
                const list = (group.fills || {})[tag] ?? [];
                return (
                  <Box
                    key={tag}
                    sx={{
                      flex: 1,
                      p: 1.5,
                      border: 1,
                      borderColor: "var(--border)",
                      borderRadius: 1,
                      bgcolor: "var(--surface)",
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: "bold", textTransform: "capitalize" }}
                    >
                      {tag}
                    </Typography>
                    <Divider />
                    {list.length === 0 ? (
                      <Typography variant="caption" color="text.secondary">
                        No fill values yet.
                      </Typography>
                    ) : (
                      list.map((fill, idx) => (
                        <Box
                          key={fill.id}
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Typography
                            variant="caption"
                            sx={{ minWidth: 24, color: "text.secondary" }}
                          >
                            {idx + 1}.
                          </Typography>
                          <TextField
                            fullWidth
                            size="small"
                            value={fill.value}
                            onChange={(e) =>
                              handleUpdateValue(tag, fill.id, e.target.value)
                            }
                            placeholder={`Value for ${tag}`}
                          />
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteValue(tag, fill.id)}
                            aria-label={`Delete ${tag} value`}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ))
                    )}
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{
                        alignSelf: "center",
                        borderStyle: "dashed",
                      }}
                      onClick={() => handleAddValue(tag)}
                    >
                      + Add Value
                    </Button>
                  </Box>
                );
              })
            )}
          </Box>
        )}
      </Paper>
      <InputModal
        isOpen={isInputOpen}
        value={inputValue}
        onChange={setInputValue}
        onConfirm={() => {
          if (!inputValue) return;
          const insert = `{${inputValue}}`;
          const pos = cursorPosRef.current ?? editTemplate.length;
          const next =
            editTemplate.slice(0, pos) + insert + editTemplate.slice(pos);
          setEditTemplate(next);
          setIsInputOpen(false);
          setInputValue("");
          requestAnimationFrame(() => {
            const el = templateRef.current;
            if (el) {
              el.focus();
              el.setSelectionRange(pos + insert.length, pos + insert.length);
            }
          });
        }}
        onCancel={() => {
          setIsInputOpen(false);
          setInputValue("");
        }}
      />
    </>
  );
};
