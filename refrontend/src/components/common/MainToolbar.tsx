import {
  Box,
  Button,
  Drawer,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { ThemeToggler } from "./ThemeToggler";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useLocation, useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import { socket } from "../../util/socket";

const sendFill = (socket: Socket) => {
  socket.emit("fill");
};

export const MainToolbar = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filled, setFilled] = useState<boolean>(false);
  const drawerAnchor = "left";

  const location = useLocation();

  return (
    <Toolbar>
      <IconButton
        onClick={() => setDrawerOpen(true)}
        sx={{
          position: "absolute",
          left: 0,
          borderRadius: 5,
          color: "white",

          margin: "0 0 0 1rem",
        }}
      >
        <MoreVertIcon />
      </IconButton>

      <Typography
        variant="h4"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          fontFamily: "monospace",
        }}
      >
        Sleek
      </Typography>
      <Drawer
        anchor={drawerAnchor}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ padding: "1rem" }}>
          <Stack spacing={2}>
            <ThemeToggler />

            {location.pathname === "/messenger" && (
              <Button
                type="button"
                onClick={() => {
                  navigate("/register");
                  setDrawerOpen(false);
                }}
              >
                Register
              </Button>
            )}
            {location.pathname === "/messenger" && (
              <Button
                type="button"
                onClick={() => {
                  sendFill(socket);
                  setFilled(true);
                }}
                disabled={filled}
              >
                Fill rooms
              </Button>
            )}
          </Stack>
        </Box>
      </Drawer>
    </Toolbar>
  );
};
