import Sidebar from "../components/sidebar/Sidebar";
import {
    getAllGroups,
    getAllUserGroup, getAllUserRelation,
    getAuthUser,
    getRelationsUser,
    getUsersMetadata
} from "@/app/conversations/actions";
import {UserMetadata, Group, User_Group, User_Relation} from "@/types/databases.types";

export default async function ConversationsLayout({
  children
}: {
  children: React.ReactNode,
}) {
    const data = await getAuthUser();
    const groups = await getAllGroups();
    const userGroups = await getAllUserGroup();
    const userRelations = await getAllUserRelation();
    const usersMetadata = await getUsersMetadata();
  return (
    <Sidebar user={data.user} groups={groups} userGroups={userGroups} userRelations={userRelations} userMetadata={usersMetadata}>
      <div className="h-full">
        {children}
      </div>
    </Sidebar>
  );
}
