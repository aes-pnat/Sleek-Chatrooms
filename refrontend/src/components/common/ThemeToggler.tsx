import React, { useState } from "react";
import { Box, Switch, Typography } from "@mui/material";
import { useThemeContext } from "../../contexts/ThemeContext";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeIcon from "@mui/icons-material/LightMode";

export const ThemeToggler = () => {
  const { currentTheme, toggleTheme } = useThemeContext();
  const [checked, setChecked] = useState(currentTheme !== "dark");
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "0.2rem",
          padding: "1rem",
        }}
      >
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
      </Box>
    </Box>
  );
};
