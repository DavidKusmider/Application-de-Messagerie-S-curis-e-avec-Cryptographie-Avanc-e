import Sidebar from "../components/sidebar/Sidebar";
import {
    getAllGroups,
    getAllUserGroup,
    getAuthUser,
    getRelationsUser,
    getUsersMetadata
} from "@/app/conversations/actions";
import React from "react";

export default async function FriendsLayout({
  children
}: {
  children: React.ReactNode,
}) {
    const data = await getAuthUser();
    const groups = await getAllGroups();
    const userGroups = await getAllUserGroup();
    const userRelations = await getRelationsUser(data.user);
    const usersMetadata = await getUsersMetadata();
  return (
    <Sidebar user={data.user} groups={groups} userGroups={userGroups} userRelations={userRelations} userMetadata={usersMetadata}>
      <div className="h-full">
        {children}
      </div>
    </Sidebar>
  );
}
