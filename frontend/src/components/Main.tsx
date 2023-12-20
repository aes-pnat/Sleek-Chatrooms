import React, { useState } from "react";
import { Register } from "./Register";
import { Messenger } from "./Messenger";
import { UserType } from "../util/types";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ThemeToggler } from "./common/ThemeToggler";
import { Box } from "@mui/material";

export const Main = () => {
  const [user, setUser] = useState<UserType>({
    username: "",
    password: "",
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        minWidth: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ThemeToggler />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/register" replace />} />
          <Route
            path="/register"
            element={<Register user={user} setUser={setUser} />}
          />
          <Route
            path="/messenger"
            element={<Messenger user={user} setUser={setUser} />}
          />
        </Routes>
      </BrowserRouter>
    </Box>
  );
};
