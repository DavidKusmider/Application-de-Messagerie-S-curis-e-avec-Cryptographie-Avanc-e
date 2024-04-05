import { io } from "socket.io-client";
import { Message } from "@/types/databases.types";
import { insertMessage } from "@/app/conversations/actions";
import * as router from "next/navigation"

export function joinRoomSocket(conversationId: string, socket: any) {
  socket.emit('joinRoom', conversationId);
}

export function saveMessageEvent(socket: any) {
  socket.on("save_message", async (formattedMessage: Message, conversationId: any, userData: any, socketId: any) => {
    //console.log("save_message event");
    //console.log(formattedMessage, conversationId);
    if (socket.id === socketId) {
      await insertMessage(formattedMessage, conversationId, userData.user);
    }
  });
}
