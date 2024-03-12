import DesktopFooter from "./DesktopFooter";
import DesktopHeader from "./DesktopHeader";
import DesktopSidebar from "./DesktopSidebar";
import MobileFooter from "./MobileFooter";

function Sidebar({ children }: {
  children: React.ReactNode,
}) {
  const users = [{id: '0', name: 'Test0', image: undefined, email: 'test@gmail.com', createdAt: new Date(Date.now())},
                  {id: '1', name: 'Test1', image: undefined, email: 'test1@gmail.com', createdAt: new Date(Date.now())}];
  const groups = [{id: '0', name: 'Test0'},{id: '1', name: 'Test1'}];
  const notifications = [{id: '0', msg: 'Test0'},{id: '1', msg: 'Test1'}];
  return (
    <div className="h-full">
      <DesktopSidebar currentUser={users[0]!} />
      <MobileFooter />
      <main className="lg:pl-20 h-full">
        {children}
      </main>
    </div>
  )
  /*return (
    <div className="h-full">
      <DesktopHeader/>
      <main className="lg:pl-20 h-full">
        {children}
      </main>
      <DesktopFooter />
    </div>
  )*/
}

export default Sidebar;