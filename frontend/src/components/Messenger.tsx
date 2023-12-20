import React, { useEffect, useState } from "react";
import { UserType } from "../util/types";
import {
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

type MessengerProps = {
  user: UserType;
  setUser: React.Dispatch<React.SetStateAction<UserType>>;
};

type MessageType = {
  content: string;
  senderName: string;
  senderID: string;
  roomName: string;
  roomID: string;
  timestamp: string;
  isCommand: boolean;
  commandReturnType: string | null;
};

const styles = {
  centerElement: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  fillAndCenter: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    minHeight: "100vh",
  },
  paper: {
    width: "90%",
    height: "90%",
    padding: "5%",
  },
};

export const Messenger = ({ user, setUser }: MessengerProps) => {
  const [currentRoom, setCurrentRoom] = useState<string>("general");
  const [roomMap, setRoomMap] = useState<Record<string, string>>({});
  const [userMap, setUserMap] = useState<Record<string, string>>({});
  const [messageList, setMessageList] = useState<MessageType[]>([]);

  const [messageToSend, setMessageToSend] = useState<string>("");
  const navigate = useNavigate();

  /* OPTION TO RECONSIDER: 
    list commands are pointless, 
    they are already executed upon render, 
    but the user should still be able to use them
  */
  // const [stateChangeTrigger, setStateChangeTrigger] = useState(false);

  const ws_client = new WebSocket("ws://localhost:8080");

  const refreshListings = () => {
    ws_client.send(
      `${user.username}:${user.password}@${currentRoom} /list rooms`
    );
    ws_client.send(
      `${user.username}:${user.password}@${currentRoom} /list messages`
    );
    ws_client.send(
      `${user.username}:${user.password}@${currentRoom} /list users`
    );
  };

  const changeRoom = (roomName: string) => {
    ws_client.send(`${user.username}:${user.password}@${roomName} /list users`);
    ws_client.send(
      `${user.username}:${user.password}@${roomName} /list messages`
    );
  };

  const sendMessage = () => {
    ws_client.send(
      `${user.username}:${user.password}@${currentRoom} ${messageToSend}`
    );
    setMessageToSend("");
  };

  ws_client.addEventListener("message", (e) => {
    const recMsg = JSON.parse(e.data.toString());

    switch (recMsg.commandReturnType) {
      case "list/rooms":
        setRoomMap(JSON.parse(recMsg.content));
        console.log(recMsg.content);
        break;
      case "list/users":
        setUserMap(JSON.parse(recMsg.content));
        console.log(recMsg.content);
        break;
      case "list/message":
        setMessageList(JSON.parse(recMsg.content));
        console.log(recMsg.content);
        break;
      case null:
        setMessageList([...messageList, recMsg]);
        break;
      default:
        break;
    }
  });

  ws_client.addEventListener("open", () => {
    console.log("Connected to server");
    ws_client.send(`${user.username}:${user.password}@general /list rooms`);
    ws_client.send(`${user.username}:${user.password}@general /list messages`);
    ws_client.send(`${user.username}:${user.password}@general /list users`);
  });

  ws_client.addEventListener("close", () => {
    console.log("Disconnected from server");
  });

  // useEffect(() => {
  //   const intervalId = setInterval(refreshListings, 120000);
  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, []);

  return (
    <Container sx={styles.fillAndCenter}>
      <Grid container spacing={3}>
        <Grid item xs={2}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper sx={styles.paper}>
                <Typography variant="h5">Messenger</Typography>
                <Button onClick={() => navigate("/register")}>Register</Button>
                <Typography variant="body1">
                  Username: {user.username}
                </Typography>
                <Typography variant="body1">
                  Password: {user.password}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper sx={styles.paper}>
                {Object.keys(roomMap).map((roomID) => (
                  <Typography variant="body1" key={roomID}>
                    <Button onClick={() => changeRoom(roomMap[roomID])}>
                      {roomMap[roomID]}
                    </Button>
                  </Typography>
                ))}
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={8}>
          <Stack>
            {messageList.map((message: MessageType) => (
              <Paper>
                <Typography>{`[${message.timestamp}] ${message.senderName}`}</Typography>
                <Typography>{message.content}</Typography>
              </Paper>
            ))}
          </Stack>
          <TextField
            onChange={(e) => {
              setMessageToSend(e.target.value);
            }}
            value={messageToSend}
          ></TextField>
          <Button onClick={sendMessage}>→</Button>
        </Grid>

        <Grid item xs={2}>
          <Paper sx={styles.paper}>
            {Object.keys(userMap).map((userID) => (
              <Typography variant="body1" key={userID}>
                {userMap[userID]}
              </Typography>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};
