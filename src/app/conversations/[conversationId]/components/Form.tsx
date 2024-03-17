'use client';

import {useEffect, useMemo, useState} from 'react';
import { HiPaperAirplane, HiPhoto } from 'react-icons/hi2';
import MessageInput from "./MessageInput";
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { CldUploadButton } from "next-cloudinary";
import useConversation from "@/app/hooks/useConversation";
import { io } from 'socket.io-client';
import { Message } from "@/types/databases.types"
import { encryptMessageContent } from '@/utils/cryptoUtils';
import { getAuthUser, insertMessage } from "../../actions";
import { saveMessageEvent } from "@/app/conversations/[conversationId]/actions";
import {User} from "@supabase/supabase-js";

interface FormProps {
  user : User | null,
}

const Form: React.FC<FormProps> = ({user}) => {
  const [userState, setUser] = useState<User | null>(user)
  const { conversationId } = useConversation();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FieldValues>({
    defaultValues: {
      message: ''
    }
  });

  const socket = useMemo(() => io('https://localhost:3000'), []);

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    try {
      setValue('message', '', { shouldValidate: true });
      /*const newMessage : Message = {
        id: Number(Date.now().toString()), // unique identifier for the message, TODO find a better one
        content: data.message,
        id_user: dataUser.user?.id!,
        id_group: Number(conversationId),
        created_at: Date.now().toString(),
        send_at: Date.now().toString()
      };*/
      const newMessage = {
        id: Date.now().toString(),
        message: data.message/* encryptMessageContent(data.message, recipientPublicKey) */,
        conversationId: conversationId,
        timestamp: new Date().toISOString(),
      };

      socket.emit('send_message', newMessage, userState, conversationId, socket.id, async (formattedMessage: any) => {
        console.log("save_message event");
        console.log(formattedMessage, conversationId);
        await insertMessage(formattedMessage, conversationId, userState);
      });

    } catch (error: any) {
      console.error('Error sending message:', error.message);
    }
    return () => {
      socket.disconnect();
    };
  };

  const handleUpload = (result: any) => {
    const newMessage = {
      id: Date.now().toString(),
      image: result.info.secure_url,
      conversationId: conversationId,
      timestamp: new Date().toISOString(),
    };

    socket.emit('send_message', newMessage);
  }

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
      <CldUploadButton
        options={{ maxFiles: 1 }}
        onUpload={handleUpload}
        uploadPreset="pgc9ehd5"
      >
        <HiPhoto size={30} className="text-sky-500" />
      </CldUploadButton>
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
