"use server";

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { User } from '@supabase/supabase-js';
import { Group, User_Group, UserMetadata } from '@/types/databases.types';
import { Message } from '@/types/databases.types';

export async function insertMessage(nMessage: Message, conversationId: string, user: User | null) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  //console.log("Inserting message", nMessage);

  if (user !== null) {
    //console.log("With user");
    const { error } = await supabase.from("message").insert({
      content: nMessage.content,
      id_user: user.id,
      id_group: conversationId,
    });
    if (error !== null) {
      //console.log("insertMessage with user id:\n");
      console.log(error);
    }
  } else {
    //console.log("Without user");
    const { error } = await supabase
      .from("message")
      .insert({
        content: nMessage.content,
        id_group: conversationId,
      });
    if (error !== null) {
      //console.log("insertMessage without user id:\n");
      console.log(error);
    }
  }
}

export async function insertMessageBis(nMessage: Message, conversationId: string, user: User | null) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  //console.log("Inserting messageBis", nMessage);

  if (user !== null) {
    //console.log("With user");
    const { error } = await supabase.from("message_bis").insert({
      content: nMessage.content,
      id_user: user.id,
      id_group: conversationId,
    });
    if (error !== null) {
      //console.log("insertMessageBis with user id:\n");
      console.log(error);
    }
  } else {
    //console.log("Without user");
    const { error } = await supabase
      .from("message_bis")
      .insert({
        content: nMessage.content,
        id_group: conversationId,
      });
    if (error !== null) {
      //console.log("insertMessage without user id:\n");
      console.log(error);
    }
  }
}

export async function getGroupsUserByUserId(user: User | null) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  //console.log("USER.ID : ", user?.id);

  try {
    const { data, error } = await supabase
      .from('group')
      .select(`id, created_at, group_name, id_user_creator, user_group!inner(id)`).eq('user_group.id_user', user?.id);
    if (error) {
      throw new Error(error.message);
    }
    //console.log("DATA : ", data);


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

    //console.log("DATA USERNAME SEARCH: ", data);
    return data || [];
  } catch (error) {
    console.error('Error fetching users by username:', error);
    return [];
  }
}

export async function getUserById(id: string): Promise<User | null> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    const { data, error } = await supabase
      .from('users')
      .select()
      .eq('id', id);
    if (error) {
      throw new Error(error.message);
    }
    return data[0];
  } catch (error) {
    console.error('Error fetching users by username:', error);
    return null;
  }
}

export async function createGroup(name: string, members: UserMetadata[], user: User | null): Promise<void> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const groupData: Group = {
    group_name: name,
    id_user_creator: user?.id!
  }
  try {
    // Insérer le nouveau groupe dans la table "groups"
    const { data, error } = await supabase
      .schema("public")
      .from('group')
      .insert(groupData)
      .select();

    if (error) {
      throw new Error(error.message);
    }

    // Insérer les membres du groupe dans la table de liaison "user_group"
    const groupId = data[0].id; // Récupérer l'ID du groupe créé
    const memberInserts = members.map(memberId => ({
      id_group: groupId,
      id_user: memberId.id
    }));
    {
      const groupData: User_Group = {
        id_user: user?.id!,
        id_group: groupId
      }
      const { data, error } = await supabase
        .from('user_group')
        .insert(memberInserts)
        .select();
    }
  } catch (error) {
    console.error('Error creating group:', error);
    throw new Error('Error creating group');
  }
}

export async function getRelationsUser(user: User | null) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  //console.log("USER.ID r: ", user?.id);

  try {
    const userId = user?.id;
    const { data, error } = await supabase
      .from('user_relation')
      .select()
      .or(`id_user.eq.${userId},id_other_user.eq.${userId}`);
    if (error) {
      throw new Error(error.message);
    }
    //console.log("DATA relation: ", data);

    return data;
  } catch (error) {
    console.error('Error fetching user relations getRelationsUser:');
    return [];
  }
}

// Fetch all of 'message' table
export async function getAllMessages(user: User | null, conversationId: any) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  if (user !== null) {
    const { data, error } = await supabase.from("message").select().eq("id_group", conversationId).order("id");
    if (error != null) {
      console.log("getAllMessages:\n" + error);
    }
    if (data) {
      return data;
    }
    return [];
  }
  return [];
}

// Fetch all of 'message_bis' table
export async function getAllMessagesBis(conversationId: any) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.from("message_bis").select().eq("id_group", conversationId).order("id");
  if (error != null) {
    console.log("getAllMessagesBis:\n" + error);
  }
  if (data) {
    return data;
  }
  return [];
}

export async function getAuthUser() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase.auth.getUser();

  return data;
}

// Fetch all of 'users' table
export async function getUsersMetadata() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase.schema("public").from("users").select();
  if (error !== null) {
    console.log(error);
  }
  if (data) {
    return data;
  }
  return [];
}

// Fetch all of 'group' table
export async function getAllGroups() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase.from("group").select();
  if (error != null) {
    console.log("getAllGroups:\n" + error);
  }
  if (data) {
    return data;
  }
  return [];
}

// Fetch all of 'user_group' table
export async function getAllUserGroup() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase.from("user_group").select();
  if (error != null) {
    console.log("getAllUserGroup:\n" + error);
  }
  if (data) {
    return data;
  }
  return [];
}

// Fetch all of 'user_relation' table
export async function getAllUserRelation() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase.from("user_relation").select();
  if (error != null) {
    console.log("getAllUserRelation:\n" + error);
  }
  if (data) {
    return data;
  }
  return [];
}
export async function getUserGroupFromIdGroup(id: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase.schema("public").from("user_group").select().eq("id_group", id);
  if (error !== null) {
    console.log(error);
  }
  if (data) {
    return data;
  }
  return [];
}

export async function getAllUsers() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase.schema("public").from("users").select();
  if (error !== null) {
    console.log(error);
  }
  if (data) {
    return data;
  }
  return [];
}

export async function getGroupFromIdGroup(idGroup: string, idUser: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase.schema("public").from("group").select('*, user_group ( id_user, id_group)').eq('id', idGroup).eq('user_group.id_group', idGroup).eq('user_group.id_user', idUser);
  if (error !== null) {
    console.log(error);
  }
  if (data) {
    return data;
  }
  return [];
}
