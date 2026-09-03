import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useMemo, useState } from "react";
import { extractTags } from "../utils/templateUtils";
import { Typography } from "@mui/material";

interface Option {
  id: string;
  label: string;
  fills: Record<string, string>;
}

interface OutputDropdownsProps {
  options: Option[];
  template: string;
  enabled: boolean;
  onChange: (fills: Record<string, string>) => void;
}

export default function OutputDropdowns({
  options,
  template,
  enabled,
  onChange,
}: OutputDropdownsProps) {
  const tags = useMemo(() => extractTags(template), [template]);

  const candidates = useMemo(() => {
    const result: Record<string, string[]> = {};
    for (const tag of tags) {
      const seen = new Set<string>();
      for (const opt of options) {
        const val = opt.fills[tag];
        if (val) seen.add(val);
      }
      result[tag] = [...seen];
    }
    return result;
  }, [options, tags]);

  const [selections, setSelections] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const tag of tags) {
      const list = candidates[tag];
      initial[tag] = list.length > 0 ? list[0] : "";
    }
    return initial;
  });

  const handleChange = (tag: string, value: string) => {
    const next = { ...selections, [tag]: value };
    setSelections(next);
    onChange(next);
  };

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        gap: "1px",
        opacity: enabled ? 1 : 0.55,
        transition: "opacity 150ms ease",
      }}
    >
      {tags.map((tag) => {
        const list = candidates[tag];
        const selectId = `dropdown-${tag}`;

        return (
          <FormControl key={tag} size="small" sx={{ flex: 1, minWidth: 120 }}>
            <Typography variant="h6" sx={{ textAlign: "center" }}>
              {tag}
            </Typography>
            <Select
              id={selectId}
              value={selections[tag] ?? ""}
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
      })}
    </Box>
  );
}
