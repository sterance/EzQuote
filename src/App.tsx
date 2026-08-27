import "./App.css";
import { Box, IconButton } from "@mui/material";
import { useState } from "react";
import Textbox from "./components/Textbox";
import Buttons from "./components/Buttons";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <Box className="app-shell" data-theme={isDarkMode ? "dark" : "light"}>
      <Box component="nav" className="top-nav" aria-label="Main navigation">
        <span className="brand-mark">App</span>
        <IconButton
          className="theme-toggle"
          aria-label={
            isDarkMode ? "Switch to light mode" : "Switch to dark mode"
          }
          title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          onClick={() => setIsDarkMode((current) => !current)}
        >
          <span aria-hidden="true">{isDarkMode ? "☀" : "☾"}</span>
        </IconButton>
      </Box>

      <Box component="main" className="main-content">
        <Box className="button-sections">
          <Buttons
            label="Broken Cable"
            buttons={[
              { text: "Flooded" },
              { text: "Cut" },
              { text: "Broken pins" },
            ]}
          />
        </Box>

        <Textbox label="Output" placeholder="" />
      </Box>
    </Box>
  );
}

export default App;
