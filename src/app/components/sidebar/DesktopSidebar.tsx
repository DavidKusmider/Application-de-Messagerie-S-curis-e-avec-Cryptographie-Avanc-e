'use client';

import DesktopItem from "./DesktopItem";
import useRoutes from "@/app/hooks/useRoutes";
import { useContext, useEffect, useState } from "react";
import Avatar from "../Avatar";
import ConversationList from "@/app/conversations/components/ConversationList";
import { User } from "@supabase/supabase-js"
import { Group, User_Group, User_Relation, UserMetadata } from "@/types/databases.types"
import useConversation from "@/app/hooks/useConversation";
import { usePathname } from "next/navigation";
import FriendList from "@/app/friends/components/FriendList";
import { SocketContext } from "@/app/conversations/socketContext";

interface DesktopSidebarProps {
  currentUser: User | null;
  groups: Group[];
  friends: User_Relation[],
  usersMetadata: UserMetadata[],
  userGroupsData: User_Group[],
}

const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  currentUser,
  groups,
  friends,
  usersMetadata,
  userGroupsData
}) => {
  const routes = useRoutes();
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState<Group[]>([]);
  const [groupsTemp, setGroupsTemp] = useState<Group[]>(groups);
  const [userGroupsLink, setUserGroups] = useState(userGroupsData);
  const [relations, setRelations] = useState(friends);
  const [user, setUser] = useState<User | null>(currentUser);

  const { conversationId } = useConversation();
  const pathname = usePathname();
  let users: User[] = [];

  const userMeta = currentUser
    ? usersMetadata.find((userMetadata) => userMetadata.id === currentUser.id)
    : undefined;

  const socket = useContext(SocketContext);
  if (user) {
    users = [user];
  }

  socket.on("update_group", (newUserGroup: User_Group[], newGroups: Group[]) => {
    setGroupsTemp(newGroups);
    setUserGroups(newUserGroup);
  });

  useEffect(() => {
    const userGroups: Group[] = [];
    groupsTemp.forEach((g) => {
      const groupsFiltered = userGroupsLink.filter((m) => m.id_group === g.id);
      groupsFiltered.forEach((f) => {
        if (f.id_user === user?.id && !userGroups.includes(g)) {
          userGroups.push(g);
        }
      });
    });
    if (userGroups.length > 0) {
      setConversations(userGroups);
    }
  }, [groupsTemp, user?.id, userGroupsLink]);


  useEffect(() => {
    const userRelations = friends.filter((f) => f.id_user === user?.id);
    if (userRelations.length > 0) {
      setRelations(userRelations);
    }
  }, [friends, user]);
  //console.log("currentUser: ", {currentUser});

  return (
    <>
      {/* <SettingsModal currentUser={currentUser} isOpen={isOpen} onClose={() => setIsOpen(false)} /> */}
      <div className="
        hidden
        lg:fixed
        lg:inset-y-0
        lg:left-0
        lg:z-40
        lg:w-[25rem]
        xl:px-6
        lg:overflow-y-auto
        lg:pb-4
        lg:flex
        lg:flex-col
        justify-between
      ">
        <nav className="mt-4 flex flex-row justify-between">
          <div className="flex flex-row items-center space-y-1 space-x-10 m-auto">
            {routes.map((item) => (
              <DesktopItem
                key={item.label}
                href={item.href}
                label={item.label}
                icon={item.icon}
                active={item.active}
                onClick={item.onClick}
              />
            ))}
          </div>
        </nav>
        {(pathname === '/conversations' || !!conversationId) ? (
          <div className="absolute top-20 left-5">
            <div>
              <ConversationList
                users={users}
                title="Messages"
                initialItems={conversations}
                currentUser={currentUser}
                groups={groups}
                friends={friends}
                usersMetadata={usersMetadata}
                userGroupsData={userGroupsLink}
              // initialItems={[{ id: '1', name: 'Test', users: users, messages: [] }]}
              // initialItems={groupsTest}
              />
            </div>
          </div>
        ) : (pathname === '/friends') ? (
          <div className="absolute top-20 left-5">
            <div>
              <FriendList
                initialItems={relations}
                users={users}
                usersMetadata={usersMetadata}
                user={user}
                title="Friend"
              />
            </div>
          </div>
        ) : (pathname === '/notifications') ? (
          <div className="absolute top-20 left-5">
            <div className="text-2xl font-bold text-neutral-800">
              Notifications
            </div>
          </div>
        ) :
          (
            <div className="absolute top-20 left-5">
              <div>
                <ConversationList
                  users={users}
                  title="Messages"
                  initialItems={conversations}
                  currentUser={currentUser}
                  groups={groups}
                  friends={friends}
                  usersMetadata={usersMetadata}
                  userGroupsData={userGroupsLink}
                // initialItems={[{ id: '1', name: 'Test', users: users, messages: [] }]}
                // initialItems={groupsTest}
                />
              </div>
            </div>
          )
        }
        <div className="mt-4 flex flex-col justify-between items-center">
          <div
            onClick={() => setIsOpen(true)}
            className="cursor-pointer hover:opacity-75 transition"
          >
            <Avatar user={userMeta!} />

          </div>
        </div>
      </div>
    </>
  );
}
export default DesktopSidebar;
