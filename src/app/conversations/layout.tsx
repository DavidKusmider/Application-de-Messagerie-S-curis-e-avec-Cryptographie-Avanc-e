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
  return (
    <Sidebar>
      <div className="h-full">
        {children}
      </div>
    </Sidebar>
  );
}
