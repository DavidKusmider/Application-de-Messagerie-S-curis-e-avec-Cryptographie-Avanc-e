import {updatePasswordDB} from "./actions"

export default async function updatePassword({searchParams}: { searchParams?: { code?: string } }) {
    if(searchParams !== undefined && searchParams.code !== undefined) {
        const updatePasswordDBWithCode = updatePasswordDB.bind(null, searchParams.code);

        return (
            <div>
                <form>
                    <label htmlFor="password">Nouveau mot de passe</label>
                    <input id="password" name="password" type="password" required/>
                    <button formAction={updatePasswordDBWithCode}>Reset Password</button>
                </form>
            </div>
        )
    }else{
        return (
            <div>
                <p>Error when requesting password change.</p>
            </div>
        )
    }
}