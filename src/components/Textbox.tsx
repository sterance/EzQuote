import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

interface TextboxProps {
  label: string;
  placeholder?: string;
}

export default function Textbox({ label, placeholder }: TextboxProps) {
  return (
    <Box
      component="form"
      sx={{ width: "100%", "& .MuiTextField-root": { mb: 1, width: "100%" } }}
      noValidate
      autoComplete="off"
    >
      <div>
        <TextField
          id="outlined-textarea"
          label={label}
          placeholder={placeholder}
          multiline
        />
      </div>
    </Box>
  );
}
