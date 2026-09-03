import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import { useId } from "react";
import OutputButtons from "./OutputButtons";

interface OutputGroupProps {
  label: string;
  options: { id: string; label: string }[];
  selectedId?: string;
  onSelect: (id: string) => void;
  enabled: boolean;
  onToggleEnabled: (enabled: boolean) => void;
}

export default function OutputGroup({
  label,
  options,
  selectedId,
  onSelect,
  enabled,
  onToggleEnabled,
}: OutputGroupProps) {
  const buttonsId = useId();
  const labelId = `${buttonsId}-label`;
  const toggleId = `${buttonsId}-toggle`;

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
        htmlFor={toggleId}
        sx={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          opacity: enabled ? 1 : 0.55,
        }}
      >
        <Checkbox
          id={toggleId}
          size="small"
          checked={enabled}
          onChange={(event) => onToggleEnabled(event.target.checked)}
          sx={{ p: 0.5 }}
        />
        <Box
          component="span"
          id={labelId}
          className="button-group-label"
          sx={{ m: 0, alignSelf: "center" }}
        >
          {label}
        </Box>
      </Box>
      <OutputButtons
        options={options}
        selectedId={selectedId}
        onSelect={onSelect}
        enabled={enabled}
        labelId={labelId}
        buttonsId={buttonsId}
      />
    </Box>
  );
}
