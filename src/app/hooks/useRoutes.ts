import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { HiChat } from 'react-icons/hi';
import { HiArrowLeftOnRectangle, HiUsers } from 'react-icons/hi2';
import { IoIosNotifications } from "react-icons/io";
import useConversation from "./useConversation";
import { createClient } from "@/utils/supabase/client";
import { getAuthUser } from "../conversations/actions";

const useRoutes = () => {
  
  const router = useRouter();
  const logout = async () => {
    const data = await getAuthUser();
    if (data.user !== null) { 
      const supa = createClient();
      await supa.auth.signOut();
      router.refresh();
    }
  };
  const pathname = usePathname();
  const { conversationId } = useConversation();

  const routes = useMemo(() => [
    { 
      label: 'Chat', 
      href: '/conversations', 
      icon: HiChat,
      active: pathname === '/conversations' || !!conversationId
    },
    { 
      label: 'Friends', 
      href: '/friends', 
      icon: HiUsers, 
      active: pathname === '/friends'
    },
    { 
      label: 'Notifications', 
      href: '/notifications', 
      icon: IoIosNotifications, 
      active: pathname === '/notifications'
    },
    {
      label: 'Logout', 
      onClick: () => logout(),
      href: '/',
      icon: HiArrowLeftOnRectangle, 
    }
  ], [pathname, conversationId]);

  return routes;
};

export default useRoutes;
