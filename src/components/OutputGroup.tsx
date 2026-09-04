import { useId } from "react";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import type { SxProps } from "@mui/material";
import type { Theme } from "@mui/material";

interface OutputGroupProps {
  label: string;
  enabled: boolean;
  onToggleEnabled: (enabled: boolean) => void;
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
}

export default function OutputGroup({
  label,
  enabled,
  onToggleEnabled,
  children,
  sx,
}: OutputGroupProps) {
  const groupId = useId();

  return (
    <Paper
      className="output-card"
      sx={{
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        ...sx,
      }}
    >
      <Box
        sx={{
          bgcolor: "var(--surface-muted)",
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          alignItems: "center",
        }}
      >
        <Box
          component="label"
          htmlFor={`checkbox-${groupId}`}
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            opacity: enabled ? 1 : 0.55,
          }}
        >
          <Checkbox
            id={`checkbox-${groupId}`}
            size="small"
            checked={enabled}
            onChange={(event) => onToggleEnabled(event.target.checked)}
            sx={{ p: 0.5 }}
          />
          <Box
            component="span"
            id={`label-${groupId}`}
            className="button-group-label"
            sx={{ m: 0, alignSelf: "center" }}
          >
            {label}
          </Box>
        </Box>
      </Box>
      {children && (
        <Box
          sx={{
            p: 2,
            bgcolor: "var(--surface-muted)",
            display: "flex",
            flexDirection: "row",
            width: "100%",
            boxSizing: "border-box",
            justifyContent: "center",
            gap: 2,
          }}
        >
          {children}
        </Box>
      )}
    </Paper>
  );
}
