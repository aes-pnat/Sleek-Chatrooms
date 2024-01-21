import { useCallback, useEffect } from "react";
import { SocketService } from "../services/SocketService";
import { APIMessage, MessageSendableType } from "./types";

const crypto = require("crypto");

export const useSocket = (
  appCallback: (msgToReceive: APIMessage, action: string[] | null) => void
) => {
  const hookCallback = (
    sentMsg: MessageSendableType | null,
    msgToReceive: APIMessage
  ) => {
    if (sentMsg === null) {
      appCallback(msgToReceive, null);
    } else if (sentMsg.content.indexOf("/list messages") !== -1) {
      appCallback(msgToReceive, ["list", "messages"]);
    } else if (sentMsg.content.indexOf("/list rooms") !== -1) {
      appCallback(msgToReceive, ["list", "rooms"]);
    } else if (sentMsg.content.indexOf("/list users") !== -1) {
      appCallback(msgToReceive, ["list", "users"]);
    } else {
      appCallback(msgToReceive, null);
    }
  };

  const socket = new SocketService(hookCallback);

  const send = useCallback(
    async (
      username: string,
      password: string,
      room: string,
      content: string
    ) => {
      // if(msg.startsWith("/list rooms")) {
      //     return await socket.send(msg, id);
      // } else if(msg.startsWith("/list users")) {
      //     return await socket.send(msg, id);
      // } else if(msg.startsWith("/list messages")) {
      //     return await socket.send(msg, id);
      // } else {

      // }
      const uuid = crypto.randomUUID();
      const completeMsg: MessageSendableType = {
        username: username,
        password: password,
        id: uuid,
        room: room,
        content: content,
      };
      return await socket.send(completeMsg, uuid);
    },
    []
  );

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  return [socket, send];
};
