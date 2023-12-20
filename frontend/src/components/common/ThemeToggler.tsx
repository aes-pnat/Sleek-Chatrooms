import React, { useState } from "react";
import { Switch, Typography } from "@mui/material";
import { useThemeContext } from "../../contexts/ThemeContext";

export const ThemeToggler = () => {
  const [checked, setChecked] = useState(false);
  const { currentTheme, toggleTheme } = useThemeContext();
  return (
    <>
      <Typography>
        Switch to {currentTheme === "dark" ? "light" : "dark"} theme
      </Typography>
      <Switch
        checked={checked}
        onChange={() => {
          setChecked(!checked);
          toggleTheme();
        }}
        inputProps={{ "aria-label": "controlled" }}
      />
    </>
  );
};
