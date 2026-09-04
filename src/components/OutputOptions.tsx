import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { useMemo } from "react";
import { extractTags } from "../utils/templateUtils";
import { Typography } from "@mui/material";
import type { TagFill } from "../types";

interface OutputOptionsProps {
  fills: Record<string, TagFill[]>;
  template: string;
  textFills?: Record<string, string>;
  enabled: boolean;
  onChange: (fills: Record<string, string>) => void;
}

export default function OutputOptions({
  fills,
  template,
  textFills = {},
  enabled,
  onChange,
}: OutputOptionsProps) {
  const tags = useMemo(() => extractTags(template), [template]);

  const handleChange = (tag: string, value: string) => {
    const currentFills = textFills || {};
    const next = { ...currentFills, [tag]: value };
    onChange(next);
  };

  return (
    <Box
      sx={{
        width: "100%",
        opacity: enabled ? 1 : 0.55,
        transition: "opacity 150ms ease",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 1,
      }}
    >
      {tags.map((tag) => {
        const hasTemplateFills = (fills[tag]?.length || 0) > 0;

        if (hasTemplateFills) {
          const list = fills[tag].map((f) => f.value);
          const selectId = `dropdown-${tag}`;

          return (
            <FormControl key={tag} size="small" sx={{ flex: "1 1 200px", minWidth: 120 }}>
              <Typography
                variant="h6"
                sx={{ textAlign: "center", textTransform: "capitalize" }}
              >
                {tag}
              </Typography>
              <Select
                id={selectId}
                value={textFills?.[tag] || (list.length > 0 ? list[0] : "")}
                onChange={(e) => handleChange(tag, e.target.value)}
                displayEmpty
              >
                {list.map((val) => (
                  <MenuItem key={val} value={val}>
                    {val}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          );
        }

        return (
          <TextField
            key={tag}
            label={tag}
            value={textFills?.[tag] || ""}
            onChange={(event) => handleChange(tag, event.target.value)}
            size="small"
            sx={{ flex: "1 1 200px" }}
          />
        );
      })}
    </Box>
  );
}