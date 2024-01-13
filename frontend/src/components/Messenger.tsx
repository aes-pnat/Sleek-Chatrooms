import React, { useEffect, useRef, useState } from "react";
import { socket } from "../util/socket";
import { UserType, MessageType, APIResponse } from "../util/types";
import {
  Button,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate } from "react-router-dom";
import { MessengerStyles as styles } from "../util/styles";

type MessengerProps = {
  user: UserType;
  setUser: React.Dispatch<React.SetStateAction<UserType>>;
};

const createTitleItem = (title: string) => {
  return (
    <Divider textAlign="center" sx={{ padding: "0 0 1rem 0 " }}>
      <Typography variant="h5" sx={{ fontFamily: "monospace" }}>
        {title}
      </Typography>
    </Divider>
  );
};
export const Messenger = ({ user, setUser }: MessengerProps) => {
  const [currentRoom, setCurrentRoom] = useState<string>("general");
  const [roomMap, setRoomMap] = useState<Record<string, string>>({});
  const [userMap, setUserMap] = useState<Record<string, string>>({});
  const [messageList, setMessageList] = useState<MessageType[]>([]);
  const [filled, setFilled] = useState<boolean>(false);

  const [messageToSend, setMessageToSend] = useState<string>("");
  const navigate = useNavigate();

  const chatBottomRef: React.RefObject<HTMLDivElement> =
    useRef<HTMLDivElement>(null);

  const scrollToElement = () => {
    const { current } = chatBottomRef;
    if (current !== null) {
      current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  };

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
    socket.emit(
      "message",
      `${user.username}:${user.password}@${roomName} /list rooms`
    );
    setCurrentRoom(roomName);
  };

  const sendMessage = () => {
    socket.emit(
      "message",
      `${user.username}:${user.password}@${currentRoom} ${messageToSend}`
    );
    setMessageToSend("");

    socket.emit(
      "message",
      `${user.username}:${user.password}@${currentRoom} /list rooms`
    );
  };

  const sendFill = () => {
    socket.emit("fill");
  };

  const handleKeypress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
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
          scrollToElement();
          break;
        case null:
          // setMessageList([
          //   ...messageList,
          //   {
          //     content: alert.data,
          //     senderName: alert.userSenderName,
          //     senderID: alert.userSenderID,
          //     roomName: alert.roomName,
          //     roomID: alert.roomID,
          //     timestamp: alert.timestamp,
          //     isCommand: alert.data.startsWith("/"),
          //     commandReturnType: alert.commandReturnType,
          //   },
          // ]);
          socket.emit(
            "message",
            `${user.username}:${user.password}@${currentRoom} /list messages`
          );
          console.log(messageList);
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
    scrollToElement();
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
        minWidth: "100vw",
        maxWidth: "100vw",
      }}
    >
      <Grid container>
        <Grid item xs={2}>
          <Grid
            container
            sx={styles.container}
            direction="column"
            justifyContent="flex-start"
            alignItems="stretch"
          >
            <Grid
              item
              xs={4}
              sx={{ ...styles.gridSubItem, maxHeight: "50%" }}
              id="profileItem"
            >
              <Paper sx={styles.paper} elevation={3}>
                {createTitleItem("Profile")}

                <Typography variant="body1">
                  Username: {user.username}
                </Typography>
                <Typography variant="body1">
                  Password: {user.password}
                </Typography>

                <Divider sx={{ margin: "0.5rem 0" }} />
                <Button type="button" onClick={() => navigate("/register")}>
                  Register
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    sendFill();
                    setFilled(true);
                  }}
                  disabled={filled}
                >
                  Fill rooms
                </Button>
              </Paper>
            </Grid>
            <Grid
              item
              xs={8}
              sx={{ ...styles.gridSubItem, height: "100%", minHeight: "100%" }}
              id="roomsItem"
            >
              <Paper
                sx={{
                  ...styles.paper,
                  overflowY: "auto",
                  minHeight: "100%",
                }}
                elevation={3}
              >
                {createTitleItem("Rooms")}
                {Object.keys(roomMap).map((roomID) => (
                  <Typography variant="body1" key={roomID}>
                    <Button
                      type="button"
                      variant={
                        currentRoom === roomMap[roomID]
                          ? "contained"
                          : "outlined"
                      }
                      onClick={() => changeRoom(roomMap[roomID])}
                      sx={{ width: "100%", margin: "0.5rem 0 0 0 " }}
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
            <Grid item xs={12} sx={styles.gridSubItem} id="messagesItem">
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
                  <Paper
                    key="scrollToBottom"
                    component="div"
                    sx={{ float: "left", clear: "both" }}
                    ref={chatBottomRef}
                  />
                </Stack>
              </Paper>
            </Grid>
            <Grid item xs={12} sx={styles.gridSubItem} id="messageSendItem">
              <Grid container>
                <Grid item xs={11}>
                  <TextField
                    id="message"
                    label="Message"
                    onChange={(e) => {
                      setMessageToSend(e.target.value);
                    }}
                    onKeyDown={handleKeypress}
                    value={messageToSend}
                    sx={{
                      width: "100%",
                      padding: "0 2% 0 0",
                    }}
                  />
                </Grid>
                <Grid item xs={1}>
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
          </Grid>
        </Grid>

        <Grid item xs={2} sx={styles.gridSubItem}>
          <Paper sx={{ ...styles.paper, overflowY: "auto" }} elevation={3}>
            {createTitleItem("Users")}
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
