import React, { useEffect, useState } from "react";
import { UserType } from "../types/Types";
import { Button, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

type MessengerProps = {
  user: UserType;
  setUser: React.Dispatch<React.SetStateAction<UserType>>;
};

export const Messenger = ({ user, setUser }: MessengerProps) => {
  const ws_client = new WebSocket("ws://localhost:8080");

  const [currentRoom, setCurrentRoom] = useState<string>("general");
  const [rooms, setRooms] = useState<Record<string, string>>({});
  const [users, setUsers] = useState<Record<string, string>>({});
  const [messages, setMessages] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    ws_client.addEventListener("message", (e) => {
      const recMsg = JSON.parse(e.data.toString());

      //console.log(`Received message from server: ${e.data.toString()}`);

      switch (recMsg.commandReturnType) {
        case "list/rooms":
          // localStorage.setItem("rooms", JSON.parse(recMsg.content));
          // console.log(JSON.parse(recMsg.content));
          setRooms(JSON.parse(recMsg.content));
          console.log(recMsg.content);
          break;
        case "list/users":
          console.log("List of users: ");
          break;
        case "list/message":
          break;
        default:
          // regular message
          break;
      }
    });

    ws_client.addEventListener("open", () => {
      console.log("Connected to server");
      ws_client.send(`${user.username}:${user.password}@general /list rooms`);
    });

    ws_client.addEventListener("close", () => {
      console.log("Disconnected from server");
    });
  }, []);

  return (
    <>
      <Paper>
        <Typography variant="h4">Messenger</Typography>
        <Button onClick={() => navigate("/register")}>Register</Button>
        <Typography variant="body1">Username: {user.username}</Typography>
        <Typography variant="body1">Password: {user.password}</Typography>
        {Object.keys(rooms).map((roomID) => (
          <Typography variant="body1" key={roomID}>
            {rooms[roomID]}
          </Typography>
        ))}
      </Paper>
    </>
  );
};
