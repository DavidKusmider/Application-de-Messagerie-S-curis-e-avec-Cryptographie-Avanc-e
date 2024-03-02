'use client';

import Sidebar from "../components/sidebar/Sidebar";
import useActif from "../hooks/useActif";
import ConversationList from "./components/ConversationList";
import Lists from "./components/Lists";

export default async function ConversationsLayout({
  children
}: {
  children: React.ReactNode,
}) {
  //const users = //await getUsers();
  const users = [{id: '0', name: 'Test0', image: undefined, email: 'test@gmail.com', createdAt: new Date(Date.now())},
                  {id: '1', name: 'Test1', image: undefined, email: 'test1@gmail.com', createdAt: new Date(Date.now())}];
  const groups = [{id: '0', name: 'Test0'},{id: '1', name: 'Test1'}];
  const notifications = [{id: '0', msg: 'Test0'},{id: '1', msg: 'Test1'}];
  const conversations = [{id: '1', name: 'Test', users: users, messages: []},{id: '2', name: 'Test2', users: users, messages: []}];//await getConversations();
  const actif = useActif().actif;
  return (
    <Sidebar>
      <div className="h-full">
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
        {children}
      </div>
    </Sidebar>
  );
}
