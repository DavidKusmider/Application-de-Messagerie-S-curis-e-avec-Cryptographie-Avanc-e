import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { FullConversationType, User } from "../types";

const useOtherUser = (conversation: FullConversationType | { users: User[] }) => {
  //const session = useSession();

  const otherUser = useMemo(() => {
    const currentUserEmail = 'test@gmail.com';//session.data?.user?.email;

    const otherUser = conversation.users.filter((user) => user.email !== currentUserEmail);

    return otherUser[0];
  }, ['test@gmail.com'/*session.data?.user?.email*/, conversation.users]);

  return otherUser;
};

export default useOtherUser;
