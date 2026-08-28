import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useId } from "react";
import { extractTags } from "../utils/templateUtils";

interface FillableGroupProps {
  label: string;
  template: string;
  value: string;
  enabled: boolean;
  onChange: (value: string) => void;
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
          sx={{ m: 0 }}
        >
          {label}
        </Box>
      </Box>
      {tags.length === 0 ? (
        enabled ? (
          <Typography
            component="p"
            sx={{ opacity: 1, transition: "opacity 150ms ease" }}
          >
            {template}
          </Typography>
        ) : null
      ) : (
        <Box sx={{ width: "100%", maxWidth: 480, opacity: enabled ? 1 : 0.55, transition: "opacity 150ms ease" }}>
          <TextField
            label={tags.join(", ")}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            fullWidth
            size="small"
          />
        </Box>
      )}
    </Box>
  );
}
