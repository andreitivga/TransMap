import React, {useState} from 'react'
import httpClient from '../httpClient';


const RegisterPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userType, setUserType] = useState("");

    const handleClickRegister = async () => {

        if (email === "") {
            alert ("Please enter a email.");
            return;
        }
        if (password === "") {
            alert ("Please enter a password.");
            return;
        }
        if (userType === "") {
            alert ("Please select user type.");
            return;
        }

        try {
            const resp = await httpClient.post("//localhost:5000/register", {
                "email": email,
                "password" : password,
                "user_type" : userType
            });
    
            console.log(resp.status);
            window.location.href ='/register_succesful';
            
        } catch(e) {
            console.log(e);
            if(e.response.status === 409) {
                alert("Username already exists");
            }
        }
    };

    return (
        <div>
            <h1>Register!</h1>
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

                <div>
                    <label>Choose user type:</label>
                    <select className="form-select" 
                    aria-label="Default select example"
                    onChange={(e) => setUserType(e.target.value)}>
                        <option value="">Select</option>
                        <option value="client">Client</option>
                        <option value="carrier">Carrier</option>
                    </select>
                </div>

                <button className="btn btn-primary" type="button" onClick={handleClickRegister}>Register</button>
            </form>
        </div>
    )
}

export default RegisterPage
