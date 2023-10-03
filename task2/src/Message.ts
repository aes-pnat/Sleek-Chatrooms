export class Message {
  roomName: string;
  content: string;

  constructor(roomName: string, content: string) {
    this.roomName = roomName;
    this.content = content;
  }
}
