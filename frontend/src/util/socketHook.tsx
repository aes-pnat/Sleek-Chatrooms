import { io, Socket } from "socket.io-client";
import { useEffect, useState, useCallback } from "react";
import { UserType, MessageType, APIResponse } from "./types";

const socket = io("http://localhost:8080", {
  transports: ["websocket"],
  autoConnect: false,
});

export const useSocket = () => {
  const [connected, setConnnected] = useState<boolean>(false);
  const [user] = useState<UserType>(
    JSON.parse(localStorage.getItem("user") || "{}") as UserType
  );
  const [currentRoom, setCurrentRoom] = useState<string>("");
  const [roomMap, setRoomMap] = useState<Record<string, string>>({});
  const [userMap, setUserMap] = useState<Record<string, string>>({});
  const [messageList, setMessageList] = useState<MessageType[]>([]);

  const loadData = useCallback(() => {
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
  }, [user.username, user.password, currentRoom]);

  const sendMessage = useCallback(
    (message: string) => {
      socket.emit(
        "message",
        `${user.username}:${user.password}@${currentRoom} ${message}`
      );

      if (message.startsWith("/")) {
        // wait for a response
      }
    },
    [user.username, user.password, currentRoom]
  );

  const changeRoom = useCallback(
    (roomName: string) => {
      setCurrentRoom(roomName);
      loadData();
    },
    [loadData]
  );

  const handleConnect = () => {
    setConnnected(true);
    console.log("Connected to server");
    loadData();
  };

  const handleDisconnect = () => {
    setConnnected(false);
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
        //scrollToElement();
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

  useEffect(() => {
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

  return [
    connected,
    user,
    currentRoom,
    roomMap,
    userMap,
    messageList,
    sendMessage,
    changeRoom,
    loadData,
  ];
};
