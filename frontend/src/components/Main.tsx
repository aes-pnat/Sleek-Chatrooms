import React from "react";
import { Register } from "./Register";
import { Messenger } from "./Messenger";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Grid,
  Drawer,
  Button,
} from "@mui/material";
import { MainToolbar } from "./common/MainToolbar";

export const Main = () => {
  return (
    <BrowserRouter>
      <AppBar position="static">
        <MainToolbar />
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
        <Routes>
          <Route path="/" element={<Navigate to="/register" replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="/messenger" element={<Messenger />} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
};
