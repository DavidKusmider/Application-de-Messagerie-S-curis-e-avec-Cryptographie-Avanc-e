"use client";
import React from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
