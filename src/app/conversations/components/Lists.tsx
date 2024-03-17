import GroupBox from "./GroupBox";
import NotifBox from "./NotifBox"

import { Notification, Group, FullConversationType } from '@/app/types/index';
import {User} from "@supabase/supabase-js"
import ConversationList from "./ConversationList";
import useActif from "@/app/hooks/useActif";

interface ListsProps {
    users : User[]
    groups : Group[]
    notifs : Notification[]
    conversations : FullConversationType[]
}

const Lists: React.FC<ListsProps> = ({
    users,
    groups,
    notifs,
    conversations,
  }) => {
    const actif = useActif().actif;
    if (actif==="groups") {
      return (
        <div className="absolute top-20 left-5">
          <div>
            <ConversationList 
              users={users} 
              title="Messages" 
              initialItems={conversations}
            />
          </div>
        </div>
      )
    }
    if (actif==="friends") {
      return (
        <div className="absolute top-5 left-5">
          <div>
            {groups.map((item) => (
              <GroupBox
                key={item.id}
                data={item}
              />
            ))}
          </div>
        </div>
      )
    }
    return (
      <div className="absolute top-5 left-5">
        <div>
        {notifs.map((item) => (
          <NotifBox
            key={item.id}
            data={item}
          />
        ))}
        </div>
      </div>
    );
  }
  
export default Lists;