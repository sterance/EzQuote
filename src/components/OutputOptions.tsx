import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useMemo, useState, useEffect } from "react";
import { extractTags } from "../utils/templateUtils";

interface OutputOptionsProps {
  fills: Record<string, string[]>;
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
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.getAttribute("data-theme") === "dark";
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.getAttribute("data-theme") === "dark");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  const tags = useMemo(() => extractTags(template), [template]);

  const handleChange = (tag: string, value: string) => {
    const currentFills = textFills || {};
    const next = { ...currentFills, [tag]: value };
    onChange(next);
  };

  const labelColor = isDarkMode ? "white" : "inherit";

  return (
    <Box
      sx={{
        width: "90%",
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
          const list = fills[tag];
          const selectId = `dropdown-${tag}`;

          return (
            <FormControl key={tag} size="small" sx={{ flex: "1 1 200px", minWidth: 120 }}>
              <Typography
                variant="h6"
                sx={{ textAlign: "center", textTransform: "capitalize", color: labelColor }}
              >
                {tag}
              </Typography>
              <Select
                id={selectId}
                value={textFills?.[tag] ?? ""}
                onChange={(e) => handleChange(tag, e.target.value)}
                displayEmpty
                disabled={!enabled}
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
          <FormControl key={tag} size="small" sx={{ flex: "1 1 200px", minWidth: 120 }}>
            <Typography
              variant="h6"
              sx={{ textAlign: "center", textTransform: "capitalize", color: labelColor }}
            >
              {tag}
            </Typography>
            <TextField
              value={textFills?.[tag] || ""}
              onChange={(event) => handleChange(tag, event.target.value)}
              size="small"
              disabled={!enabled}
            />
          </FormControl>
        );
      })}
    </Box>
  );
}