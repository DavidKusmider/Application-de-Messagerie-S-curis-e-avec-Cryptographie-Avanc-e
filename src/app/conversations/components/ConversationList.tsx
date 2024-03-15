'use client';

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { MdOutlineGroupAdd } from 'react-icons/md';
import clsx from "clsx";
import { find, uniq } from 'lodash';

import useConversation from "@/app/hooks/useConversation";
import GroupChatModal from "@/app/components/modals/GroupChatModal";
import ConversationBox from "./ConversationBox";
import { User } from "@supabase/supabase-js";

interface ConversationListProps {
  initialItems: any[];
  users: User[];
  title?: string;
}

const ConversationList: React.FC<ConversationListProps> = ({
  initialItems,
  users
}) => {
  const [items, setItems] = useState(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();
  //const session = useSession();

  const { conversationId, isOpen } = useConversation();

  const pusherKey = useMemo(() => {
    return 'test@gmail.com'//session.data?.user?.email
  }, ['test@gmail.com'/*session.data?.user?.email*/])

  useEffect(() => {
    const groupsTest = [{ id: '1', name: 'Test', users: users, messages: [] }];
    console.log("ConversationList : ", initialItems);
    setItems(initialItems);


    //pusherClient.subscribe(pusherKey);

    // const updateHandler = (conversation: FullConversationType) => {
    //   setItems((current) => current.map((currentConversation) => {
    //     if (currentConversation.id === conversation.id) {
    //       return {
    //         ...currentConversation,
    //         messages: conversation.messages
    //       };
    //     }
    //
    //     return currentConversation;
    //   }));
    // }
    //
    // const newHandler = (conversation: FullConversationType) => {
    //   setItems((current) => {
    //     if (find(current, { id: conversation.id })) {
    //       return current;
    //     }
    //
    //     return [conversation, ...current]
    //   });
    // }
    //
    // const removeHandler = (conversation: FullConversationType) => {
    //   setItems((current) => {
    //     return [...current.filter((convo) => convo.id !== conversation.id)]
    //   });
    // }

    //pusherClient.bind('conversation:update', updateHandler)
    //pusherClient.bind('conversation:new', newHandler)
    //pusherClient.bind('conversation:remove', removeHandler)
  }, [initialItems]);

  return (
    <>
      <GroupChatModal
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
          {items ? (
            items.map((item) => (
              <ConversationBox
                key={item.id}
                data={item}
                selected={conversationId === item.id}
              />
            ))
          ) : null}
        </div>
      </aside>
    </>
  );
}

export default ConversationList;
