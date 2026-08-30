import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

interface TextboxProps {
  label: string;
  placeholder?: string;
  value?: string;
}

export default function Textbox({ label, placeholder, value }: TextboxProps) {
  return (
    <Box
      component="form"
      sx={{ width: "100%", "& .MuiTextField-root": { my: 3, width: "100%" } }}
      noValidate
      autoComplete="off"
    >
      <div>
        <TextField
          id="outlined-textarea"
          label={label}
          placeholder={placeholder}
          value={value ?? ""}
          multiline
          minRows={4}
          slotProps={{ input: { readOnly: true } }}
        />
      </div>
    </Box>
  );
}
