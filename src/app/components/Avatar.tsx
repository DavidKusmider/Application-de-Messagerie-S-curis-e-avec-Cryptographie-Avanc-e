'use client';

import Image from "next/image";
import { User } from "@supabase/supabase-js";
import { UserMetadata } from "@/types/databases.types";

interface AvatarProps {
  user: UserMetadata;
}

const Avatar: React.FC<AvatarProps> = ({ user }) => {
  //const { members } = useActiveList();
  const isActive = true;//members.indexOf(user?.email!) !== -1;

  return (
    <div className="relative">
      <div className="
        relative 
        inline-block 
        rounded-full 
        overflow-hidden
        h-9 
        w-9 
        md:h-11 
        md:w-11
      ">
        <Image
          fill
          src={user != null ? user.user_profile_picture : '/images/placeholder.jpg'}
          alt="Avatar"
        />
      </div>
      {isActive ? (
        <span
          className="
            absolute 
            block 
            rounded-full 
            bg-green-500 
            ring-2 
            ring-white 
            top-0 
            right-0
            h-2 
            w-2 
            md:h-3 
            md:w-3
          "
        />
      ) : null}
    </div>
  );
}

export default Avatar;
