import Image from "next/image";
import LoginButton from "../app/components/LoginButton"
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

export default async function Home() {
    const supabase = createClient();

    const {data} = await supabase.auth.getUser();
    console.log(data);
  return (
    <div>
        <Link href="/connexion">Connexion</Link>
    </div>
  );
}
