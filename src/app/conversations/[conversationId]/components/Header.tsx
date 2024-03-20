'use client';

import { HiChevronLeft } from 'react-icons/hi'
import { HiEllipsisHorizontal } from 'react-icons/hi2';
import React, { useMemo, useState } from "react";
import Link from "next/link";

import Avatar from "@/app/components/Avatar";
import AvatarGroup from "@/app/components/AvatarGroup";
import ProfileDrawer from "./ProfileDrawer";
import { Conversation, User } from '@/app/types';
import useActiveList from '@/app/hooks/useActiveList';
import useOtherUser from '@/app/hooks/useOtherUser';
import {User_Group} from "@/types/databases.types";

interface HeaderProps {
  name: string,
  userGroupData : User_Group[],
}

const Header: React.FC<HeaderProps> = ({ name, userGroupData }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const statusText = useMemo(() => {
    return `${userGroupData.length} members`;
  }, [userGroupData.length]);

  return (
  <>
    <ProfileDrawer 
      isOpen={drawerOpen}
      onClose={() => setDrawerOpen(false)}
    />
    <div 
      className="
        bg-white 
        w-full 
        flex 
        border-b-[1px] 
        sm:px-4 
        py-3 
        px-4 
        lg:px-6 
        justify-between 
        items-center 
        shadow-sm
      "
    >
      <div className="flex gap-3 items-center">
        <Link
          href="/conversations" 
          className="
            lg:hidden 
            block 
            text-sky-500 
            hover:text-sky-600 
            transition 
            cursor-pointer
          "
        >
          <HiChevronLeft size={32} />
        </Link>
        {/*{(*/}
        {/*    <AvatarGroup users={conversation.users}/>*/}
        {/*)}*/}
        <div className="flex flex-col">
          <div>{name}</div>
          <div className="text-sm font-light text-neutral-500">
            {statusText}
          </div>
        </div>
      </div>
      <HiEllipsisHorizontal
        size={32}
        onClick={() => setDrawerOpen(true)}
        className="
          text-sky-500
          cursor-pointer
          hover:text-sky-600
          transition
        "
      />
    </div>
    </>
  );
}
 
export default Header;
