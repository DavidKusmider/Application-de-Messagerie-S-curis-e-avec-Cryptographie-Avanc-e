'use client';

import axios from "axios";
import { useEffect, useRef, useState } from "react";

import MessageBox from "./MessageBox";
import { FullMessageType } from "@/app/types";
import { find } from "lodash";
import useConversation from "@/app/hooks/useConversation";
import {User} from '@supabase/supabase-js';
import {getAuthUser} from "@/app/conversations/actions";

interface BodyProps {
  userData : User | null;
  initialMessages: any[];
}

// @ts-ignore
const Body: React.FC<BodyProps> = ({userData, initialMessages }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState(initialMessages); // TODO initialMessages should contain all previous messages from DB.

  const { conversationId } = useConversation();

  useEffect(() => {
    console.log('useEffect triggered with messages:', messages);
    bottomRef?.current?.scrollIntoView();

    const messageHandler = (message: any) => {
      console.log('Message handler called:', message);

      setMessages((current) => {
        if (find(current, { id: message.id })) {
          return current;
        }

        return [...current, message]
      });
      
      bottomRef?.current?.scrollIntoView();
    };

    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages((current) => current.map((currentMessage) => {
        if (currentMessage.id === newMessage.id) {
          return newMessage;
        }
  
        return currentMessage;
      }))
    };

    return () => {
    }
  }, [conversationId, messages]);

  const [user, setUserData] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const userData = await getAuthUser();
      setUserData(userData.user);
    };
    fetchData();
  }, []);

  return ( 
    <div className="flex-1 overflow-y-auto">
      {messages.map((message, i) => (
        <MessageBox 
          user = {user}
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