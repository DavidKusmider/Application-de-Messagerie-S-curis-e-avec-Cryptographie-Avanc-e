'use client';

import DesktopItem from "./DesktopItem";
import useRoutes from "@/app/hooks/useRoutes";
import SettingsModal from "./SettingsModal";
import {useEffect, useState} from "react";
import Avatar from "../Avatar";
import ConversationList from "@/app/conversations/components/ConversationList";
import {User} from "@supabase/supabase-js"
import {Group, User_Group, User_Relation, UserMetadata} from "@/types/databases.types"
import useConversation from "@/app/hooks/useConversation";
import {usePathname} from "next/navigation";
import FriendList from "@/app/friends/components/FriendList";

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
    const [relations, setRelations] = useState(friends);
    const [user, setUser] = useState<User | null>(currentUser);

    const {conversationId} = useConversation();
    const pathname = usePathname();
    let users: User[] = [];

    if (user) {
        users = [user];
    }

    //console.log("conversations before fetchGroups() : ", conversations);

    /*try {
        let userGroups: Group[] = [];
        groups.forEach((g) => {
            userGroupsData.forEach((m) => {
                if (m.id_user === user?.id && !userGroups.includes(g)) {
                    userGroups.push(g);
                }
            })
        }) //await getGroupsUserByUserId(data.user);
        console.log(userGroups);
        if (userGroups) {
            console.log("userGroups value : ", userGroups);
            setConversations(userGroups);
        }
    } catch (error) {
        console.error('Error fetching user groups:', error);
    }
    console.log("conversations AFTER fetchGroups() : ", conversations);*/
    useEffect(() => {
        const userGroups: Group[] = [];
        groups.forEach((g) => {
            const groupsFiltered = userGroupsData.filter((m) => m.id_group === g.id);
            groupsFiltered.forEach((f) => {
                if(f.id_user === user?.id && !userGroups.includes(g)){
                    userGroups.push(g);
                }
            })
        });
        if (userGroups.length > 0) {
            setConversations(userGroups);
        }
    }, [groups, user?.id, userGroupsData]);

    /*console.log("relations before fetchRelations() : ", relations);
    try {
        //setUser(user);
        const userRelations = friends.filter((f) => f.id_user === user?.id); //await getRelationsUser(data.user);
        if (userRelations) {
            console.log("userRelations value : ", userRelations);
            setRelations(userRelations);
        }
    } catch (error) {
        console.error('Error fetching user relations:', error);
    }
    console.log("relations AFTER fetchRelations() : ", relations);*/

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
                userGroupsData={userGroupsData}
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
                userGroupsData={userGroupsData}
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
            {/*<Avatar user={currentUser} />*/}
          </div>
        </div>
      </div>
    </>
  );
}
export default DesktopSidebar;