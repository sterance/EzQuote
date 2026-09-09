import { NumberField as BaseNumberField } from "@base-ui/react/number-field";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import * as React from "react";

type NumberFieldProps = Omit<React.ComponentProps<typeof BaseNumberField.Root>, "children"> & {
  label?: React.ReactNode;
  size?: "small" | "medium";
  error?: boolean;
  sx?: SxProps<Theme>;
};

export default function NumberField({ id: idProp, label, error, size = "medium", sx, ...other }: NumberFieldProps) {
  const id = idProp ?? React.useId();

  return (
    <BaseNumberField.Root
      {...other}
      render={(props, state) => (
        <FormControl size={size} ref={props.ref} disabled={state.disabled} required={state.required} error={error} variant="outlined" sx={sx}>
          {props.children}
        </FormControl>
      )}
    >
      <InputLabel htmlFor={id} sx={{ color: "var(--text-muted)", "&.Mui-focused": { color: "var(--accent)" } }}>
        {label}
      </InputLabel>
      <BaseNumberField.Input
        id={id}
        render={(props, state) => (
          <OutlinedInput
            label={label}
            inputRef={props.ref}
            value={state.inputValue}
            onBlur={props.onBlur}
            onChange={props.onChange}
            onKeyDown={props.onKeyDown}
            onKeyUp={props.onKeyUp}
            onFocus={props.onFocus}
            slotProps={{ input: props }}
            endAdornment={
              <InputAdornment
                position="end"
                sx={{
                  flexDirection: "column",
                  maxHeight: "unset",
                  alignSelf: "stretch",
                  borderLeft: "1px solid",
                  borderColor: "var(--border)",
                  ml: 0,
                  "& button": { py: 0, flex: 1, borderRadius: 0.5, color: "var(--text)" },
                }}
              >
                <BaseNumberField.Increment render={<IconButton size={size} aria-label="Increase" />}>
                  <KeyboardArrowUpIcon fontSize={size} />
                </BaseNumberField.Increment>
                <BaseNumberField.Decrement render={<IconButton size={size} aria-label="Decrease" />}>
                  <KeyboardArrowDownIcon fontSize={size} />
                </BaseNumberField.Decrement>
              </InputAdornment>
            }
            sx={{
              pr: 0,
              color: "var(--text)",
              backgroundColor: "var(--surface)",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "var(--border)" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "var(--accent)" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "var(--accent)" },
            }}
          />
        )}
      />
    </BaseNumberField.Root>
  );
}
