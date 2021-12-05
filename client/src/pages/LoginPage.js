import React, {useState} from 'react'
import httpClient from '../httpClient';

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const logInUser = async () => {
        if (email === "") {
            alert ("Please enter a email.");
            return;
        }
        if (password === "") {
            alert ("Please enter a password.");
            return;
        }

        try {
            const resp = await httpClient.post("//localhost:5000/login", {
                "email": email,
                "password" : password,
            });
    
            console.log(resp.status);
            window.location.href ='/';
        } catch(e) {
            if(e.response.status === 400) {
                alert("Invalid credentials!");
            }
        }
    };

    return (
        <div>
            <h1>Login into your account!</h1>
            <form>
                <div>
                    <label>Email:</label>
                    <input 
                        type='text' 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        ></input>
                </div>
                
                <div>
                    <label>Password:</label>
                    <input 
                        type='password' 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        ></input>
                </div>
                <button className="btn btn-primary" type="button" onClick={() => logInUser()}>Submit</button>
            </form>
        </div>
    )
}

export default LoginPage
