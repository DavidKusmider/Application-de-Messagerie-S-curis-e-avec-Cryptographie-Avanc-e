'use client';

import { useEffect, useState } from "react";
import { MdOutlineGroupAdd } from 'react-icons/md';
import clsx from "clsx";

import useConversation from "@/app/hooks/useConversation";
import GroupChatModal from "@/app/components/modals/GroupChatModal";
import ConversationBox from "./ConversationBox";
import { User } from "@supabase/supabase-js";
import { Group, User_Group, User_Relation, UserMetadata } from "@/types/databases.types";


interface ConversationListProps {
  initialItems: any[];
  users: User[];
  title?: string;
  currentUser: User | null;
  groups: Group[];
  friends: User_Relation[],
  usersMetadata: UserMetadata[],
  userGroupsData: User_Group[],
}

const ConversationList: React.FC<ConversationListProps> = ({
  initialItems,
  users,
  currentUser,
  groups,
  friends,
  usersMetadata,
  userGroupsData
}) => {
  const [items, setItems] = useState(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [usersM, setUsersM] = useState<UserMetadata[]>([]);

  const { conversationId, isOpen } = useConversation();

  useEffect(() => {

    setItems(initialItems);
  }, [initialItems]);

  const closeModal = () => {
    setIsModalOpen(false)
  }
  return (
    <>
      <GroupChatModal
        isOpen={isModalOpen}
        onClose={closeModal}
        currentUser={currentUser}
        groups={groups}
        friends={friends}
        usersMetadata={usersMetadata}
        userGroupsData={userGroupsData}
      />
      <aside className={clsx(`
        fixed 
        inset-y-0 
        pb-20
        lg:pb-0
        lg:left-0
        lg:top-16 
        lg:w-[25rem] 
        lg:block
        overflow-y-auto 
        border-r 
        border-gray-200 
        max-h-[80%]
      `, isOpen ? 'hidden' : 'block w-full left-0')}>
        <div className="px-5">
          <div className="flex justify-between mb-4 pt-4">
            <div className="text-2xl font-bold text-neutral-800">
              Groups
            </div>
            <div
              onClick={() => setIsModalOpen(true)}
              className="
                rounded-full 
                p-2 
                bg-gray-100 
                text-gray-600 
                cursor-pointer 
                hover:opacity-75 
                transition
              "
            >
              <MdOutlineGroupAdd size={20} />
            </div>
          </div>
          {items.map((item) => {
            const groupUsers = userGroupsData
              .filter((userGroup) => userGroup.id_group === item.id)
              .map((userGroup) => userGroup.id_user);

            const groupUsersMetadata: UserMetadata[] = usersMetadata.filter((userMetadata) =>
              groupUsers.includes(userMetadata.id)
            );

            return (
              <ConversationBox
                name={item.group_name}
                key={item.id}
                data={item}
                selected={conversationId === item.id}
                usersM={groupUsersMetadata}
              />
            );
          })}
        </div>
      </aside>
    </>
  );
}

export default ConversationList;
