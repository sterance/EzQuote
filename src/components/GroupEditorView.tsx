import React from "react";
import { Box, Button, Typography, Stack, IconButton } from "@mui/material";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import type { ButtonGroup } from "../types";

interface GroupEditorViewProps {
  group: ButtonGroup;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
  onDelete: () => void;
  dragHandleAttributes: React.HTMLAttributes<HTMLSpanElement>;
  dragHandleListeners?: React.HTMLAttributes<HTMLSpanElement>;
}

export const GroupEditorView: React.FC<GroupEditorViewProps> = ({ group, isExpanded, onToggleExpand, onEdit, onDelete, dragHandleAttributes, dragHandleListeners }) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gridTemplateRows: "auto auto",
        columnGap: 1,
        rowGap: 1,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: "bold", cursor: "pointer" }} onClick={onToggleExpand}>
        {group.label}
      </Typography>
      <Stack direction="row" spacing={1} sx={{ alignItems: "center", justifyContent: "flex-end" }}>
        <IconButton
          size="small"
          onClick={onToggleExpand}
          sx={{
            transform: isExpanded ? "rotate(90deg)" : "rotate(-90deg)",
            transition: "transform 0.3s",
          }}
        >
          <Typography sx={{ fontSize: "1.5rem", lineHeight: 1 }}>‹</Typography>
        </IconButton>
        <Stack direction="row" spacing={1} className="tmpl-card-actions">
          <Button variant="outlined" size="small" onClick={onEdit}>
            Edit
          </Button>
          <Button variant="outlined" size="small" onClick={onDelete}>
            Delete
          </Button>
        </Stack>
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
        onClick={onToggleExpand}
      >
        {group.template}
      </Typography>
      <Box component="span" className="tmpl-drag-handle" {...dragHandleAttributes} {...dragHandleListeners} sx={{ display: "flex", alignItems: "center", justifyContent: "center", cursor: "grab", color: "var(--text)" }}>
        <DragHandleIcon fontSize="small" />
      </Box>
    </Box>
  );
};
