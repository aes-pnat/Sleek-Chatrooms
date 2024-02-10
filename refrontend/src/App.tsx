import React, { useEffect, useState, useReducer, useCallback } from "react";
import "./App.css";
import { useSocket } from "./utils/socketHook";
import { APIMessage, MessageType } from "./utils/types";

export const App = () => {
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
    sendPacket("username", "password", "general", messageToSend);
    setMessageToSend("");
  };

  const [sendPacket] = useSocket([appCallback, messages]);

  useEffect(() => {}, []);
  return (
    <div>
      <button
        onClick={() => {
          setMessages([]);
          setRooms({});
          setUsers({});
        }}
      >
        Clear
      </button>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={messageToSend}
          onChange={(e) => setMessageToSend(e.target.value)}
        />
      </form>
      <ol>
        {messages.map((message) => (
          <li key={message.id}>{message.content}</li>
        ))}
      </ol>

      <ul>
        {Object.keys(rooms).map((roomID) => (
          <li key={roomID}>{rooms[roomID]}</li>
        ))}
      </ul>

      <ul>
        {Object.keys(users).map((userID) => (
          <li key={userID}>{users[userID]}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
