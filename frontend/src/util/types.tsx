export type UserType = {
  username: string;
  password: string;
};

export type MessageType = {
  content: string;
  senderName: string;
  senderID: string;
  roomName: string;
  roomID: string;
  timestamp: string;
  isCommand: boolean;
  commandReturnType: string | null;
};

export type APIResponse = {
  isBot: boolean;
  roomName: string;
  roomID: string;
  userRecipientName: string;
  userRecipientID: string;
  userSenderName: string;
  userSenderID: string;
  data: string;
  commandReturnType: string | null;
  timestamp: string;
};
