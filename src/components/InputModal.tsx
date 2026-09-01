import React, { useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

interface Props {
  isOpen: boolean;
  value: string;
  onChange: (val: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export const InputModal: React.FC<Props> = ({
  isOpen,
  value,
  onChange,
  onConfirm,
  onCancel,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      const id = requestAnimationFrame(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      });
      return () => cancelAnimationFrame(id);
    }
  }, [isOpen]);

  return (
    <Dialog
      open={isOpen}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
      className="confirmation-modal"
      aria-labelledby="confirmation-modal-title"
      aria-describedby="confirmation-modal-description"
    >
      <DialogTitle id="confirmation-modal-title" color="primary">
        Add Variable
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          value={value}
          onChange={(e) => onChange(e.target.value)}
          inputRef={inputRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onConfirm();
            } else if (e.key === "Escape") {
              e.preventDefault();
              onCancel();
            }
          }}
          sx={{
            "& .MuiInputBase-input": { textAlign: "center" },
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} variant="outlined">
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="contained" color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};
