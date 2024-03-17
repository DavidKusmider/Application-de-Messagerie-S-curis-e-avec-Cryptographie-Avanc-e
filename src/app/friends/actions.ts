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
    const { error } = await supabase
      .from('user_relation')
      .insert({ id_user: user.user?.id, id_other_user: newFriend.members.value, state_relation: 0})
    if (error) {
      throw new Error(error.message);
    }
    return {id1: user.user?.id, id2: newFriend.members.value};
  } catch(error) {
    console.error('Error inserting new relation between:',user,' and ',newFriend);
    console.error(error);
    return null;
  } 
}

export async function removeFriend(otherUserId : string) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const user = await getAuthUser();
    const userId = user.user?.id;
    try {
      const { error } = await supabase
        .from('user_relation')
        .delete()
        .or(`and(id_user.eq.${userId},id_other_user.eq.${otherUserId}),and(id_user.eq.${otherUserId},id_other_user.eq.${userId})`);
      if (error) {
        throw new Error(error.message);
      }
      console.log('Void',{id1: userId, id2: otherUserId})
      return {id1: userId, id2: otherUserId};
    } catch(error) {
      console.error('Error deleting relation between:',userId,' and ',otherUserId);
      console.error(error);
      return null;
    } 
  }