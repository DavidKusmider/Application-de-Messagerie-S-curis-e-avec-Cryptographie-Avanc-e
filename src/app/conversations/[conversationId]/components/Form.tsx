'use client';

import { useEffect, useMemo } from 'react';
import { HiPaperAirplane, HiPhoto } from 'react-icons/hi2';
import MessageInput from "./MessageInput";
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { CldUploadButton } from "next-cloudinary";
import useConversation from "@/app/hooks/useConversation";
import { io } from 'socket.io-client';

const Form = () => {
  const { conversationId } = useConversation();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FieldValues>({
    defaultValues: {
      message: ''
    }
  });

  const socket = useMemo(() => io('http://localhost:3001'), []);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      setValue('message', '', { shouldValidate: true });

      const newMessage = {
        id: Date.now().toString(),
        message: data.message,
        conversationId: conversationId,
        timestamp: new Date().toISOString(),
      };

      socket.emit('message', newMessage);

      console.log('Message sent:', newMessage);
    } catch (error: any) {
      console.error('Error sending message:', error.message);
    }
  };

  const handleUpload = (result: any) => {
    const newMessage = {
      id: Date.now().toString(),
      image: result.info.secure_url,
      conversationId: conversationId,
      timestamp: new Date().toISOString(),
    };

    socket.emit('message', newMessage);
  }

  useEffect(() => {
    const socket = io('http://localhost:3001');
    socket.emit('joinRoom', conversationId);
    return () => {
      socket.disconnect();
    };
  }, []);

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
