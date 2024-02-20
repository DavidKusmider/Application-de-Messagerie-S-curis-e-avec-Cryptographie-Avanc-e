import { login, signup } from './actions'
import { createClient } from "@/utils/supabase/server";
import LoginButton from '../components/LoginButton';
import { cookies } from 'next/headers';

export default async function LoginPage() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const {data} = await supabase.auth.getUser();
  return (
    <>
    <form>
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email" required />
      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password" required />
      <button formAction={login} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Log in</button>
      <button formAction={signup} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Sign up</button>
    </form>
    <LoginButton user={data.user}/>
    </>
  )
}