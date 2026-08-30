import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import { useId } from "react";

export interface ButtonOption {
  id: string;
  label: string;
}

interface ButtonsProps {
  label: string;
  options: ButtonOption[];
  selectedId?: string;
  onSelect: (id: string) => void;
  enabled: boolean;
  onToggleEnabled: (enabled: boolean) => void;
}

export default function Buttons({
  label,
  options,
  selectedId,
  onSelect,
  enabled,
  onToggleEnabled,
}: ButtonsProps) {
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
      <ButtonGroup
        id={buttonsId}
        variant="outlined"
        aria-labelledby={labelId}
        sx={{
          opacity: enabled ? 1 : 0.55,
          transition: "opacity 150ms ease",
          gap: "1px",
        }}
      >
        {options.map((option) => {
          const buttonId = `${buttonsId}-button-${option.id}`;
          const isSelected = option.id === selectedId;

          return (
            <Button
              id={buttonId}
              key={buttonId}
              variant={isSelected ? "contained" : "outlined"}
              aria-pressed={isSelected}
              onClick={() => onSelect(option.id)}
            >
              {option.label}
            </Button>
          );
        })}
      </ButtonGroup>
    </Box>
  );
}
