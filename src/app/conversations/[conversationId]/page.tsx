'use client';

import Header from "./components/Header";
import Body from "./components/Body";
import Form from "./components/Form";
import EmptyState from "@/app/components/EmptyState";

import {getAllMessages, getAuthUser, getUsersMetadata} from "../actions"
import {UserMetadata} from "@/types/databases.types";
import { useEffect, useState } from "react";

interface IParams {
  conversationId: string;
}

const ChatId = ({ params }: { params: IParams }) => {
  const [data, setData] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [usersMetadata, setUsersMetadata] = useState<UserMetadata[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const userData = await getAuthUser();
      setData(userData);

      const fetchedMessages = await getAllMessages(userData.user, params.conversationId);
      setMessages(fetchedMessages || []);

      const fetchedUsersMetadata = await getUsersMetadata();
      setUsersMetadata(fetchedUsersMetadata);
    };

    fetchData();

    return () => {
    };
  }, [params.conversationId]);

  //console.log(messages);
  const user1 = {id: '1', name: 'Test1', image: undefined, email: 'test1@gmail.com', createdAt: new Date(Date.now())};
  //const messages = [{id: '0', createdAt: new Date(Date.now()), image: undefined, content: 'Ceci est un message', sender: user1, seen: []}];//await getMessages(params.conversationId);
  //console.log(messages);
  const conversation = {id: '0', name:'Test', users : [user1], messages: messages};//await getConversationById(params.conversationId);

  if (!conversation) {
    return (
      <div className="lg:pl-80 h-full">
        <div className="h-full flex flex-col">
          <EmptyState />
        </div>
      </div>
    )
  }

  return (
    <div className="lg:pl-80 h-full">
      <div className="h-full flex flex-col">
        <Header conversation={conversation} />
        <Body usersMetadata={usersMetadata} userData={data.user} initialMessages={messages!}/>
        <Form />
      </div>
    </div>
  );
}

export default ChatId;