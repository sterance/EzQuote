import React from "react";
import { Box, TextField, IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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

export const SortableFillRow: React.FC<SortableFillRowProps> = ({
  id,
  groupId,
  fillId,
  tag,
  index,
  value,
  onChange,
  onDelete,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
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
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <Typography
        variant="caption"
        {...attributes}
        {...listeners}
        sx={{
          minWidth: 24,
          color: "text.secondary",
          cursor: "grab",
          userSelect: "none",
          touchAction: "none",
        }}
        aria-label={`Reorder ${tag} value ${index + 1}`}
      >
        {index + 1}.
      </Typography>
      <TextField
        fullWidth
        size="small"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={`Value for ${tag}`}
      />
      <IconButton
        size="small"
        color="error"
        onClick={onDelete}
        aria-label={`Delete ${tag} value`}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};
