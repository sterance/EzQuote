import Box from "@mui/material/Box";
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

export default function OutputGroup({ label, enabled, onToggleEnabled, children, sx }: OutputGroupProps) {
  return (
    <Paper
      className="output-card"
      data-checked={enabled}
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
          py: 1,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          alignItems: "center",
        }}
      >
        <button
          type="button"
          role="checkbox"
          aria-checked={enabled}
          data-checked={enabled}
          className="output-group-toggle"
          onClick={() => onToggleEnabled(!enabled)}
        >
          {label}
        </button>
      </Box>
      {children && (
        <Box
          sx={{
            pb: 2,
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
