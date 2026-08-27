import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Box from "@mui/material/Box";
import { useId } from "react";

export interface ButtonItem {
  text: string;
}

interface ButtonsProps {
  label: string;
  buttons: ButtonItem[];
}

export default function Buttons({ label, buttons }: ButtonsProps) {
  const buttonsId = useId();
  const labelId = `${buttonsId}-label`;

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
      <Box component="span" id={labelId} className="button-group-label">
        {label}
      </Box>
      <ButtonGroup id={buttonsId} variant="outlined" aria-labelledby={labelId}>
        {buttons.map((button, index) => {
          const buttonId = `${buttonsId}-button-${index}`;

          return (
            <Button id={buttonId} key={buttonId}>
              {button.text}
            </Button>
          );
        })}
      </ButtonGroup>
    </Box>
  );
}
