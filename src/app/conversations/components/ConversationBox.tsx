'use client';

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import clsx from "clsx";

import Avatar from "@/app/components/Avatar";
import useOtherUser from "@/app/hooks/useOtherUser";
import AvatarGroup from "@/app/components/AvatarGroup";
import { FullConversationType } from "@/app/types";

interface ConversationBoxProps {
  name:string,
  data: any,
  selected?: boolean;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({
  name,
  data,
  selected
}) => {
  // const otherUser = useOtherUser(data);
  //const session = useSession();
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push(`/conversations/${data.id}`);
  }, [data, router]);

  const lastMessage = useMemo(() => {
    const messages = data.messages || [];

    return messages[messages.length - 1];
  }, [data.messages]);

  const userEmail = useMemo(() => 'test@gmail.com'/*session.data?.user?.email*/,
    ['test@gmail.com'/*session.data?.user?.email*/]);

  const hasSeen = useMemo(() => {
    if (!lastMessage) {
      return false;
    }

    const seenArray = lastMessage.seen || [];

    if (!userEmail) {
      return false;
    }

    return seenArray
      .filter((user : any) => user.email === userEmail).length !== 0;
  }, [userEmail, lastMessage]);

  return (
    <div
      onClick={handleClick}
      className={clsx(`
        w-full
        relative
        flex
        items-center
        space-x-3
        p-3
        hover:bg-neutral-100
        rounded-lg
        transition
        cursor-pointer
        `,
        selected ? 'bg-neutral-100' : 'bg-white'
      )}
    >
      {true/*data.isGroup*/ ? (
        <AvatarGroup users={data.users} />
      ) : (
        <Avatar user={data} />
      )}
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <span className="absolute inset-0" aria-hidden="true" />
          <div className="flex justify-between items-center mb-1">
            <p className="text-md font-medium text-gray-900">
              {data.name}
            </p>
            {lastMessage?.createdAt && (
              <p
                className="
                  text-xs
                  text-gray-400
                  font-light
                "
              >
                {format(new Date(lastMessage.createdAt), 'p')}
              </p>
            )}
          </div>
          <p
            className={clsx(`
              truncate
              text-sm
              `,
              hasSeen ? 'text-gray-500' : 'text-black font-medium'
            )}>
            {name}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ConversationBox;
