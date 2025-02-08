import React, { useEffect, useRef, useState, useCallback } from "react";
import { UserType, MessageType, APIMessage } from "../utils/types";
import {
  Box,
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
import { MessengerStyles as styles } from "../utils/styles";
import { useSocket } from "../utils/socketHook";

const createTitleItem = (title: string) => {
  return (
    <Divider
      textAlign="center"
      sx={{ padding: "0 0 1rem 0 ", borderBottomWidth: "45px" }}
    >
      <Typography variant="h5" sx={{ fontFamily: "monospace" }}>
        {title}
      </Typography>
    </Divider>
  );
};
export const Messenger = () => {
  const [user, setUser] = useState<UserType>({ username: "", password: "" });
  const [currentRoom, setCurrentRoom] = useState<string>("general");
  const [messageToSend, setMessageToSend] = useState<string>("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [rooms, setRooms] = useState<Record<string, string>>({});
  const [users, setUsers] = useState<Record<string, string>>({});

  const appCallback = useCallback(
    (
      msgToReceive: APIMessage,
      action: string[] | null,
      currentMessages: MessageType[]
    ) => {
      const msgToReceiveAsMessageType: MessageType = {
        content: msgToReceive.data,
        senderName: msgToReceive.userSenderName,
        senderID: msgToReceive.userSenderID,
        roomName: msgToReceive.roomName,
        roomID: msgToReceive.roomID,
        timestamp: msgToReceive.timestamp,
        isCommand: action !== null,
        id: msgToReceive.id,
      };
      console.log(action);
      if (action === null) {
        const newMessages: MessageType[] = [
          ...currentMessages,
          msgToReceiveAsMessageType,
        ];
        setMessages(newMessages);
        return;
      }

      switch (action[0]) {
        case "list":
          switch (action[1]) {
            case "rooms":
              setRooms(JSON.parse(msgToReceiveAsMessageType.content));
              break;
            case "users":
              setUsers(JSON.parse(msgToReceiveAsMessageType.content));
              break;
            case "messages":
              setMessages(JSON.parse(msgToReceiveAsMessageType.content));
              break;
            default:
              break;
          }
          break;
        default:
          break;
      }
    },
    [messages]
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendPacket(user.username, user.password, currentRoom, messageToSend);
    setMessageToSend("");
  };

  const listRooms = () => {
    sendPacket(user.username, user.password, currentRoom, "/list rooms");
  };

  const listUsers = () => {
    sendPacket(user.username, user.password, currentRoom, "/list users");
  };

  const listMessages = () => {
    sendPacket(user.username, user.password, currentRoom, "/list messages");
  };

  const [sendPacket] = useSocket([appCallback, messages]);

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

  const changeRoom = (roomName: string) => {
    setCurrentRoom(roomName);
    listRooms();
    listMessages();
    listUsers();
    scrollToElement();
  };

  const handleKeypress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      sendPacket(user.username, user.password, currentRoom, messageToSend);
      setMessageToSend("");
    }
  };

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
            {true && (
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
                  {/* <Typography variant="body1">
                    Password: {user.password}
                  </Typography> */}
                </Paper>
              </Grid>
            )}
            <Grid
              item
              xs={12}
              sx={{
                ...styles.gridSubItem,
                minHeight: "100%",
                maxHeight: "50vh",
              }}
              id="roomsItem"
            >
              <Paper
                sx={{
                  ...styles.paper,
                  minHeight: "47vh",
                  maxHeight: "47vh",
                }}
                elevation={3}
              >
                {createTitleItem("Rooms")}
                <Box
                  sx={{
                    overflowY: "auto",
                    minHeight: "35vh",
                    maxHeight: "35vh",
                  }}
                >
                  {Object.keys(rooms).map((roomID) => (
                    <Typography
                      variant="body1"
                      key={roomID}
                      sx={{ margin: "0 0.2rem 0 0" }}
                    >
                      <Button
                        type="button"
                        variant={
                          currentRoom === rooms[roomID]
                            ? "contained"
                            : "outlined"
                        }
                        onClick={() => changeRoom(rooms[roomID])}
                        sx={{ width: "100%", margin: "0.5rem 0 0 0 " }}
                      >
                        {rooms[roomID]}
                      </Button>
                    </Typography>
                  ))}
                </Box>
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
                  {messages.map((message: MessageType) => (
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
                    onClick={handleSubmit}
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
