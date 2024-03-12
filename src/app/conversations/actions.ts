"use server";

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { User } from '@supabase/supabase-js';

export async function insertMessage(nMessage: { message: any; }, conversationId: string, user: User | null) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    if(user !== null){
    const { error } = await supabase.from("message").insert({
        content: nMessage.message,
        id_user: user.id,
        id_group: conversationId,
      });
    if(error !== null){
        console.log(error);
    }
    }else{
        const { error } = await supabase
            .from("message")
            .insert({
              content: nMessage.message,
              id_group: conversationId,
            });
        if(error !== null){
            console.log(error);
        }
    }
}

export async function getAllMessages(user: User | null, conversationId: any){
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    if(user !== null){
        const { data, error } = await supabase.from("message").select().eq("id_group", conversationId);
        if(error != null){
            console.log(error);
        }
        return data;
    }else{
        return null;
    }
}

export async function getAuthUser(){
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const {data, error} = await supabase.auth.getUser();
    if(error !== null){
        console.log(error);
    }
    return data;
}