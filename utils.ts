import "colors";

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function colorByName(text: string, name: string) {
  switch (name) {
    case "SERVER":
      return text.bgRed;
    case "roger":
      return text.yellow;
    case "bobby":
      return text.blue;
    case "kerry":
      return text.cyan;
    case "steve":
      return text.red;
    case "echo":
      return text.magenta;
    default:
      return text;
  }
}

export async function messageCallback(
  isBotMessage: boolean,
  roomName: string,
  userRecipient: string,
  userSender: string,
  msgContent: string,
  msgTimestamp: string
): Promise<void> {
  let alert;
  await wait(500 * (1 + Math.random()));
  if (isBotMessage) {
    // msg.sender instanceof Bot
    alert = colorByName(
      `[${msgTimestamp}] To "${userRecipient}" ::: Announcement in room "${roomName}": ${msgContent}`,
      userRecipient
    );
  } else {
    alert = colorByName(
      `[${msgTimestamp}] To "${userRecipient}" ::: "${userSender}" posted in "${roomName}": "${msgContent}"`,
      userRecipient
    );
  }
  console.log(alert);
}
