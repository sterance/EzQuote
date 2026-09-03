import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import { useId } from "react";
import OutputDropdowns from "./OutputDropdowns";
import type { TagFill } from "../types";

interface OutputGroupProps {
  label: string;
  fills: Record<string, TagFill[]>;
  template: string;
  enabled: boolean;
  onToggleEnabled: (enabled: boolean) => void;
  onChange: (fills: Record<string, string>) => void;
}

export default function OutputGroup({
  label,
  fills,
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
        fills={fills}
        template={template}
        enabled={enabled}
        onChange={onChange}
      />
    </Box>
  );
}
