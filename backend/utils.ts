export type APIMessage = {
  isBot: boolean;
  roomName: string;
  roomID: string;
  userRecipientName: string;
  userRecipientID: string;
  userSenderName: string;
  userSenderID: string;
  content: string;
  commandReturnType: string | null;
  timestamp: string;
};

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function messageCallback(apiMessage: APIMessage): Promise<void> {
  let alert;
  await wait(500 * (1 + Math.random()));
  if (apiMessage.isBot) {
    // msg.sender instanceof Bot
    alert = `[${apiMessage.timestamp}] To "${apiMessage.userRecipientName}" ::: |${apiMessage.userSenderName}| to "${apiMessage.roomName}": ${apiMessage.content}`;
  } else {
    alert = `[${apiMessage.timestamp}] To "${apiMessage.userRecipientName}" ::: "${apiMessage.userSenderName}" posted in "${apiMessage.roomName}": "${apiMessage.content}"`;
  }
  console.log(alert);
}

export function getTimestamp(datetime: Date | undefined): string {
  const m = datetime?.getMinutes();
  const s = datetime?.getSeconds();
  const h = datetime?.getHours();
  const ms = datetime?.getMilliseconds();
  return datetime === undefined
    ? "timestamp"
    : `${h! > 9 ? `${h}` : `0${h}`}:${m! > 9 ? `${m}` : `0${m}`}:${
        s! > 9 ? `${s}` : `0${s}`
      }:${ms! > 99 ? `${ms}` : ms! > 9 ? `0${ms}` : `00${ms}`}`;
}
