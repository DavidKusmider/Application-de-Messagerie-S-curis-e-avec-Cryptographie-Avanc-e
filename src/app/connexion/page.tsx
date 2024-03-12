import Image from "next/image";
import AuthForm from "./components/AuthForm";
import { login, signup } from './actions'
import { createClient } from "@/utils/supabase/server";
import LoginButton from '../components/LoginButton';
import { cookies } from 'next/headers';
import Link from 'next/link';
     
       
        
/*const Auth = () => {
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
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Image
          height="48"
          width="48"
          className="mx-auto w-auto"
          src="/images/logo.png"
          alt="Logo"
        />
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
      </div>
      <AuthForm />      
  </div>
  )
}

export default Auth;
 */

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
    <Link href="/recover">Mot de passe oublie ?</Link>
    </>
  )
}