'use server'

import {revalidatePath} from 'next/cache'
import {cookies} from 'next/headers'
import {redirect} from 'next/navigation'

import {createClient} from '@/utils/supabase/server'
import {emit} from 'process'

const validateEmail = (email: string) => {
    return email.match(
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
    );
};

export async function login(formData: FormData) {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    if(validateEmail(data.email)) {

        const {error} = await supabase.auth.signInWithPassword(data)

        if (error) {
            //console.log("signin:\n" + error)
            redirect('/error')
        }

        revalidatePath('/', 'layout')
        redirect('/')
    }else{
        console.log("wrong email format")
        redirect('/error')
    }
}

export async function signup(formData: FormData) {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // type-casting here for convenience
    // in practice, you should validate your inputs

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    if (validateEmail(data.email)) {

        const {error} = await supabase.auth.signUp(data)

        if (error) {
            console.log("signup:\n" + error)
            redirect('/error')
        }

        revalidatePath('/', 'layout')
        redirect('/')
    } else {
        console.log("wrong email format")
        redirect('/error')
    }
}