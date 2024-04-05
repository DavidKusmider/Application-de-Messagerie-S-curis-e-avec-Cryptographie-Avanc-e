import { createContext } from "react";
import { io } from "socket.io-client";

export const socket = io("https://localhost:3000");
export const SocketContext = createContext(socket);
