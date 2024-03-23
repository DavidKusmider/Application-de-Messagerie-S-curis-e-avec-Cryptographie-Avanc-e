'use client';

import { useEffect, useRef, useState } from "react";

import MessageBox from "./MessageBox";
import { find } from "lodash";
import { User } from '@supabase/supabase-js';
import { Message, UserMetadata } from "@/types/databases.types"
import { io } from "socket.io-client";

interface BodyProps {
  userData: User | null;
  initialMessages: any[];
  usersMetadata: UserMetadata[] | null;
}

// @ts-ignore
const Body: React.FC<BodyProps> = ({ usersMetadata, userData, initialMessages }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState(initialMessages);

  useEffect(() => {
    console.log('useEffect triggered with messages:', messages);
    bottomRef?.current?.scrollIntoView();

    const messageHandler = (message: any) => {

      /*
      console.log("New message received:", newMessage);
      const data = await insertMessage(newMessage, conversationId, userData);
      console.log("Message registered.");
      console.log(data);
      console.log('Message handler called');
      const messagesFromDB = await getAllMessages(userData, conversationId);
      console.log(messagesFromDB?.length);
      if(messagesFromDB) {
        setMessages(messagesFromDB!);
      }else{
        setMessages([]);
      }
       */
      console.log('Message handler called:', message);

      setMessages((current) => {
        if (find(current, { id: message.id })) {
          return current;
        }

        return [...current, message]
      });

      bottomRef?.current?.scrollIntoView();
    };

    const socket = io("https://localhost:3000");
    //socket.emit("joinRoom", conversationId);
    /*socket.on("message", (newMessage) => {

      console.log("New message received:", newMessage);
      insertMessage(newMessage, conversationId, userData);
      const formattedMessage: Message = {id: newMessage.id, content:newMessage.message, id_user: userData?.id!, id_group: Number(conversationId), created_at: newMessage.timestamp, send_at: newMessage.timestamp};
      console.log("Message registered.");
      console.log(formattedMessage);
      messageHandler(formattedMessage);
      // TODO Front-end : here, a message has just been received => display new MessageBox with newMessage
    });*/
    socket.on("receive_message", (message) => {
      console.log("receive_message event");
      messageHandler(message);
    });

    return () => {
      socket.disconnect();
    };
  }, [messages]);

  const [user, setUserData] = useState<User | null>(null);

  useEffect(() => {
      setUserData(userData);
  }, [userData]);

  return (
    <div className="flex-1 overflow-y-auto">
      {messages && messages.map((message, i) => (
        <MessageBox
          userMetadata={usersMetadata?.find(m => m.id === message.id_user)}
          user={user}
          isLast={i === messages.length - 1}
          key={message.id}
          data={message}
        />
      ))}
      <div className="pt-24" ref={bottomRef} />
    </div>
  );
}

export default Body;
