import DesktopSidebar from "./DesktopSidebar";
import MobileFooter from "./MobileFooter";
import {User} from "@supabase/supabase-js";
import {Group, User_Group, User_Relation, UserMetadata} from "@/types/databases.types";

interface SidebarProps{
    user: User | null,
    groups: Group[],
    userGroups: User_Group[],
    userRelations: User_Relation[],
    userMetadata: UserMetadata[],
    children: React.ReactNode,
}

const Sidebar : React.FC<SidebarProps> = ({user, groups, userGroups, userRelations, userMetadata, children }) => {

    console.log(userRelations);
  return (
    <div className="h-full">
      <DesktopSidebar currentUser={user} groups={groups} friends={userRelations} usersMetadata={userMetadata} userGroupsData={userGroups}/>
      {/*<MobileFooter />*/}
      <main className="lg:pl-20 h-full">
        {children}
      </main>
    </div>
  )
}

export default Sidebar;