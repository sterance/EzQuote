import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stack,
  Chip,
} from "@mui/material";

interface ChildEditorProps {
  child: {
    id: string;
    label: string;
    fills?: Record<string, string>;
  };
  tags: string[];
  onSave: (label: string, fills: Record<string, string>) => void;
  onDelete: () => void;
  confirmAction: (msg: string, action: () => void) => void;
}

export const ChildEditor: React.FC<ChildEditorProps> = ({
  child,
  tags,
  onSave,
  onDelete,
  confirmAction,
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
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: 1,
              mt: 1,
            }}
          >
            {tags.flatMap((tag) => [
              <Typography
                key={`${tag}-tag`}
                variant="caption"
                sx={{ fontWeight: "bold" }}
              >
                {tag}
              </Typography>,
              <Chip
                key={`${tag}-chip`}
                label={child.fills?.[tag] || "—"}
                size="small"
                variant="outlined"
                sx={{ width: "fit-content" }}
              />,
            ])}
          </Box>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              confirmAction(
                `Are you sure you want to delete the "${child.label}" option?`,
                () => onDelete(),
              );
            }}
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
                setEditFills(child.fills || {});
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
