import { useCallback, useEffect, useRef, useState } from "react";
import { APIMessage, MessageSendableType } from "./types";
import { v4 as uuidv4 } from "uuid";
import { io, Socket } from "socket.io-client";

export const useSocket = (
  appCallback: (msgToReceive: APIMessage, action: string[] | null) => void
) => {
  const [repository, setRepository] = useState<
    Record<
      string,
      {
        msg: MessageSendableType;
        p: Promise<MessageSendableType>;
      }
    >
  >({});

  const [socket] = useState<Socket>(
    io("http://localhost:8080", {
      transports: ["websocket"],
      autoConnect: false,
    })
  );

  const handleConnect = () => {
    console.log("Connected to server");
  };

  const handleDisconnect = () => {
    console.log("Disconnected from server");
  };

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

  const handleAlert = (msgToReceive: APIMessage) => {
    console.log(msgToReceive);
    // if (msgToReceive.respondingToUUID === null) {
    //   hookCallback(null, msgToReceive);
    //   return;
    // }

    const primaryMessage = repository[msgToReceive.respondingToUUID];

    if (primaryMessage === undefined) {
      hookCallback(null, msgToReceive);
      return;
    } else {
      primaryMessage.p.then(
        (sentMsg: MessageSendableType) => {
          if (sentMsg.content !== primaryMessage.msg.content) {
            throw new Error(
              `Message ID does not match \n\tExpected: ${primaryMessage.msg} \n\tReceived: ${sentMsg}`
            );
          }
          const copy = repository;
          delete copy[msgToReceive.respondingToUUID as string];
          setRepository(copy);

          hookCallback(sentMsg, msgToReceive);
          return;
        },
        (err: string) => {
          console.log(err);
          return;
        }
      );
    }
  };

  const [queue, setQueue] = useState({});

  const send = useCallback(
    async (
      username: string,
      password: string,
      room: string,
      content: string
    ): Promise<MessageSendableType> => {
      const uuid = uuidv4();
      const completeMsg: MessageSendableType = {
        username: username,
        password: password,
        id: uuid,
        room: room,
        content: content,
      };

      // const p: Promise<MessageSendableType> = Promise.resolve(completeMsg);
      const p: Promise<MessageSendableType> = new Promise((res, rej) => {
        const newQueue = { ...queue };
        //newQueue]uuid] = { resolve: (msg) => res(msg), reject: err =>rej(err()) };
        setQueue(newQueue);
        setRepository({ ...repository, [uuid]: { msg: completeMsg, p: p } });

        try {
          res(completeMsg);
        } catch (e) {
          rej(e);
        }
      });

      console.log(repository);
      socket.emit("message", completeMsg);

      return p;
    },
    [repository]
  );

  const connect = () => {
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("alert", handleAlert);
    socket.connect();
  };

  const disconnect = () => {
    socket.disconnect();
    socket.off("connect", handleConnect);
    socket.off("disconnect", handleDisconnect);
    socket.off("alert", handleAlert);
  };

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, []);

  return [send];
};
