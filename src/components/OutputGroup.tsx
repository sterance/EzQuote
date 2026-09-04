import { useId } from "react";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";

interface OutputGroupProps {
  label: string;
  enabled: boolean;
  onToggleEnabled: (enabled: boolean) => void;
  children?: React.ReactNode;
}

export default function OutputGroup({
  label,
  enabled,
  onToggleEnabled,
  children,
}: OutputGroupProps) {
  const groupId = useId();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        "& > *": {
          m: 1,
        },
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
      {children}
    </Box>
  );
}
