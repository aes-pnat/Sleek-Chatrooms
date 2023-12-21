import React, { useState } from "react";
import { Register } from "./Register";
import { Messenger } from "./Messenger";
import { UserType } from "../util/types";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ThemeToggler } from "./common/ThemeToggler";
import { Box, AppBar, Toolbar, Typography } from "@mui/material";

export const Main = () => {
  const [user, setUser] = useState<UserType>({
    username: "",
    password: "",
  });

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <ThemeToggler />
          {/* <Typography variant="h5" align="center">
            Sleek
          </Typography>
          <Typography variant="body1" align="right">
            Username: {user.username}
          </Typography>
          <Typography variant="body1" align="right">
            Password: {user.password}
          </Typography> */}
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          minHeight: "90vh",
          minWidth: "90vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
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
    </>
  );
};
