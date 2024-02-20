"use client";
import React from "react";
import { User } from "@supabase/supabase-js"
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginButton({ user }: {user: User | null} ) {

    const router = useRouter();

    const loginGithub = async () => {
        const supa = createClient();
        await supa.auth.signInWithOAuth({
            provider: "github",
            options:{
                redirectTo: location.origin + "auth/callback"
            }
        })
    }

    const logout = async () => {
        const supa = createClient();
        await supa.auth.signOut();
        router.refresh();
    }

    const login = () => {
        router.push("/connexion")
    }

    console.log(user);

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