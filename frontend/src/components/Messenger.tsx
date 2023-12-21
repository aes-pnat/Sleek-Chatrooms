import React, { useEffect, useState } from "react";
import { socket } from "../util/socket";
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
import SendIcon from "@mui/icons-material/Send";
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

type APIResponse = {
  isBot: boolean;
  roomName: string;
  roomID: string;
  userRecipientName: string;
  userRecipientID: string;
  userSenderName: string;
  userSenderID: string;
  data: string;
  commandReturnType: string | null;
  timestamp: string;
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
    minHeight: "90vh",
    minWidth: "90vw",
  },
  paper: {
    minHeight: "100%",
    maxHeight: "100%",
    padding: "10%",
  },
  messageSender: {
    fontSize: "0.8rem",
    padding: "0 0.3rem",
  },
  message: {
    fontSize: "1rem",
    padding: "0 0 0.5rem 0.5rem",
  },
  container: { minHeight: "100%" },
};

export const Messenger = ({ user, setUser }: MessengerProps) => {
  const [currentRoom, setCurrentRoom] = useState<string>("general");
  const [roomMap, setRoomMap] = useState<Record<string, string>>({});
  const [userMap, setUserMap] = useState<Record<string, string>>({});
  const [messageList, setMessageList] = useState<MessageType[]>([]);

  const [messageToSend, setMessageToSend] = useState<string>("");
  const navigate = useNavigate();

  const refreshListings = () => {
    socket.emit(
      "message",
      `${user.username}:${user.password}@${currentRoom} /list rooms`
    );
    socket.emit(
      "message",
      `${user.username}:${user.password}@${currentRoom} /list messages`
    );
    socket.emit(
      "message",
      `${user.username}:${user.password}@${currentRoom} /list users`
    );
  };

  const changeRoom = (roomName: string) => {
    socket.emit(
      "message",
      `${user.username}:${user.password}@${roomName} /list users`
    );
    socket.emit(
      "message",
      `${user.username}:${user.password}@${roomName} /list messages`
    );
    setCurrentRoom(roomName);
  };

  const sendMessage = () => {
    console.log(
      "message",
      `${user.username}:${user.password}@${currentRoom} ${messageToSend}`
    );
    socket.emit(
      "message",
      `${user.username}:${user.password}@${currentRoom} ${messageToSend}`
    );
    setMessageToSend("");
  };

  useEffect(() => {
    const handleConnect = () => {
      console.log("Connected to server");
      socket.emit(
        "message",
        `${user.username}:${user.password}@general /list rooms`
      );
      socket.emit(
        "message",
        `${user.username}:${user.password}@general /list messages`
      );
      socket.emit(
        "message",
        `${user.username}:${user.password}@general /list users`
      );
    };
    const handleDisconnect = () => {
      console.log("Disconnected from server");
    };
    const handleAlert = (alert: APIResponse) => {
      switch (alert.commandReturnType) {
        case "list/rooms":
          setRoomMap(JSON.parse(alert.data));
          break;
        case "list/users":
          setUserMap(JSON.parse(alert.data));
          break;
        case "list/messages":
          setMessageList(JSON.parse(alert.data));
          break;
        case null:
          setMessageList([
            ...messageList,
            {
              content: alert.data,
              senderName: alert.userSenderName,
              senderID: alert.userSenderID,
              roomName: alert.roomName,
              roomID: alert.roomID,
              timestamp: alert.timestamp,
              isCommand: alert.data.startsWith("/"),
              commandReturnType: alert.commandReturnType,
            },
          ]);
          break;
        default:
          break;
      }
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("alert", handleAlert);

    socket.connect();

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("alert", handleAlert);

      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(refreshListings, 180000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Container
      sx={{
        ...styles.fillAndCenter,
        minHeight: "90vh",
        maxHeight: "90vh",
        minWidth: "90vw",
        maxWidth: "90vw",
      }}
    >
      <Grid container>
        <Grid item xs={2}>
          <Grid container sx={styles.container}>
            <Grid item xs={12}>
              <Paper sx={styles.paper} elevation={3}>
                <Typography variant="h5">Sleek</Typography>
                <Button type="button" onClick={() => navigate("/register")}>
                  Register
                </Button>
                <Typography variant="body1">
                  Username: {user.username}
                </Typography>
                <Typography variant="body1">
                  Password: {user.password}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper
                sx={{
                  ...styles.paper,
                  overflowY: "auto",
                }}
                elevation={3}
              >
                {Object.keys(roomMap).map((roomID) => (
                  <Typography variant="body1" key={roomID}>
                    <Button
                      type="button"
                      onClick={() => changeRoom(roomMap[roomID])}
                    >
                      {roomMap[roomID]}
                    </Button>
                  </Typography>
                ))}
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={8}>
          <Grid container sx={styles.container}>
            <Grid item xs={12}>
              <Paper
                sx={{
                  minHeight: "60vh",
                  maxHeight: "60vh",
                  overflowY: "auto",
                }}
                elevation={3}
              >
                <Stack justifyContent="space-between">
                  {messageList.map((message: MessageType) => (
                    <Paper
                      key={`[${message.timestamp}] ${message.senderName} ${message.content}`}
                      sx={{ padding: "0.2rem 1rem" }}
                    >
                      <Typography
                        sx={styles.messageSender}
                      >{`[${message.timestamp}] ${message.senderName}`}</Typography>
                      <Typography sx={styles.message}>
                        {message.content}
                      </Typography>
                    </Paper>
                  ))}
                </Stack>
              </Paper>
            </Grid>
            <Grid item xs={10}>
              <TextField
                onChange={(e) => {
                  setMessageToSend(e.target.value);
                }}
                value={messageToSend}
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={2}>
              <Button
                type="button"
                variant="contained"
                onClick={sendMessage}
                sx={{ width: "100%", height: "100%" }}
              >
                <SendIcon />
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={2}>
          <Paper sx={styles.paper} elevation={3}>
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
