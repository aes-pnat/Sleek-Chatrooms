import React from "react";
import { Main } from "./components/Main";
import { Container, CssBaseline, ThemeProvider } from "@mui/material";
import { useThemeContext } from "./contexts/ThemeContext";
import { themes } from "./util/themes";

function App() {
  const { currentTheme } = useThemeContext();
  return (
    <ThemeProvider theme={currentTheme == "dark" ? themes.dark : themes.light}>
      <CssBaseline />
      <Main />
    </ThemeProvider>
  );
}

export default App;
