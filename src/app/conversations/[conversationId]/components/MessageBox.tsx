'use client';

import clsx from "clsx";
import { useEffect, useState } from 'react';
import { format } from "date-fns";
import useConversation from "@/app/hooks/useConversation";

import Avatar from "@/app/components/Avatar";

import  {insertMessage} from '../../actions';
import {User} from '@supabase/supabase-js'

import {getAuthUser} from "../../actions";
import {Message} from "@/types/databases.types";

interface MessageBoxProps {
  user: User | null;
  data: any;
  isLast?: boolean;
}

const MessageBox: React.FC<MessageBoxProps> = ({user, data, isLast }) => {
  const conversationId = "1";// useConversation();

  const isOwn = user?.id === data.id_user;

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
        <Avatar user={data.sender} />
      </div>
      <div className={body}>
        <div className="flex items-center gap-1">
          <div className="text-sm text-gray-500">
            {data.id_user}
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
