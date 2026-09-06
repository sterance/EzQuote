import React, { useState, useRef, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Button, TextField, Typography, Paper, Stack, IconButton, Divider, Link } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { extractTags, generateId } from "../utils/templateUtils";
import type { ButtonGroup } from "../types";
import { InputModal } from "./InputModal";

interface GroupEditorProps {
  group: ButtonGroup;
  updateGroup: (id: string, label: string, template: string) => void;
  deleteGroup: () => void;
  updateGroupFills: (fills: Record<string, string[]>, fillIds?: Record<string, string[]>) => void;
  confirmAction: (msg: string, action: () => void) => void;
  editingGroupId: string | null;
  onExitEdit: () => void;
}

interface SortableFillRowProps {
  id: string;
  groupId: string;
  fillId: string;
  tag: string;
  index: number;
  value: string;
  onChange: (value: string) => void;
  onDelete: () => void;
}

const SortableFillRow: React.FC<SortableFillRowProps> = ({ id, groupId, fillId, tag, index, value, onChange, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    data: { type: "fill", groupId, tag, fillId },
  });

  return (
    <Box
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      sx={{ display: "flex", alignItems: "center", gap: 1, opacity: isDragging ? 0.5 : 1 }}
    >
      <Typography variant="caption" {...attributes} {...listeners} sx={{ minWidth: 24, color: "text.secondary", cursor: "grab", userSelect: "none", touchAction: "none" }} aria-label={`Reorder ${tag} value ${index + 1}`}>
        {index + 1}.
      </Typography>
      <TextField fullWidth size="small" value={value} onChange={(event) => onChange(event.target.value)} placeholder={`Value for ${tag}`} />
      <IconButton size="small" color="error" onClick={onDelete} aria-label={`Delete ${tag} value`}>
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export const GroupEditor: React.FC<GroupEditorProps> = ({ group, updateGroup, deleteGroup, updateGroupFills, confirmAction, editingGroupId, onExitEdit }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [labelError, setLabelError] = useState<string | null>(null);
  const [templateError, setTemplateError] = useState<string | null>(null);

  const [editLabel, setEditLabel] = useState(group.label);
  const [editTemplate, setEditTemplate] = useState(group.template);
  const templateRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const cursorPosRef = useRef<number | null>(null);
  const labelRef = useRef<HTMLInputElement | null>(null);
  const autoEnteredRef = useRef(false);
  const shouldFocusLabelRef = useRef(false);

  useEffect(() => {
    if (editingGroupId === group.id && !autoEnteredRef.current) {
      autoEnteredRef.current = true;
      setEditLabel(group.label);
      setEditTemplate(group.template);
      shouldFocusLabelRef.current = true;
      setIsEditing(true);
    }
  }, [editingGroupId, group.id, group.label, group.template]);

  useEffect(() => {
    if (isEditing && shouldFocusLabelRef.current) {
      shouldFocusLabelRef.current = false;
      const id = setTimeout(() => {
        const el = labelRef.current;
        if (el) {
          el.focus();
        }
      }, 0);
      return () => clearTimeout(id);
    }
  }, [isEditing]);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: group.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSave = () => {
    const trimmedLabel = editLabel.trim();
    const trimmedTemplate = editTemplate.trim();

    const newLabelError = trimmedLabel ? null : "Group name is required";
    const newTemplateError = trimmedTemplate ? null : "Template text is required";
    setLabelError(newLabelError);
    setTemplateError(newTemplateError);

    if (newLabelError || newTemplateError) {
      return;
    }

    const oldTags = extractTags(group.template);
    const newTags = extractTags(editTemplate);
    const removedTags = oldTags.filter((t) => !newTags.includes(t));

    const hasFills = Object.values(group.fills || {}).some((list) => list.length > 0);

    if (removedTags.length > 0 && hasFills) {
      confirmAction(`Saving will remove the following variable(s) and their fill values: "${removedTags.join(", ")}". Continue?`, () => {
        updateGroup(group.id, editLabel, editTemplate);
        setIsEditing(false);
        setLabelError(null);
        setTemplateError(null);
        onExitEdit();
      });
    } else {
      updateGroup(group.id, editLabel, editTemplate);
      setIsEditing(false);
      setLabelError(null);
      setTemplateError(null);
      onExitEdit();
    }
  };

  const groupTags = extractTags(group.template);

  const handleAddValue = (tag: string) => {
    const list = (group.fills || {})[tag] ?? [];
    const fillIds = group.fillIds || {};
    const nextFillId = generateId();
    const next: Record<string, string[]> = {
      ...(group.fills || {}),
      [tag]: [...list, ""],
    };
    updateGroupFills(next, {
      ...fillIds,
      [tag]: [...(fillIds[tag] ?? []), nextFillId],
    });
  };

  const handleUpdateValue = (tag: string, index: number, value: string) => {
    const list = (group.fills || {})[tag] ?? [];
    const next: Record<string, string[]> = {
      ...(group.fills || {}),
      [tag]: list.map((v, i) => (i === index ? value : v)),
    };
    updateGroupFills(next);
  };

  const handleDeleteValue = (tag: string, index: number) => {
    const list = (group.fills || {})[tag] ?? [];
    if (list[index]) {
      confirmAction(`Are you sure you want to delete this "${tag}" fill value?`, () => commitDeleteValue(tag, index));
      return;
    }
    commitDeleteValue(tag, index);
  };

  const commitDeleteValue = (tag: string, index: number) => {
    const list = (group.fills || {})[tag] ?? [];
    const fillIds = group.fillIds || {};
    const next: Record<string, string[]> = {
      ...(group.fills || {}),
      [tag]: list.filter((_, i) => i !== index),
    };
    updateGroupFills(next, {
      ...fillIds,
      [tag]: (fillIds[tag] ?? []).filter((_, i) => i !== index),
    });
  };

  return (
    <>
      <Paper ref={setNodeRef} className="tmpl-card" style={style} sx={{ overflow: "hidden" }}>
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
                onChange={(e) => {
                  setEditLabel(e.target.value);
                  if (labelError) setLabelError(null);
                }}
                placeholder="Group Label"
                size="small"
                inputRef={labelRef}
                error={!!labelError}
                helperText={labelError || ""}
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
                <Button onClick={() => setIsInputOpen(true)}>Insert Variable</Button>
              </Box>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={editTemplate}
                onChange={(e) => {
                  setEditTemplate(e.target.value);
                  if (templateError) setTemplateError(null);
                  cursorPosRef.current = e.target.selectionStart;
                }}
                onClick={(e) => {
                  cursorPosRef.current = (e.target as HTMLInputElement | HTMLTextAreaElement).selectionStart;
                }}
                onKeyUp={(e) => {
                  cursorPosRef.current = (e.target as HTMLInputElement | HTMLTextAreaElement).selectionStart;
                }}
                inputRef={(el: HTMLInputElement | HTMLTextAreaElement | null) => {
                  templateRef.current = el;
                }}
                placeholder="Template text e.g. Hello {name}"
                error={!!templateError}
                helperText={templateError || ""}
              />
              <Stack direction="row" spacing={1}>
                <Button variant="contained" color="primary" size="small" onClick={handleSave}>
                  Save
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    setEditLabel(group.label);
                    setEditTemplate(group.template);
                    setIsEditing(false);
                    setLabelError(null);
                    setTemplateError(null);
                    onExitEdit();
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
              <Typography variant="h6" sx={{ fontWeight: "bold", cursor: "pointer" }} onClick={() => setIsExpanded(!isExpanded)}>
                {group.label}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", justifyContent: "flex-end" }}>
                <IconButton
                  size="small"
                  onClick={() => setIsExpanded(!isExpanded)}
                  sx={{
                    transform: isExpanded ? "rotate(90deg)" : "rotate(-90deg)",
                    transition: "transform 0.3s",
                  }}
                >
                  <Typography sx={{ fontSize: "1.5rem", lineHeight: 1 }}>‹</Typography>
                </IconButton>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    setIsEditing(true);
                    setLabelError(null);
                    setTemplateError(null);
                    onExitEdit();
                  }}
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
              <IconButton size="small" {...attributes} {...listeners} sx={{ cursor: "grab", color: "text.secondary" }}>
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
                No variables in this template yet. Add {"{tag}"} placeholders using "Insert Variable" in Edit mode.
              </Typography>
            ) : (
              groupTags.map((tag) => {
                const list = (group.fills || {})[tag] ?? [];
                const fillIds = (group.fillIds || {})[tag] ?? [];
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
                    <Typography variant="subtitle2" sx={{ fontWeight: "bold", textTransform: "capitalize" }}>
                      {tag}
                    </Typography>
                    <Divider />
                    {list.length === 0 ? (
                      <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center" }}>
                        No fill values yet. Will appear as a custom text input field in the{" "}
                        <Link component={RouterLink} to="/output">
                          Output page
                        </Link>
                        .
                      </Typography>
                    ) : (
                      <SortableContext items={list.map((_, i) => `fill:${group.id}:${fillIds[i]}`)}>
                        {list.map((value, idx) => (
                          <SortableFillRow key={fillIds[idx]} id={`fill:${group.id}:${fillIds[idx]}`} groupId={group.id} fillId={fillIds[idx]} tag={tag} index={idx} value={value} onChange={(v) => handleUpdateValue(tag, idx, v)} onDelete={() => handleDeleteValue(tag, idx)} />
                        ))}
                      </SortableContext>
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
          const next = editTemplate.slice(0, pos) + insert + editTemplate.slice(pos);
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
