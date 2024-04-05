'use client';

import clsx from "clsx";
import { User } from '@supabase/supabase-js'
import { Message, UserMetadata } from "@/types/databases.types";
import Avatar from "@/app/components/Avatar";
import { useEffect, useState } from "react";
//import { decryptMessageContent } from "@/utils/cryptoUtils";

interface MessageBoxProps {
  userMetadata: UserMetadata;
  user: User | null;
  data: Message;
  isLast?: boolean;
  privateKeyCookie: String | undefined;
}

const MessageBox: React.FC<MessageBoxProps> = ({ userMetadata, user, data, isLast, privateKeyCookie }) => {
  const conversationId = "1";// useConversation();
  const [privateKey, setPrivateKey] = useState(privateKeyCookie);
  const isOwn = user?.id === data.id_user;
  const [decryptedContent, setDecryptedContent] = useState<String | null>();

  const container = clsx('flex gap-3 p-4', isOwn && 'justify-end');
  const avatar = clsx(isOwn && 'order-2');
  const body = clsx('flex flex-col gap-2', isOwn && 'items-end');
  const message = clsx(
    'text-sm w-fit overflow-hidden p-2',
    isOwn ? 'bg-sky-400 text-white rounded-l-lg' : 'bg-gray-100 rounded-r-lg'
  );

  return (
    <div className={container}>
      <div className={avatar}>
        <Avatar user={userMetadata} />
      </div>
      <div className={body}>
        <div className="flex items-center gap-1">
          <div className="text-sm text-gray-500">
            {userMetadata !== undefined ? userMetadata.user_pseudo : data.id_user}
          </div>
          {/*<div className="text-xs text-gray-400">*/}
          {/*  /!*format(new Date(data.created_at), 'MM/dd/yyyy')*!/*/}
          {/*</div>*/}
        </div>
        <div className={message}>
          <div>{data.content}</div>
        </div>
      </div>
    </div>
  );
}

export default MessageBox;
