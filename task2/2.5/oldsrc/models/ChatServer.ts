import { RoomService } from "../services/RoomService";
import { UserService } from "../services/UserService";
import { BotService } from "../services/BotService";

export class ChatServer {
  public rooms: Record<string, RoomService> = {};
  public figures: Record<string, UserService | BotService> = {
    SERVER: new BotService("SERVER"),
  };
}
