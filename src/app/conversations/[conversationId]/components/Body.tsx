'use client';

import {useContext, useEffect, useRef, useState} from "react";

import MessageBox from "./MessageBox";
import {find} from "lodash";
import {User} from '@supabase/supabase-js';
import {Message, UserMetadata} from "@/types/databases.types"
import {SocketContext} from "@/app/conversations/socketContext";
import {decryptMessageContent} from "@/utils/cryptoUtils";
import {joinRoomSocket} from "@/app/conversations/[conversationId]/actions";

interface BodyProps {
  userData: User | null;
  initialMessages: any[];
  usersMetadata: UserMetadata[] | null;
  conversationId: string;
  privateKeyCookie: String | undefined;
}

const Body: React.FC<BodyProps> = ({ usersMetadata, userData, initialMessages, conversationId,  privateKeyCookie }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState(initialMessages);

  const socket = useContext(SocketContext);
  joinRoomSocket(conversationId, socket);

  // console.log("BODY messages : ", messages);
  // console.log("BODY private key : ", privateKeyCookie);

  useEffect(() => {
    console.log('useEffect triggered with messages:', messages);
    bottomRef?.current?.scrollIntoView();

    const messageHandler = (message: any) => {

      console.log('Message handler called:', message);

      setMessages((current) => {
        let newMess: any[] = [];
        current.forEach(c => {
          if (message.id_group == conversationId) {
            if (c.id == message.id) {
              newMess = current;
            }else {
              console.log("NEW MESSAGE");
              console.log(message);
              newMess = [...current, message];
              console.log(newMess);
            }
          } else {
            newMess = current;
          }
        });
        return newMess;
      });

      bottomRef?.current?.scrollIntoView();
    };

    socket.on("receive_message", (idUserEncryptedMessage) => {
      console.log("in receive_message");
      const mapTemp : Map<string,Message> = new Map(idUserEncryptedMessage);
      console.log(mapTemp);
      console.log("receive_message event");
      if(userData !== null) {
        const message = mapTemp.get(userData.id);
        console.log("Message extracted:");
        console.log(message);
        if (message !== undefined) {
          const tempMess = message;
          tempMess.content = decryptMessageContent(message.content, privateKeyCookie);
          messageHandler(tempMess);
        }
      }
    });

  }, []);

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
          privateKeyCookie={privateKeyCookie}
        />
      ))}
      <div className="pt-24" ref={bottomRef} />
    </div>
  );
}

export default Body;
