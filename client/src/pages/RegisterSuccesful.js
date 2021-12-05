import React from 'react'

const RegisterSuccesful = () => {

    const handleClick = () => {
        window.location.href = '/login'
    }
    return (
        <div>
            <h1>Register succesful. You must login to use the app.</h1>
            <button className="btn btn-primary" 
            type="button" 
            onClick={handleClick}>Go to login</button>
        </div>
    )
}

export default RegisterSuccesful


