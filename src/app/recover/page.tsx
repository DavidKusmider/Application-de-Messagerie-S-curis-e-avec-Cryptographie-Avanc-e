import { recoverPassword } from "./actions"

export default function recover() {
   return(
    <div>
        <form>
            <label htmlFor="email">Email:</label>
            <input id="email" name="email" type="email" required />
            <button formAction={recoverPassword}>Send Email</button>
        </form>
    </div>
   ) 
}