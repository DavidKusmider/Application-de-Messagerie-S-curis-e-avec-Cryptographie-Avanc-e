'use client';

import router from "next/router";

function DesktopHeader() {
    return (
      <div className="
      lg:pl-5 
      absolute 
      top-5 
      left-0 
      flex
      justify-items-stretch
      gap-20
      ">
        <div onClick={() => {router.push(`/conversation/`);}}>Groups</div>
        <div>Friends</div>
        <div>Notifications</div>
      </div>
    )
  }
  
  export default DesktopHeader;