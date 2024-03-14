'use client';

import DesktopItem from "./DesktopItem";
import useRoutes from "@/app/hooks/useRoutes";
import SettingsModal from "./SettingsModal";
import { useState, useEffect, useMemo } from "react";
import Avatar from "../Avatar";
import useActif from "@/app/hooks/useActif";
import ConversationList from "@/app/conversations/components/ConversationList";
import { getAllMessages, getAuthUser, getGroupsUser } from "../../conversations/actions"
import { User } from "@supabase/supabase-js"
import { Message, Group, User_Group } from "@/types/databases.types"

interface DesktopSidebarProps {
  currentUser: User;
  groups: Group[];
}

const DesktopSidebar: React.FC<DesktopSidebarProps> = ({ currentUser, groups }) => {
  const routes = useRoutes();
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState(groups);
  const [user, setUser] = useState<any>(null);

  const users = [currentUser];
  const groupsTest = [{ id: '0', created_at: '2024/03/12', group_name: 'Test0', id_user_creator: 'davidIdUserCreator' }];
  const notifications = [{ id: '0', msg: 'Test0' }, { id: '1', msg: 'Test1' }];

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await getAuthUser();
        setUser(data!);
        const userGroups = await getGroupsUser(data.user);
        if (userGroups) {
          console.log("userGroups value : ", userGroups);
          setConversations(userGroups);
        }
      } catch (error) {
        console.error('Error fetching user groups:', error);
      }
    };

    console.log("conversations before fetchGroups() : ", conversations);
    fetchGroups();
    console.log("conversations AFTER fetchGroups() : ", conversations);
  }, [currentUser, user]);

  const actif = useActif().actif;

  console.log("currentUser: ", { currentUser });

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
        {actif === "groups" ? (
          <div className="absolute top-20 left-5">
            <div>
              <ConversationList
                users={users}
                title="Messages"
                initialItems={conversations}
              // initialItems={[{ id: '1', name: 'Test', users: users, messages: [] }]}
              // initialItems={groupsTest}
              />
            </div>
          </div>
        ) : (<></>)}
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
