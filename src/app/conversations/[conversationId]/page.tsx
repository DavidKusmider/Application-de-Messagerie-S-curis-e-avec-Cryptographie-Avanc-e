import Header from "./components/Header";
import Body from "./components/Body";
import Form from "./components/Form";
import EmptyState from "@/app/components/EmptyState";

import { getAllMessages, getAuthUser, getGroupFromIdGroup, getUserGroupFromIdGroup, getUsersMetadata } from "../actions"
import { UserMetadata } from "@/types/databases.types";
import { io } from "socket.io-client";
import { joinRoomSocket } from "@/app/conversations/[conversationId]/actions";
import { cookies } from "next/headers";

interface IParams {
  conversationId: string;
}

export default async function ChatId({ params }: { params: IParams }) {
  const socket = io("https://localhost:3000");
  joinRoomSocket(params?.conversationId, socket);

  const data = await getAuthUser();
  const userGroupData = await getUserGroupFromIdGroup(params.conversationId);
  const groupData = await getGroupFromIdGroup(params.conversationId);
  const messages = await getAllMessages(data.user, params.conversationId);
  const usersMetadata: UserMetadata[] | null = await getUsersMetadata();
  const privateKeyCookie = cookies().get('privateKey').value;

  console.log("PRIVATE KEY", privateKeyCookie);

  if (!groupData) {
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
        <Header name={groupData[0].group_name} userGroupData={userGroupData} />
        <Body usersMetadata={usersMetadata} userData={data.user} initialMessages={messages!} privateKeyCookie={privateKeyCookie} />
        <Form user={data.user} usersMetadata={usersMetadata} userGroupData={userGroupData} />
      </div>
    </div>
  );
}
