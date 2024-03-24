"use client";
import React from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { generateUserKeyPair } from "@/utils/cryptoUtils";
import { io } from "socket.io-client";

export default function LoginButton({ user }: { user: User | null }, props : any) {
  const router = useRouter();
  const loginGithub = async () => {
    const supa = createClient();
    await supa.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: location.origin + "/auth/callback",
      },
    });

    const socket = io("https://localhost:3000");

    socket.emit("login", async (response: any) => {
      let date = new Date();
      const time = date.getTime();
      const expireTime = time + 30 * 24 * 60 * 60 * 1000; // 1 month
      date.setTime(expireTime);
      document.cookie = `privateKey=${response.privateKey};`
        +`expires=${date.toUTCString()};`
        +`path=/;`
        +`Secure;`
        +`HttpOnly`;
      console.log("Private Key received and stored: ", response.privateKey);

      const supabase = createClient();
      const userId = user ? user.id : (await supa.auth.getUser()).data.user?.id;
      console.log("user: " + user);
      console.log("userId: " + userId);
      // TODO userId is undefined because user is null

      const { data, error } = await supabase.schema("public").from('users').update({ public_key: response.publicKey }).eq('id', userId);

      if (error) {
        console.error("Error saving public key to Supabase database:", error.message);
      } else {
        console.log("Public key saved successfully to Supabase database!");
      }
    });
  };
  const login = () => {
    router.push("/connexion");
  };

  return (
    <div>
      <button
        onClick={loginGithub}
        className="py-2 px-4 max-w-md flex justify-center items-center bg-gray-600 hover:bg-gray-700 focus:ring-gray-500 focus:ring-offset-gray-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
      >
        Login with Github
      </button>
    </div>
  );
}
