import React from "react";
import { Box, Button, TextField, Typography, Stack } from "@mui/material";

interface GroupEditorEditProps {
  editLabel: string;
  editTemplate: string;
  labelError: string | null;
  templateError: string | null;
  onLabelChange: (value: string) => void;
  onTemplateChange: (value: string, cursorPos: number) => void;
  onTemplateClick: (cursorPos: number) => void;
  onTemplateKeyUp: (cursorPos: number) => void;
  onSave: () => void;
  onCancel: () => void;
  onInsertVariable: () => void;
  onTemplateRef: (el: HTMLInputElement | HTMLTextAreaElement | null) => void;
  onLabelRef: (el: HTMLInputElement | null) => void;
}

export const GroupEditorEdit: React.FC<GroupEditorEditProps> = ({ editLabel, editTemplate, labelError, templateError, onLabelChange, onTemplateChange, onTemplateClick, onTemplateKeyUp, onSave, onCancel, onInsertVariable, onTemplateRef, onLabelRef }) => {
  const handleTemplateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onTemplateChange(e.target.value, e.target.selectionStart ?? e.target.value.length);
  };

  return (
    <Stack spacing={2} sx={{ flex: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
        Label
      </Typography>
      <TextField fullWidth value={editLabel} onChange={(e) => onLabelChange(e.target.value)} placeholder="Group Label" size="small" inputRef={onLabelRef} error={!!labelError} helperText={labelError} />
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
        <Button onClick={onInsertVariable}>Insert Variable</Button>
      </Box>
      <TextField fullWidth multiline rows={4} value={editTemplate} onChange={handleTemplateChange} onClick={(e) => onTemplateClick((e.target as HTMLInputElement | HTMLTextAreaElement).selectionStart ?? 0)} onKeyUp={(e) => onTemplateKeyUp((e.target as HTMLInputElement | HTMLTextAreaElement).selectionStart ?? 0)} inputRef={onTemplateRef} placeholder="Template text e.g. Hello {name}" error={!!templateError} helperText={templateError} />
      <Stack direction="row" spacing={1}>
        <Button variant="contained" color="primary" size="small" onClick={onSave}>
          Save
        </Button>
        <Button variant="outlined" size="small" onClick={onCancel}>
          Cancel
        </Button>
      </Stack>
    </Stack>
  );
};
