import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import { useId } from "react";
import { extractTags } from "../utils/templateUtils";

interface FillableGroupProps {
  label: string;
  template: string;
  value: Record<string, string>;
  enabled: boolean;
  onChange: (tag: string, value: string) => void;
  onToggleEnabled: (enabled: boolean) => void;
}

export default function FillableGroup({
  label,
  template,
  value,
  enabled,
  onChange,
  onToggleEnabled,
}: FillableGroupProps) {
  const groupId = useId();
  const toggleId = `${groupId}-toggle`;
  const labelId = `${groupId}-label`;
  const tags = extractTags(template);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
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
          lineHeight: 1,
          "& .button-group-label": {
            lineHeight: 1,
          },
        }}
      >
        <Checkbox
          id={toggleId}
          size="small"
          checked={enabled}
          onChange={(event) => onToggleEnabled(event.target.checked)}
          sx={{ p: 0.5, alignSelf: "center" }}
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
      {tags.length === 0 ? null : (
        <Box
          sx={{
            width: "100%",
            maxWidth: 480,
            opacity: enabled ? 1 : 0.55,
            transition: "opacity 150ms ease",
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          {tags.map((tag) => (
            <TextField
              key={tag}
              label={tag}
              value={value[tag] ?? ""}
              onChange={(event) => onChange(tag, event.target.value)}
              size="small"
              sx={{ flex: "1 1 200px" }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
