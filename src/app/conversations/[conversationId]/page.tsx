import Header from "./components/Header";
import Body from "./components/Body";
import Form from "./components/Form";
import EmptyState from "@/app/components/EmptyState";

import {getAllMessages, getAuthUser, getUsersMetadata, insertMessage} from "../actions"
import {Message, UserMetadata} from "@/types/databases.types";
import {io} from "socket.io-client";
import {joinRoomSocket, saveMessageEvent} from "@/app/conversations/[conversationId]/actions";

interface IParams {
  conversationId: string;
}

export default async function ChatId ({ params }: { params: IParams }) {
    const socket = io("http://localhost:3001");
    joinRoomSocket(params?.conversationId, socket);
    //saveMessageEvent();

  const data = await getAuthUser();

  const messages = await getAllMessages(data.user, params.conversationId);
  const usersMetadata : UserMetadata[] | null = await getUsersMetadata();
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