'use client';

import DesktopItem from "./DesktopItem";
import useRoutes from "@/app/hooks/useRoutes";
import SettingsModal from "./SettingsModal";
import { useState } from "react";
import Avatar from "../Avatar";
import { User } from "@/app/types";
import useActif from "@/app/hooks/useActif";
import ConversationList from "@/app/conversations/components/ConversationList";

interface DesktopSidebarProps {
  currentUser: User
}

const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  currentUser
}) => {
  const routes = useRoutes();
  const [isOpen, setIsOpen] = useState(false);

  //const users = //await getUsers();
  const users = [{id: '0', name: 'Test0', image: undefined, email: 'test@gmail.com', createdAt: new Date(Date.now())},
                {id: '1', name: 'Test1', image: undefined, email: 'test1@gmail.com', createdAt: new Date(Date.now())},
                {id: '0', name: 'Test0', image: undefined, email: 'test@gmail.com', createdAt: new Date(Date.now())},
                {id: '0', name: 'Test0', image: undefined, email: 'test@gmail.com', createdAt: new Date(Date.now())},
                {id: '0', name: 'Test0', image: undefined, email: 'test@gmail.com', createdAt: new Date(Date.now())},
                {id: '0', name: 'Test0', image: undefined, email: 'test@gmail.com', createdAt: new Date(Date.now())},
                {id: '0', name: 'Test0', image: undefined, email: 'test@gmail.com', createdAt: new Date(Date.now())},
                {id: '0', name: 'Test0', image: undefined, email: 'test@gmail.com', createdAt: new Date(Date.now())},
                {id: '0', name: 'Test0', image: undefined, email: 'test@gmail.com', createdAt: new Date(Date.now())},
                {id: '0', name: 'Test0', image: undefined, email: 'test@gmail.com', createdAt: new Date(Date.now())},
                {id: '0', name: 'Test0', image: undefined, email: 'test@gmail.com', createdAt: new Date(Date.now())},
              ];
  const groups = [{id: '0', name: 'Test0'},{id: '1', name: 'Test1'}];
  const notifications = [{id: '0', msg: 'Test0'},{id: '1', msg: 'Test1'}];
  const conversations = [{id: '1', name: 'Test', users: users, messages: []},
                        {id: '2', name: 'Test2', users: users, messages: []},
                        {id: '3', name: 'Test', users: users, messages: []},
                        {id: '4', name: 'Test', users: users, messages: []},
                        {id: '5', name: 'Test', users: users, messages: []},
                        {id: '6', name: 'Test', users: users, messages: []},
                        {id: '7', name: 'Test', users: users, messages: []},
                        {id: '8', name: 'Test', users: users, messages: []},
                        {id: '9', name: 'Test', users: users, messages: []},
                        {id: '10', name: 'Test', users: users, messages: []},
                        {id: '11', name: 'Test', users: users, messages: []},
                        {id: '12', name: 'Test', users: users, messages: []}];//await getConversations();
  const actif = useActif().actif;
  
  console.log("currentUser: ", {currentUser});

  return (
    <>
      <SettingsModal currentUser={currentUser} isOpen={isOpen} onClose={() => setIsOpen(false)} />
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
        {actif==="groups" ? (
          <div className="absolute top-20 left-5">
            <div>
              <ConversationList
                users={users}
                title="Messages"
                initialItems={conversations}
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