import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { type CookieOptions, createServerClient } from '@supabase/ssr'
import { io } from "socket.io-client";
import { createClient } from "@/utils/supabase/server";
import crypto from "node:crypto";

const generateUserKeyPair = () => {
  try {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      // publicExponent: 0x10101,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      }
    });

    return { publicKey, privateKey };
  } catch (error) {
    console.error("Error generating key pair:", error);
    throw error;
  }
};

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete({ name, ...options })
          },
        },
      }
    )
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const response = NextResponse.redirect(`${origin}${next}`, { status: 302 });
      const privateCookie = cookieStore.get("privateKey");
      if (privateCookie === undefined) {
        const supabase = createClient(cookieStore);
        const { privateKey, publicKey } = generateUserKeyPair();

        const user = (await supabase.auth.getUser()).data.user;
        const { error } = await supabase.schema("public").from('users').update({ public_key: publicKey }).eq('id', user?.id);

        if (error) {
          console.error("Error saving public key to Supabase database:", error.message);
        } else {
          //console.log("Public key saved successfully to Supabase database!");
        }

        //console.log("End of socket call");
        let date = new Date();
        const time = date.getTime();
        const expireTime = time + 30 * 24 * 60 * 60 * 1000; // 1 month
        date.setTime(expireTime);
        // @ts-ignore
        response.cookies.set('privateKey', privateKey.toString('utf8'), {
          path: "/",
          expires: date,
          secure: true,
          httpOnly: true,
        })
      }
      return response;
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
