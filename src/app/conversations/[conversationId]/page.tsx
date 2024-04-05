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
import { UserMetadata, Group, Message, User_Group } from "@/types/databases.types";
import { cookies } from "next/headers";
import { decryptMessageContent } from "@/utils/cryptoUtils";

interface IParams {
  conversationId: string;
}

export default async function ChatId({ params }: { params: IParams }) {

  /*
  CHeck si conversationId valide:
  1. Recup tous les relations entre user et group pour un user
  2. Verifie si conversationId correspond à un des groups, tu autorise la redirection
  3. Sinon, redirige sur /conversations/
   */

  const data = await getAuthUser();
  const userGroupData: User_Group[] = await getUserGroupFromIdGroup(params.conversationId);
  const groupData: Group[] = await getGroupFromIdGroup(params.conversationId);
  const messages: Message[] = await getAllMessages(data.user, params.conversationId);
  const messagesBis: Message[] = await getAllMessagesBis(params.conversationId);
  const usersMetadata: UserMetadata[] = await getUsersMetadata();
  const privateKeyCookie = cookies().get('privateKey')?.value;

  let messBis: Message[] = [];

  messagesBis.forEach(b => {
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

  return (
    <div className="lg:pl-80 h-full">
      <div className="h-full flex flex-col">
        <Header name={groupData[0].group_name} userGroupData={userGroupData} />
        <Body usersMetadata={usersMetadata!} userData={data.user} initialMessages={messBis} conversationId={params?.conversationId} privateKeyCookie={privateKeyCookie} />
        <Form user={data.user} usersMetadata={usersMetadata} userGroupData={userGroupData} privateKeyCookie={privateKeyCookie} />
      </div>
    </div>
  );
}
