import * as router from "next/navigation";
import Sidebar from "../components/sidebar/Sidebar";
import {
  getAllGroups,
  getAllUserGroup,
  getAllUserRelation,
  getAuthUser,
  getUsersMetadata
} from "@/app/conversations/actions";

export default async function ConversationsLayout({
  children
}: {
  children: React.ReactNode,
}) {

  const data = await getAuthUser();

  if (data.user === null) {
    router.redirect("/");
  }

  const groups = await getAllGroups();
  const userGroups = await getAllUserGroup();
  const userRelations = await getAllUserRelation();
  const usersMetadata = await getUsersMetadata();



  return (
    <Sidebar user={data.user} groups={groups} userGroups={userGroups} userRelations={userRelations}
      userMetadata={usersMetadata}>
      <div className="h-full">
        {children}
      </div>
    </Sidebar>
  );
}
