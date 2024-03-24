'use client';

import Image from "next/image";
import { User } from "../types";
import { UserMetadata } from "@/types/databases.types";

interface AvatarGroupProps {
  users?: UserMetadata[];
};

const AvatarGroup: React.FC<AvatarGroupProps> = ({
  users = []
}) => {
  const slicedUsers = users.slice(0, 3);

  const positionMap = {
    0: 'top-0 left-[12px]',
    1: 'bottom-0',
    2: 'bottom-0 right-0'
  }

  return (
    <div className="relative h-11 w-11">
      {slicedUsers.map((user, index) => (
        <div
          key={index}
          className={`
            absolute
            inline-block
            rounded-full
            overflow-hidden
            h-[21px]
            w-[21px]
            ${positionMap[index as keyof typeof positionMap]}
          `}>
          <Image
            fill
            src={user.user_profile_picture || '/images/placeholder.jpg'}
            alt="Avatar"
          />
        </div>
      ))}
    </div>
  );
}

export default AvatarGroup;
