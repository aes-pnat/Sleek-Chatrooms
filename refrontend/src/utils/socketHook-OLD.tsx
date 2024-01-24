import { useCallback, useEffect, useRef } from "react";
import { SocketService } from "../services/SocketService";
import { APIMessage, MessageSendableType } from "./types";
import { v4 as uuidv4 } from "uuid";

export const useSocket = (
  appCallback: (msgToReceive: APIMessage, action: string[] | null) => void
) => {
  const hookCallback = (val: {
    sentMsg: MessageSendableType | null;
    msgToReceive: APIMessage;
  }) => {
    if (val.sentMsg === null) {
      appCallback(val.msgToReceive, null);
    } else if (val.sentMsg.content.indexOf("/list messages") !== -1) {
      appCallback(val.msgToReceive, ["list", "messages"]);
    } else if (val.sentMsg.content.indexOf("/list rooms") !== -1) {
      appCallback(val.msgToReceive, ["list", "rooms"]);
    } else if (val.sentMsg.content.indexOf("/list users") !== -1) {
      appCallback(val.msgToReceive, ["list", "users"]);
    } else {
      appCallback(val.msgToReceive, null);
    }
  };

  const socketRef = useRef<SocketService>(new SocketService(hookCallback));

  const sendPacket = useCallback(
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
      socketRef
        .current!.send(completeMsg, uuid)
        .then(
          (val: {
            sentMsg: MessageSendableType | null;
            msgToReceive: APIMessage;
          }) => {
            hookCallback(val);
          }
        );
    },
    []
  );

  useEffect(() => {
    const socket = new SocketService(hookCallback);

    socketRef.current.connect();
    return () => {
      socketRef.current!.disconnect();
    };
  }, []);

  return [sendPacket];
};
