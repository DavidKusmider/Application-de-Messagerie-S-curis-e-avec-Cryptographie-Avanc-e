"use client";
import React from "react";
import { User } from "@supabase/supabase-js"
import { createClient } from "@/utils/supabase/client";
import { redirect, useRouter } from "next/navigation";

export default function LoginButton({ user }: {user: User | null} ) {

    const router = useRouter();
    const loginGithub = async () => {
        const supa = createClient();
        await supa.auth.signInWithOAuth({
            provider: "github",
            options:{
                redirectTo: location.origin + "/auth/callback"
            }
        })
    }

    const logout = async () => {
        console.log(user);
        const supa = createClient();
        await supa.auth.signOut();
        router.refresh();
    }

    const login = () => {
        redirect("/connexion")
    }

    

    return (
        <div>
            { user != null ? (
                <button onClick={logout}>Logout</button>
            ) : (
                <button onClick={loginGithub}>LoginGithub</button>
            )}
        </div>
    )
}