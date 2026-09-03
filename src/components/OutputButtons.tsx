import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";

interface OutputButtonsProps {
  options: { id: string; label: string }[];
  selectedId?: string;
  onSelect: (id: string) => void;
  enabled: boolean;
  labelId: string;
  buttonsId: string;
}

export default function OutputButtons({
  options,
  selectedId,
  onSelect,
  enabled,
  labelId,
  buttonsId,
}: OutputButtonsProps) {
  return (
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
  );
}