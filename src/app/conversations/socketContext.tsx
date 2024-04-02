import { createContext } from "react";
import { io } from "socket.io-client";

export const socket = io("https://hertz-gh9dmsfjf-davidkusmiders-projects.vercel.app:3000");
export const SocketContext = createContext(socket);
