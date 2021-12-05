import React, {useState, useEffect} from 'react';
import httpClient from '../httpClient';

const LandingPage = () => {
    const [user, setUser] = useState(null);

    useEffect( () => {
        const f = async () => {
            try {
                const resp = await httpClient.get("//localhost:5000/me");
                setUser(resp.data);

            } catch(e) {
                console.log("Not logged in");
            }
        };
        f();
    }, []);

    const handleLogout = async () => {
        await httpClient.post("//localhost:5000/logout");
        window.location.href = '/';
    }

    return (
        <div>
            <h1>Welcome to this React Application.</h1>

            {user != null ? (
                <div>
                    <h1>You are logged in!</h1>
                    <h2>Your id: {user.id}</h2>
                    <h2>Your email: {user.email}</h2>
                    <h2>Your user type: {user.user_type}</h2>
                    <button className="btn btn-primary" type='button' onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <div>
                    <p>You are not logged in!</p>
                    <div>
                        <a href="/login"><button className="btn btn-primary">Login</button></a>
                        <a href="/register"><button className="btn btn-primary">Register</button></a>
                    </div>
                </div>
                
            )}

        </div>
    )
}

export default LandingPage

