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
        { data.user === null ? <Link href="/connexion">Connexion</Link> : <LogoutButton user={data.user}/> }
    </div>
  );
}
