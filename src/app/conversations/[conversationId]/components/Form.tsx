'use client';

import { useEffect, useMemo, useState } from 'react';
import { HiPaperAirplane, HiPhoto } from 'react-icons/hi2';
import MessageInput from "./MessageInput";
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { CldUploadButton } from "next-cloudinary";
import useConversation from "@/app/hooks/useConversation";
import { io } from 'socket.io-client';
import { Message, UserMetadata, User_Group } from "@/types/databases.types"
import { encryptMessageContent, } from '@/utils/cryptoUtils';
import { getAuthUser, insertMessage } from "../../actions";
import { saveMessageEvent } from "@/app/conversations/[conversationId]/actions";
import { User } from "@supabase/supabase-js";

interface FormProps {
  user: User | null,
  usersMetadata: UserMetadata[]
  userGroupData: User_Group[]
}

const Form: React.FC<FormProps> = ({ user, usersMetadata, userGroupData }) => {
  const [userState, setUser] = useState<User | null>(user)
  const { conversationId } = useConversation();
  const [recipientPublicKey, setRecipientPublicKey] = useState<string | undefined>('');




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

      const userIdOfConversation = userGroupData.find(group => String(group.id_group) === conversationId && group.id_user !== user.id)?.id_user;
      const publicKeyOfRecipient: string | undefined = usersMetadata.find(user => user.id === userIdOfConversation)?.public_key;

      console.log("PUBLIC key1 : ", publicKeyOfRecipient);
      // setRecipientPublicKey(publicKeyOfRecipient);


      // setRecipientPublicKey("-----BEGIN RSA PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCub6Mu3Jgs6cczNKlfTR3kXCfRLzQmy0aiPkvLxTHUDYt58n4bq8uFHiCtmFD/AMH53ke8nDViA0po7BGVwjXF8t1pV0raxtpBD6SPM7eIJ3xGEeQ8W3TD2nogbtehkV8xLcpgb82Pao/bLlkmSuOjPSWbKrKhQFCSJPWs5WWDZwIDAQAB\n-----END RSA PUBLIC KEY-----");


      console.log("PUBLIC recipient : ", recipientPublicKey);

      const newMessage = {
        id: Date.now().toString(),
        message: encryptMessageContent(data.message, publicKeyOfRecipient),/* encryptMessageContent(data.message, recipientPublicKey) */
        conversationId: conversationId,
        timestamp: new Date().toISOString(),
      };

      console.log("encrypt mnessage : ", newMessage);

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
