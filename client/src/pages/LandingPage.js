import React, { useState, useEffect } from 'react';
import httpClient from '../httpClient';

const LandingPage = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const f = async () => {
            try {
                const resp = await httpClient.get("//localhost:5000/me");
                localStorage.setItem("role", resp.data.user_type)
                setUser(resp.data);

            } catch (e) {
                console.log("Not logged in");
            }
        };
        f();
    }, []);

    const handleLogout = async () => {
        await httpClient.post("//localhost:5000/logout");
        localStorage.removeItem("role");
        window.location.href = '/';
    }

    return (
        <div>
            <div class="collapse" id="navbarToggleExternalContent">
                <div class="bg-dark p-4">
                    <h5 class="text-white h4">Collapsed content</h5>
                    <span class="text-muted">Toggleable via the navbar brand.</span>
                </div>
            </div>
            <nav class="navbar navbar-dark bg-dark">
                <div class="container-fluid">
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                </div>
            </nav>
            
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

