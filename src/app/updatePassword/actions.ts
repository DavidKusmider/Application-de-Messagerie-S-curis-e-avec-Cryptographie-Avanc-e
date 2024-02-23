"use server"

import { cookies } from "next/headers";
import { createClient } from "../../utils/supabase/server"
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function updatePasswordDB (code : string, formData : FormData) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    await supabase.auth.exchangeCodeForSession(code);

    const data = {
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.updateUser({
        password : data.password
    })
    if(error){
        console.log(error);
        redirect("/error");
    }

    await supabase.auth.signOut();
    revalidatePath('/', 'layout')
    redirect('/')
}