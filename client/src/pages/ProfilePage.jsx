import { useContext, useState } from "react";
import { UserContext } from "../parts/UserContext";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage";
import AccountNav from "../parts/AccountNav";

export default function ProfilePage() {
    const [redirect, setRedirect] = useState(null);
    const { ready, user, setUser } = useContext(UserContext);
    let { subpage } = useParams();

    if (subpage === undefined) {
        subpage = 'profile';
    }

    async function Logout() {
        await axios.post("/logout");
        setRedirect('/');
        setUser(null);
    }

    if (!ready) {
        return "Landing";
    }

    if (ready && !user && !redirect) {
        return <Navigate to={'/login'} />
    }

    if (redirect) {
        return <Navigate to={redirect} />
    }

    return (
        <div className="px-4">
            <AccountNav />
            { subpage === 'profile' && (
                    <div className="text-center gap-8 max-w-lg mx-auto">
                        Logged in as {user?.name} ({user?.email}) <br />
                        <button onClick={Logout}
                        className="primary max-w-sm mt-4">Logout</button>
                    </div>
                )
            }
            {subpage === 'places' && (
                    <PlacesPage />
             )}
        </div>
    );
}