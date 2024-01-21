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
  respondingToUUID: string | null;
};

export type MessageType = {
  content: string;
  senderName: string;
  senderID: string;
  roomName: string;
  roomID: string;
  timestamp: string;
  isCommand: boolean;
};

export type MessageSendableType = {
  username: string;
  password: string;
  id: string;
  room: string;
  content: string;
};
