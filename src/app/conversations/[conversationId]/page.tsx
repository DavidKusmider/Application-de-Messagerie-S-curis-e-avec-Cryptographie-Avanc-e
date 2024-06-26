import Header from "./components/Header";
import Body from "./components/Body";
import Form from "./components/Form";
import EmptyState from "@/app/components/EmptyState";
import * as router from "next/navigation"

import {
  getAllMessages,
  getAllMessagesBis,
  getAuthUser,
  getGroupFromIdGroup,
  getUserGroupFromIdGroup,
  getUsersMetadata
} from "../actions"
import { UserMetadata, Group, Message, User_Group } from "@/types/databases.types";
import { cookies } from "next/headers";
import { decryptMessageContent } from "@/utils/cryptoUtils";
import { redirect } from 'next/navigation';

interface IParams {
  conversationId: string;
}

export default async function ChatId({ params }: { params: IParams }) {

  const data = await getAuthUser();
  const userGroupData: User_Group[] = await getUserGroupFromIdGroup(params.conversationId);
  const groupData: Group[] = await getGroupFromIdGroup(params.conversationId, data.user?.id!);
  const messages: Message[] = await getAllMessages(data.user, params.conversationId);
  const usersMetadata: UserMetadata[] = await getUsersMetadata();
  const privateKeyCookie = cookies().get('privateKey')?.value;

  let messBis: Message[] = [];

  messages.forEach(b => {
    const mapTemp = new Map(JSON.parse(b.content));
    //console.log(mapTemp);
    mapTemp.forEach((value, key, map) => {
      if (key === data.user?.id) {
        try {
          // @ts-ignore
          const decryptedMess = decryptMessageContent(value.content, privateKeyCookie);
          // @ts-ignore
          value.content = decryptedMess
          // @ts-ignore
          messBis.push(value);
        } catch (e) {
          //console.error(e);
        }
      }
    });
  });
  //console.log(messBis);

  if (!groupData) {
    return (
      <div className="lg:pl-80 h-full">
        <div className="h-full flex flex-col">
          <EmptyState />
        </div>
      </div>
    )
  }

  if (groupData[0] === undefined) {
    redirect("/conversations");
  }

  return (
    <div className="lg:pl-80 h-full">
      <div className="h-full flex flex-col">
        <Header name={groupData[0].group_name} userGroupData={userGroupData} />
        <Body usersMetadata={usersMetadata!} userData={data.user} initialMessages={messBis} conversationId={params?.conversationId} privateKeyCookie={privateKeyCookie} />
        <Form user={data.user} usersMetadata={usersMetadata} userGroupData={userGroupData} />
      </div>
    </div>
  );
}
