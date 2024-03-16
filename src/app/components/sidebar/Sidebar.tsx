import { getAuthUser, getGroupsUser, getRelationsUser } from "@/app/conversations/actions";
import DesktopFooter from "./DesktopFooter";
import DesktopHeader from "./DesktopHeader";
import DesktopSidebar from "./DesktopSidebar";
import MobileFooter from "./MobileFooter";

async function Sidebar({ children }: {
  children: React.ReactNode,
}) {
  const users = [{id: '0', name: 'Test0', image: undefined, email: 'test@gmail.com', createdAt: new Date(Date.now())},
                  {id: '1', name: 'Test1', image: undefined, email: 'test1@gmail.com', createdAt: new Date(Date.now())}];
  const groupsTest = [{id: '0', name: 'Test0'},{id: '1', name: 'Test1'}];
  const notifications = [{id: '0', msg: 'Test0'},{id: '1', msg: 'Test1'}];
  //const data = await getAuthUser();
  //const groups = await getGroupsUser(data.user);
  
  return (
    <div className="h-full">
      <DesktopSidebar currentUser={/*data.user!*/users[0]} /*groups={groups!}*/ /*friends={userRelations!}*//>
      <MobileFooter />
      <main className="lg:pl-20 h-full">
        {children}
      </main>
    </div>
  )
}

export default Sidebar;