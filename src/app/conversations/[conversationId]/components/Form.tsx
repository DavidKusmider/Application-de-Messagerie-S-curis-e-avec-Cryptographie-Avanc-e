'use client';

import { useContext, useState } from 'react';
import { HiPaperAirplane } from 'react-icons/hi2';
import MessageInput from "./MessageInput";
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import useConversation from "@/app/hooks/useConversation";
import { Message, UserMetadata, User_Group } from "@/types/databases.types"
import { encryptMessageContent } from '@/utils/cryptoUtils';
import { insertMessage } from "../../actions";
import { User } from "@supabase/supabase-js";
import { SocketContext } from "@/app/conversations/socketContext";

interface FormProps {
  user: User | null,
  usersMetadata: UserMetadata[]
  userGroupData: User_Group[]
}

const Form: React.FC<FormProps> = ({ user, usersMetadata, userGroupData }) => {
  const [userState, setUser] = useState<User | null>(user)
  const { conversationId } = useConversation();

  const socket = useContext(SocketContext);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FieldValues>({
    defaultValues: {
      message: ''
    }
  });

  if (user === undefined) {
    return (<div><strong>LOG IN !!!!</strong></div>);
  }

  let idUserEncryptedMessage: Map<string, Message> = new Map<string, Message>();

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    try {
      setValue('message', '', { shouldValidate: true });

      userGroupData.forEach(g => {
        if (String(g.id_group) === conversationId) {
          // @ts-ignore
          const formattedMessage: Message = { id: Number(Date.now().toString()), content: "", id_user: user.id, id_group: Number(conversationId), created_at: Date.now().toString(), send_at: Date.now().toString() };
          idUserEncryptedMessage.set(g.id_user, formattedMessage);
        }
      });

      //console.log(idUserEncryptedMessage);

      const newMessage = {
        id: Date.now().toString(),
        message: data.message,
        conversationId: conversationId,
        timestamp: new Date().toISOString(),
      };
      idUserEncryptedMessage.forEach((value, key, map) => {
        const pubKey = usersMetadata.find(m => m.id === key)?.public_key;
        const date = Date.now().toString();
        // @ts-ignore
        const formattedMessage: Message = { id: Number(date), content: encryptMessageContent(newMessage.message, pubKey), id_user: user.id, id_group: Number(conversationId), created_at: date, send_at: date };
        idUserEncryptedMessage.set(key, formattedMessage);
      });


      socket.emit('send_message', newMessage, userState, conversationId, socket.id, Array.from(idUserEncryptedMessage), async (formattedMessage: any) => {
        //console.log("save_message event");
        //console.log(formattedMessage, conversationId);
        await insertMessage(formattedMessage, conversationId, userState);
        //await insertMessageBis(formattedMessage, conversationId, userState);
      });

    } catch (error: any) {
      console.error('Error sending message:', error.message);
    }
    /*  return () => {
      socket.disconnect();
    };*/
  };

  return (
    <div
      className="
        py-4
        px-4
        bg-white
        border-t
        flex
        items-center
        gap-2
        lg:gap-4
        w-full
      "
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-2 lg:gap-4 w-full"
      >
        <MessageInput
          id="message"
          register={register}
          errors={errors}
          required
          placeholder="Write a message"
        />
        <button
          type="submit"
          className="
            rounded-full
            p-2
            bg-sky-500
            cursor-pointer
            hover:bg-sky-600
            transition
          "
        >
          <HiPaperAirplane
            size={18}
            className="text-white"
          />
        </button>
      </form>
    </div>
  );
}

export default Form;
