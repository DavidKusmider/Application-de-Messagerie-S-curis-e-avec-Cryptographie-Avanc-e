"use server";

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { User } from '@supabase/supabase-js';

export async function insertMessage(nMessage: { message: any; }, conversationId: string, user: User | null) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  if (user !== null) {
    const { error } = await supabase.from("message").insert({
      content: nMessage.message,
      id_user: user.id,
      id_group: conversationId,
    });
    if (error !== null) {
      console.log(error);
    }
  } else {
    const { error } = await supabase
      .from("message")
      .insert({
        content: nMessage.message,
        id_group: conversationId,
      });
    if (error !== null) {
      console.log(error);
    }
  }
}

export async function getAllMessages(user: User | null, conversationId: any) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  if (user !== null) {
    const { data, error } = await supabase.from("message").select().eq("id_group", conversationId);
    if (error != null) {
      console.log(error);
    }
    return data;
  } else {
    return null;
  }
}

export async function getAuthUser() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase.auth.getUser();
  if (error !== null) {
    console.log(error);
  }
  return data;
}

export async function getGroupsUser(user: User | null) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  console.log("USER.ID : ", user?.id);

  try {
    // Utilisez la fonction select().eq() pour sélectionner les groupes auxquels appartient l'utilisateur
    const { data, error } = await supabase
      .from('group')
      .select(`id, created_at, group_name, id_user_creator, user_group!inner(id)`).eq('user_group.id_user', user?.id);
    // .join(
    //   'Link_Users_Groups',
    //   { 'Link_Users_Groups.id_group': 'Group_Chat.id_group' }
    // )
    // .eq('Link_Users_Groups.id_user', user.id);
    if (error) {
      throw new Error(error.message);
    }
    console.log("DATA : ", data);
    console.log("DATA.USERGROUP : ", data[2].user_group);

    return data;
  } catch (error) {
    console.error('Error fetching user groups getGroupsUser:');
    return null;
  }
}
