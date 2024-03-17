'use server'

import { createClient } from "@/utils/supabase/server";
import { User } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { getAuthUser } from "../conversations/actions";

export async function addFriend(newFriend : any) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const user = await getAuthUser();
  try {
    //console.log('user ID: ',user.user?.id);
    //console.log('other user ID: ',newFriend.members.value);
    const { error } = await supabase
      .from('user_relation')
      .insert({ id_user: user.user?.id, id_other_user: newFriend.members.value, state_relation: 0})
    if (error) {
      throw new Error(error.message);
    }
  } catch(error) {
    console.error('Error inserting new relation between:',user,' and ',newFriend);
    console.error(error);
    return null;
  } 
}