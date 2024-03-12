"use server";

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

const cookieStore = cookies();
const supabase = createClient(cookieStore);

export async function insertMessage(nMessage, conversationId, user) {
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