import { updatePasswordDB } from "./actions"

export default function updatePassword(){
    return(
        <div>
        <form>
            <label htmlFor="password">Nouveau mot de passe</label>
            <input id="password" name="password" type="password" required />
            <button formAction={updatePasswordDB}>Send Email</button>
        </form>
    </div>
    )
}