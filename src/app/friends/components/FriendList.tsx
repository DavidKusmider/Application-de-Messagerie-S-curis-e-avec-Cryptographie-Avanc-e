'use client';

import { useEffect, useState } from "react";
import { MdOutlineGroupAdd } from 'react-icons/md';
import clsx from "clsx";
import FriendModal from "@/app/components/modals/FriendModal";
import FriendBox from "./FriendBox";
import { User } from "@supabase/supabase-js";
import {User_Relation, UserMetadata} from "@/types/databases.types";

interface FriendListProps {
  initialItems: User_Relation[];
  usersMetadata: UserMetadata[],
  users: User[];
  user: User | null;
  title?: string;
}

const FriendList: React.FC<FriendListProps> = ({
  initialItems,
  users,
  user, 
  usersMetadata,
}) => {
  const [items, setItems] = useState(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isOpen = false;

  const handleAddFriend = (idsRelation: any) => {
    const newFriend = {id_user : idsRelation.id1, id_other_user : idsRelation.id2, state_relation : 0, created_at : ''+Date.now()};
    setItems(prevFriends => [...prevFriends, newFriend]);
  }

  const handleRemoveFriend = (idsRelation: any) => {
    const temp = items.filter(it => {return !((it.id_user === idsRelation.id1 && it.id_other_user === idsRelation.id2) ||
      (it.id_user === idsRelation.id2 && it.id_other_user === idsRelation.id1))})
    setItems(temp);
  }


  useEffect(() => {
    setItems(initialItems);
  }, []);

  return (
    <>
      <FriendModal 
        users={users} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddFriend}
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
        border-r
        border-gray-200
        max-h-[80%]
      `, isOpen ? 'hidden' : 'block w-full left-0')}>
        <div className="px-5 h-[100%]">
          <div className="flex justify-between mb-4 pt-4">
            <div className="text-2xl font-bold text-neutral-800">
              Friends
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
          <div className="
            overflow-y-auto
            max-h-[95%]
            "
          >
            {items ? (
            items.map((item) => (
              <FriendBox
                key={(user?.id === item.id_user ? item.id_other_user : item.id_user)}
                data={item}
                usersMetadata={usersMetadata}
                user={user}
                onRemove={handleRemoveFriend}
              />
            ))) : null}
          </div>
        </div>
      </aside>
    </>
   );
}
 
export default FriendList;
