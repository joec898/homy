import { Link } from "react-router-dom";
import {useContext, useState} from "react";
import axios from "axios";
import { UserContext } from "../parts/UserContext";
import {Navigate} from "react-router-dom";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);

    const {setUser}  = useContext(UserContext);

    async function handleLogin(ev) {
        ev.preventDefault();
        try{
            const resp = await axios.post('/login', {email, password});
            setUser(resp.data);
            setRedirect(true);
            alert('Login Successful')
        } catch (e) {
            alert('Login failed')
        }
    }

    if (redirect) {
        return <Navigate to={'/account'} />
    }

    return (
        <div className="mt-4  px-4 grow flex items-center justify-around">
            <div className="mb-64">
            <h1 className="text-3xl text-center mb-4" >Login</h1>
            <form className="max-w-md mx-auto" onSubmit={handleLogin}>
                <input type="email"
                    placeholder="youremail@email.com"
                    value={email}
                    onChange={ev => setEmail(ev.target.value)} />
                <input type="password"
                    placeholder="password"
                    value={password}
                    onChange={ev => setPassword(ev.target.value)} />
                <button className="primary">Login</button>
                <div className="text-center py-2 text-gray-500">
                    Don't hava an account yet? <Link className="underline text-black" to={'/register'}>Register now</Link></div>
            </form>
            </div>
        </div>
    )
}