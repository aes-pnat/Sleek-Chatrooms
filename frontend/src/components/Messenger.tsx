import React, { useEffect } from "react";
import { UserType } from "../types/Types";
import { Paper, Typography } from "@mui/material";

type MessengerProps = {
  user: UserType;
  setUser: React.Dispatch<React.SetStateAction<UserType>>;
};

export const Messenger = ({ user, setUser }: MessengerProps) => {
  const ws_client = new WebSocket("ws://localhost:8080");

  useEffect(() => {
    ws_client.addEventListener("open", () => {
      console.log("Connected to server");
      ws_client.send(`${user.username}:${user.password}@general /list rooms`);
    });

    ws_client.addEventListener("message", (e) => {
      const recMsg = JSON.parse(e.data.toString());

      console.log(`Received message from server: ${recMsg}`);

      if (recMsg.includes("Rooms List")) {
        localStorage.setItem("rooms", recMsg);
      } else if (recMsg.includes("Users List")) {
        localStorage.setItem("users", recMsg);
      } else if (recMsg.includes("Messages List")) {
        localStorage.setItem("messages", recMsg);
      }
    });

    ws_client.addEventListener("close", () => {
      console.log("Disconnected from server");
    });
  });

  return (
    <>
      <Paper>
        <Typography variant="h4">Messenger</Typography>
        <Typography variant="body1">Username: {user.username}</Typography>
        <Typography variant="body1">Password: {user.password}</Typography>
      </Paper>
    </>
  );
};
