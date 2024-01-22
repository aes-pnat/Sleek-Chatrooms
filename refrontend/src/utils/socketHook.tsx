import { useCallback, useEffect, useRef } from "react";
import { SocketService } from "../services/SocketService";
import { APIMessage, MessageSendableType } from "./types";
import { v4 as uuidv4 } from "uuid";

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

  const socketRef = useRef<SocketService>();

  const send = useCallback(
    async (
      username: string,
      password: string,
      room: string,
      content: string
    ) => {
      const uuid = uuidv4();
      const completeMsg: MessageSendableType = {
        username: username,
        password: password,
        id: uuid,
        room: room,
        content: content,
      };
      return await socketRef.current!.send(completeMsg, uuid);
    },
    []
  );

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = new SocketService(hookCallback);
    }
    socketRef.current.connect();
    return () => {
      socketRef.current!.disconnect();
    };
  }, []);

  return [send];
};
