export type APIMessage = {
  isBot: boolean;
  roomName: string;
  roomID: string;
  userRecipientName: string;
  userRecipientID: string;
  userSenderName: string;
  userSenderID: string;
  data: string;
  timestamp: string;
  id: string;
  respondingToUUID: string;
};

export type MessageType = {
  content: string;
  senderName: string;
  senderID: string;
  roomName: string;
  roomID: string;
  timestamp: string;
  isCommand: boolean;
  id: string;
};

export type MessageSendableType = {
  username: string;
  password: string;
  id: string;
  room: string;
  content: string;
};
