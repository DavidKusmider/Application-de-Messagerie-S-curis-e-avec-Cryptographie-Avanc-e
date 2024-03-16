"use client";
import React from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LogoutButton({ user }: { user: User | null }, props : any) {
  const router = useRouter();

  const logout = async () => {
    document.cookie = "privateKey=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    console.log(user);
    const supa = createClient();
    await supa.auth.signOut();
    router.refresh();
  };

  return (
    <div>
      <button
        onClick={logout}
        className="py-2 px-4 max-w-md flex justify-center items-center bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
      >
        Logout
      </button>
    </div>
  );
}
