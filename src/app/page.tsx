import {createClient} from "@/utils/supabase/server";
import LogoutButton from './components/LogoutButton';
import {cookies} from 'next/headers';
import Link from "next/link";
import LoginButton from "@/app/components/LoginButton";

export default async function Home() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const {data} = await supabase.auth.getUser();
    return (
        <div className="flex min-h-full h-full flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-100">
            {data.user === null ?
                <div>
                    <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-10">
                        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                            Sign in to your account
                        </h2>
                        <LoginButton user={data.user}/>
                    </div>
                </div>
                :
                <div>
                <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-10">
                    <Link href="/conversations"
                          className="py-2 px-4 max-w-md flex justify-center items-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg">Go
                        to conversations</Link>
                    <LogoutButton user={data.user}/>
                </div>
                </div>
            }
        </div>
    );
}
