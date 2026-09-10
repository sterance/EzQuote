import React, { useState, useRef, useEffect } from "react";
import { Box, Paper } from "@mui/material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { extractTags, generateId } from "../utils/templateUtils";
import type { ButtonGroup } from "../types";
import { InputModal } from "./InputModal";
import { FillValuePanel } from "./FillValuePanel";
import { GroupEditorView } from "./GroupEditorView";
import { GroupEditorEdit } from "./GroupEditorEdit";

interface GroupEditorProps {
  group: ButtonGroup;
  updateGroup: (id: string, label: string, template: string) => void;
  deleteGroup: () => void;
  updateGroupFills: (fills: ButtonGroup["fills"]) => void;
  onToggleStar: (tag: string, fillId: string) => void;
  confirmAction: (msg: string, action: () => void) => void;
  editingGroupId: string | null;
  onExitEdit: () => void;
  confirmNewGroup: () => void;
  cancelNewGroup: () => void;
  isNewGroup: boolean;
}

export const GroupEditor: React.FC<GroupEditorProps> = ({
  group,
  updateGroup,
  deleteGroup,
  updateGroupFills,
  onToggleStar,
  confirmAction,
  editingGroupId,
  onExitEdit,
  confirmNewGroup,
  cancelNewGroup,
  isNewGroup,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const [editLabel, setEditLabel] = useState(group.label);
  const [editTemplate, setEditTemplate] = useState(group.template);
  const [labelError, setLabelError] = useState<string | null>(null);
  const [templateError, setTemplateError] = useState<string | null>(null);

  const templateRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const labelRef = useRef<HTMLInputElement | null>(null);
  const cursorPosRef = useRef<number | null>(null);
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
      requestAnimationFrame(() => {
        labelRef.current?.focus();
      });
    }
  }, [isEditing]);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: group.id,
  });

  useEffect(() => {
    if (isDragging && isExpanded) {
      setTimeout(() => setIsExpanded(false), 0);
    }
  }, [isDragging, isExpanded]);

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
      confirmAction(
        `Saving will remove the following variable(s) and their fill values: "${removedTags.join(", ")}". Continue?`,
        () => {
          updateGroup(group.id, editLabel, editTemplate);
          exitEdit();
        }
      );
    } else {
      updateGroup(group.id, editLabel, editTemplate);
      confirmNewGroup();
      exitEdit();
    }
  };

  const exitEdit = () => {
    setIsEditing(false);
    setLabelError(null);
    setTemplateError(null);
    autoEnteredRef.current = false;
    onExitEdit();
  };

  const handleCancel = () => {
    setEditLabel(group.label);
    setEditTemplate(group.template);
    if (isNewGroup) {
      cancelNewGroup();
    }
    exitEdit();
  };

  const handleLabelChange = (value: string) => {
    setEditLabel(value);
    if (labelError) setLabelError(null);
  };

  const handleTemplateChange = (value: string, cursorPos: number) => {
    setEditTemplate(value);
    cursorPosRef.current = cursorPos;
    if (templateError) setTemplateError(null);
  };

  const handleTemplateClick = (cursorPos: number) => {
    cursorPosRef.current = cursorPos;
  };

  const handleTemplateKeyUp = (cursorPos: number) => {
    cursorPosRef.current = cursorPos;
  };

  const handleInsertVariable = () => {
    setIsInputOpen(true);
  };

  const handleInsertVariableConfirm = () => {
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
  };

  const groupTags = extractTags(group.template);

  const handleAddValue = (tag: string) => {
    const list = (group.fills || {})[tag] ?? [];
    const nextFillId = generateId();
    const next: ButtonGroup["fills"] = {
      ...(group.fills || {}),
      [tag]: [...list, { id: nextFillId, text: "", starred: false }],
    };
    updateGroupFills(next);
  };

  const handleUpdateValue = (tag: string, index: number, value: string) => {
    const list = (group.fills || {})[tag] ?? [];
    const next: ButtonGroup["fills"] = {
      ...(group.fills || {}),
      [tag]: list.map((f, i) => (i === index ? { ...f, text: value } : f)),
    };
    updateGroupFills(next);
  };

  const handleDeleteValue = (tag: string, index: number) => {
    const list = (group.fills || {})[tag] ?? [];
    if (list[index]) {
      confirmAction(
        `Are you sure you want to delete this "${tag}" fill value?`,
        () => commitDeleteValue(tag, index)
      );
      return;
    }
    commitDeleteValue(tag, index);
  };

  const commitDeleteValue = (tag: string, index: number) => {
    const list = (group.fills || {})[tag] ?? [];
    const next: ButtonGroup["fills"] = {
      ...(group.fills || {}),
      [tag]: list.filter((_, i) => i !== index),
    };
    updateGroupFills(next);
  };

  const handleTemplateRef = (el: HTMLInputElement | HTMLTextAreaElement | null) => {
    templateRef.current = el;
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
            <GroupEditorEdit
              editLabel={editLabel}
              editTemplate={editTemplate}
              labelError={labelError}
              templateError={templateError}
              onLabelChange={handleLabelChange}
              onTemplateChange={handleTemplateChange}
              onTemplateClick={handleTemplateClick}
              onTemplateKeyUp={handleTemplateKeyUp}
              onSave={handleSave}
              onCancel={handleCancel}
              onInsertVariable={handleInsertVariable}
              onTemplateRef={handleTemplateRef}
              onLabelRef={(el) => { labelRef.current = el; }}
            />
          ) : (
            <GroupEditorView
              group={group}
              isExpanded={isExpanded}
              onToggleExpand={() => setIsExpanded(!isExpanded)}
              onEdit={() => {
                setIsEditing(true);
                setLabelError(null);
                setTemplateError(null);
                shouldFocusLabelRef.current = true;
                onExitEdit();
              }}
              onDelete={deleteGroup}
              dragHandleAttributes={attributes}
              dragHandleListeners={listeners}
            />
          )}
        </Box>

        {isExpanded && !isEditing && (
          <FillValuePanel
            group={group}
            groupTags={groupTags}
            onAddValue={handleAddValue}
            onUpdateValue={handleUpdateValue}
            onDeleteValue={handleDeleteValue}
            onToggleStar={onToggleStar}
          />
        )}
      </Paper>
      <InputModal
        isOpen={isInputOpen}
        value={inputValue}
        onChange={setInputValue}
        onConfirm={handleInsertVariableConfirm}
        onCancel={() => {
          setIsInputOpen(false);
          setInputValue("");
        }}
      />
    </>
  );
};
