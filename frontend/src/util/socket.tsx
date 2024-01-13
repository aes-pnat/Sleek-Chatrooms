import { io } from "socket.io-client";

export const socket = io("http://localhost:8080", {
  // export const socket = io("http://10.129.3.100:8080", {
  transports: ["websocket"],
  autoConnect: false,
});
