'use client';

import { useContext, useEffect, useRef, useState } from "react";

import MessageBox from "./MessageBox";
import { User } from '@supabase/supabase-js';
import { Message, UserMetadata } from "@/types/databases.types"
import { SocketContext } from "@/app/conversations/socketContext";
import { decryptMessageContent } from "@/utils/cryptoUtils";
import { joinRoomSocket } from "@/app/conversations/[conversationId]/actions";

interface BodyProps {
  userData: User | null;
  initialMessages: any[];
  usersMetadata: UserMetadata[];
  conversationId: string;
  privateKeyCookie: String | undefined;
}

const Body: React.FC<BodyProps> = ({ usersMetadata, userData, initialMessages, conversationId, privateKeyCookie }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<any[]>(initialMessages);
  //setMessages(initialMessages);
  const socket = useContext(SocketContext);
  joinRoomSocket(conversationId, socket);
  console.log(messages);


  useEffect(() => {
    console.log('useEffect triggered with messages:', messages);
    bottomRef?.current?.scrollIntoView();
    const messageHandler = (message: any) => {
      console.log('Message handler called:', message);
      setMessages(currentMessages => [...currentMessages, message]);
      bottomRef?.current?.scrollIntoView();
    };

    socket.on("receive_message", (idUserEncryptedMessage) => {
      console.log("in receive_message", idUserEncryptedMessage);
      const mapTemp: Map<string, Message> = new Map(idUserEncryptedMessage);
      console.log("receive_message event");
      if (userData !== null) {
        const message = mapTemp.get(userData.id);
        if (message !== undefined) {
          const tempMess = message;
          try {
            tempMess.content = decryptMessageContent(message.content, privateKeyCookie);
            messageHandler(tempMess);
          } catch (e) {
            //console.error(e);
          }
        }
      }
    });
    return () => {
      socket.off("receive_message");
    }
  }, []);

  const [user, setUserData] = useState<User | null>(userData);

  useEffect(() => {
    setUserData(userData);
  }, [userData]);

  return (
    <div className="flex-1 overflow-y-auto">
      {messages && messages.map((message, i) => (
        <MessageBox
          userMetadata={usersMetadata.find((m: UserMetadata) => m.id === message.id_user)!}
          user={user}
          isLast={i === messages.length - 1}
          key={message.id}
          data={message}
          privateKeyCookie={privateKeyCookie}
        />
      ))}
      <div className="pt-24" ref={bottomRef} />
    </div>
  );
}

export default Body;
