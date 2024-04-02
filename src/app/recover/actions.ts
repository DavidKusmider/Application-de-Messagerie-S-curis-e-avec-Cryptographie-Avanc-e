"use server"

import { cookies } from "next/headers";
import { createClient } from "../../utils/supabase/server"
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function recoverPassword(formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const data = {
    email: formData.get('email') as string,
  }

  const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
    redirectTo: "https://hertz-gh9dmsfjf-davidkusmiders-projects.vercel.app/updatePassword"
  })
  if (error) {
    console.log(error);
    redirect("/error");
  }

  revalidatePath('/', 'layout')
  redirect('/')
}
