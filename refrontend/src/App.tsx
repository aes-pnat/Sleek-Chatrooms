import React, { useEffect, useState, useReducer } from "react";
import "./App.css";
import { useSocket } from "./utils/socketHook";
import { APIMessage, MessageType } from "./utils/types";

export const App = () => {
  const [messageToSend, setMessageToSend] = useState<string>("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [rooms, setRooms] = useState<Record<string, string>>({});
  const [users, setUsers] = useState<Record<string, string>>({});

  const appCallback = (msgToReceive: APIMessage, action: string[] | null) => {
    const msgToReceiveAsMessageType: MessageType = {
      content: msgToReceive.data,
      senderName: msgToReceive.userSenderName,
      senderID: msgToReceive.userSenderID,
      roomName: msgToReceive.roomName,
      roomID: msgToReceive.roomID,
      timestamp: msgToReceive.timestamp,
      isCommand: action !== null,
    };
    if (action === null) {
      // add a message to the messages list
      setMessages([...messages, msgToReceiveAsMessageType]);
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
  };

  const [send] = useSocket(appCallback);

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
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send("username", "password", "general", messageToSend);
          setMessageToSend("");
        }}
      >
        <input
          type="text"
          value={messageToSend}
          onChange={(e) => setMessageToSend(e.target.value)}
        />
      </form>
      <ol>
        {messages.map((message) => (
          <li>{message.content}</li>
        ))}
      </ol>

      <ul>
        {Object.keys(rooms).map((roomID) => (
          <li>{rooms[roomID]}</li>
        ))}
      </ul>

      <ul>
        {Object.keys(users).map((userID) => (
          <li>{users[userID]}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
