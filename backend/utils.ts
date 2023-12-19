export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function messageCallback(
  isBotMessage: boolean,
  roomName: string,
  roomID: string,
  userRecipient: string,
  userRecipientID: string,
  userSender: string,
  userSenderID: string,
  msgContent: string,
  commandReturnType: string | undefined,
  msgTimestamp: string
): Promise<void> {
  let alert;
  await wait(500 * (1 + Math.random()));
  if (isBotMessage) {
    // msg.sender instanceof Bot
    alert = `[${msgTimestamp}] To "${userRecipient}" ::: |${userSender}| to "${roomName}": ${msgContent}`;
  } else {
    alert = `[${msgTimestamp}] To "${userRecipient}" ::: "${userSender}" posted in "${roomName}": "${msgContent}"`;
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
