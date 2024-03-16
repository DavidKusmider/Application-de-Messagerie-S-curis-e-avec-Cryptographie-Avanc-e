'use client';

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MdOutlineGroupAdd } from 'react-icons/md';
import clsx from "clsx";
import { find, uniq } from 'lodash';

import useConversation from "@/app/hooks/useConversation";
import FriendModal from "@/app/components/modals/FriendModal";
import FriendBox from "./FriendBox";
import { FullConversationType } from "@/app/types";
import { User } from "@supabase/supabase-js";
import { User_Relation } from "@/types/databases.types";

interface FriendListProps {
  initialItems: User_Relation[];
  users: User[];
  user: User;
  title?: string;
}

const FriendList: React.FC<FriendListProps> = ({
  initialItems,
  users,
  user
}) => {
  const [items, setItems] = useState(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log('Test : ',initialItems);
  const router = useRouter();
  
  const { conversationId, isOpen } = useConversation();

  const pusherKey = useMemo(() => {
    return 'test@gmail.com'//user?.email
  }, ['test@gmail.com'/*user?.email*/])

  useEffect(() => {
    //setItems([{id_user : '1', id_other_user : '2',created_at : ''+Date.now(),state_relation : 3}])
    console.log('Les items sont : ',items);
    setItems(initialItems);
    //pusherClient.subscribe(pusherKey);

    //const updateHandler = (conversation: FullConversationType) => {
    //  setItems((current) => current.map((currentConversation) => {
    //    if (currentConversation.id === conversation.id) {
    //      return {
    //        ...currentConversation,
    //        messages: conversation.messages
    //      };
    //    }
    //
    //    return currentConversation;
    //  }));
    //}
    //
    //const newHandler = (conversation: FullConversationType) => {
    //  setItems((current) => {
    //    if (find(current, { id: conversation.id })) {
    //      return current;
    //    }
    //
    //    return [conversation, ...current]
    //  });
    //}

    //const removeHandler = (conversation: FullConversationType) => {
    //  setItems((current) => {
    //    return [...current.filter((convo) => convo.id !== conversation.id)]
    //  });
    //}

    //pusherClient.bind('conversation:update', updateHandler)
    //pusherClient.bind('conversation:new', newHandler)
    //pusherClient.bind('conversation:remove', removeHandler)
  }, [initialItems]);

  return (
    <>
      <FriendModal 
        users={users} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
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
                key={item.id_user}
                data={item}
                user={user}
                //selected={conversationId === item.id}
              />
            ))) : null}
          </div>
        </div>
      </aside>
    </>
   );
}
 
export default FriendList;
