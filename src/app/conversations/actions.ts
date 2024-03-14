"use server";

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { User } from '@supabase/supabase-js';

export async function insertMessage(nMessage:  any, conversationId: string, user: User | null) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    console.log("Inserting message", nMessage);

    if(user !== null){
        console.log("With user");
    const { error } = await supabase.from("message").insert({
        content: nMessage.message,
        id_user: user.id,
        id_group: conversationId,
    });
    if(error !== null){
        console.log("insertMessage with user id:\n");
        console.log(error);
    }
    }else{
        console.log("Without user");
        const { error } = await supabase
            .from("message")
            .insert({
                content: nMessage.message,
                id_group: conversationId,
            });
        if(error !== null){
            console.log("insertMessage without user id:\n");
            console.log(error);
        }
    }
}

export async function getAllMessages(user: User | null, conversationId: any){
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    if(user !== null){
        const { data, error } = await supabase.from("message").select().eq("id_group", conversationId).order("id");
        if(error != null){
            console.log("getAllMessages:\n" + error);
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

export async function getUsersMetadata(){
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const {data, error} = await supabase.schema("public").from("users").select();
    if(error !== null){
        console.log(error);
    }
    return data;
}