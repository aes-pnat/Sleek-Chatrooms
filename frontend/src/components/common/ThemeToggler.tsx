import React, { useState } from "react";
import { Switch, Typography } from "@mui/material";
import { useThemeContext } from "../../contexts/ThemeContext";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeIcon from "@mui/icons-material/LightMode";

export const ThemeToggler = () => {
  const [checked, setChecked] = useState(false);
  const { currentTheme, toggleTheme } = useThemeContext();
  return (
    <>
      {/* {currentTheme === "dark" ? <DarkModeOutlinedIcon /> : <LightModeIcon />} */}
      <DarkModeOutlinedIcon />
      <Switch
        color="default"
        checked={checked}
        onChange={() => {
          setChecked(!checked);
          toggleTheme();
        }}
        inputProps={{ "aria-label": "controlled" }}
      />
      <LightModeIcon />
    </>
  );
};
