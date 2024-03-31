import Header from "./components/Header";
import Body from "./components/Body";
import Form from "./components/Form";
import EmptyState from "@/app/components/EmptyState";

import {
  getAllMessages,
  getAllMessagesBis,
  getAuthUser,
  getGroupFromIdGroup,
  getUserGroupFromIdGroup,
  getUsersMetadata
} from "../actions"
import { UserMetadata,Group, Message, User_Group } from "@/types/databases.types";
import { io } from "socket.io-client";
import { joinRoomSocket } from "@/app/conversations/[conversationId]/actions";
import { cookies } from "next/headers";
import {decryptMessageContent} from "@/utils/cryptoUtils";

interface IParams {
  conversationId: string;
}

export default async function ChatId({ params }: { params: IParams }) {
  const socket = io("https://localhost:3000");
  joinRoomSocket(params?.conversationId, socket);

  const data = await getAuthUser();
  const userGroupData : User_Group[] = await getUserGroupFromIdGroup(params.conversationId);
  const groupData : Group[] = await getGroupFromIdGroup(params.conversationId);
  const messages : Message[] = await getAllMessages(data.user, params.conversationId);
  const messagesBis: Message[] = await getAllMessagesBis(params.conversationId);
  const usersMetadata: UserMetadata[] | null = await getUsersMetadata();
  const privateKeyCookie = cookies().get('privateKey')?.value;

  let messBis: Message[] = [];

  messagesBis.forEach(b => {
    const mapTemp = new Map(JSON.parse(b.content));
    console.log(mapTemp);
    mapTemp.forEach((value, key, map) => {
      if(key === data.user?.id){
          const decryptedMess = decryptMessageContent(value.content, privateKeyCookie);
          value.content = decryptedMess
          messBis.push(value);
      }
    });
  });
  console.log(messBis);

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
        <Body usersMetadata={usersMetadata} userData={data.user} initialMessages={messBis} conversationId={params?.conversationId} privateKeyCookie={privateKeyCookie} />
        <Form user={data.user} usersMetadata={usersMetadata} userGroupData={userGroupData} privateKeyCookie={privateKeyCookie} />
      </div>
    </div>
  );
}
