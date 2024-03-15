"use server";

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { User } from '@supabase/supabase-js';

export async function insertMessage(nMessage: any, conversationId: string, user: User | null) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  console.log("Inserting message", nMessage);

  if (user !== null) {
    console.log("With user");
    const { error } = await supabase.from("message").insert({
      content: nMessage.message,
      id_user: user.id,
      id_group: conversationId,
    });
    if (error !== null) {
      console.log("insertMessage with user id:\n");
      console.log(error);
    }
  } else {
    console.log("Without user");
    const { error } = await supabase
      .from("message")
      .insert({
        content: nMessage.message,
        id_group: conversationId,
      });
    if (error !== null) {
      console.log("insertMessage without user id:\n");
      console.log(error);
    }
  }
}

export async function getGroupsUser(user: User | null) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  console.log("USER.ID : ", user?.id);

  try {
    const { data, error } = await supabase
      .from('group')
      .select(`id, created_at, group_name, id_user_creator, user_group!inner(id)`).eq('user_group.id_user', user?.id);
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

export async function getUsersByUsername(username: string): Promise<User[]> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    const { data, error } = await supabase
      .from('users')
      .select()
      .ilike('user_pseudo', `%${username}%`); // Utiliser ilike pour une recherche insensible à la casse
    if (error) {
      throw new Error(error.message);
    }

    console.log("DATA USERNAME SEARCH: ", data);
    return data || [];
  } catch (error) {
    console.error('Error fetching users by username:', error);
    return [];
  }
}

interface GroupData {
  name: string;
  members: number[]; // Liste des identifiants des membres du groupe
}

export async function createGroup(groupData: GroupData, userId: number): Promise<void> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    // Insérer le nouveau groupe dans la table "groups"
    const { data, error } = await supabase
      .from('groups')
      .insert({
        name: groupData.name,
        id_user_creator: userId // ID de l'utilisateur créateur du groupe
      });

    if (error) {
      throw new Error(error.message);
    }

    // Insérer les membres du groupe dans la table de liaison "user_group"
    if (data && data.length > 0) {
      const groupId = data[0].id; // Récupérer l'ID du groupe créé
      const memberInserts = groupData.members.map(memberId => ({
        id_group: groupId,
        id_user: memberId
      }));

      await supabase
        .from('user_group')
        .insert(memberInserts);
    }
  } catch (error) {
    console.error('Error creating group:', error);
    throw new Error('Error creating group');
  }
}

export async function getAllMessages(user: User | null, conversationId: any) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  if (user !== null) {
    const { data, error } = await supabase.from("message").select().eq("id_group", conversationId).order("id");
    if (error != null) {
      console.log("getAllMessages:\n" + error);
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

export async function getUsersMetadata() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase.schema("public").from("users").select();
  if (error !== null) {
    console.log(error);
  }
  return data;
}
