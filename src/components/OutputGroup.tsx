import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import { useId } from "react";
import OutputDropdowns from "./OutputDropdowns";

interface Option {
  id: string;
  label: string;
  fills: Record<string, string>;
}

interface OutputGroupProps {
  label: string;
  options: Option[];
  template: string;
  enabled: boolean;
  onToggleEnabled: (enabled: boolean) => void;
  onChange: (fills: Record<string, string>) => void;
}

export default function OutputGroup({
  label,
  options,
  template,
  enabled,
  onToggleEnabled,
  onChange,
}: OutputGroupProps) {
  const groupId = useId();
  const labelId = `${groupId}-label`;
  const toggleId = `${groupId}-toggle`;

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
      <OutputDropdowns
        options={options}
        template={template}
        enabled={enabled}
        onChange={onChange}
      />
    </Box>
  );
}
