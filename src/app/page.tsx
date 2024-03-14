import { createClient } from "@/utils/supabase/server";
import LogoutButton from './components/LogoutButton';
import { cookies } from 'next/headers';
import Link from "next/link";

export default async function Home() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const {data} = await supabase.auth.getUser();
  return (
    <div>
        { data.user === null ?
            <Link href="/connexion">Connexion</Link>
            :
            <div className="m-10 space-y-10">
                <Link href="/conversations" className="py-2 px-4 max-w-md flex justify-center items-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg">Go to conversations</Link>
                <LogoutButton user={data.user}/>
            </div>
        }
    </div>
  );
}
