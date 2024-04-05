import { createClient } from "@/utils/supabase/server";
import LoginButton from '../components/LoginButton';
import LogoutButton from '../components/LogoutButton';
import { cookies } from 'next/headers';

export default async function LoginPage() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const {data} = await supabase.auth.getUser();
  return (
    <div 
      className="
        flex 
        min-h-full 
        h-full
        flex-col 
        justify-center 
        py-12 
        sm:px-6 
        lg:px-8 
        bg-gray-100
      "
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-10">
        <h2 
          className="
            mt-6 
            text-center 
            text-3xl 
            font-bold 
            tracking-tight 
            text-gray-900
          "
          >
            Sign in to your account
        </h2>
        { data.user === null ? <LoginButton user={data.user}/> : <LogoutButton user={data.user}/> }
      </div>
  </div>
  )
}