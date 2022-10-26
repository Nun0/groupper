import  { Button }  from '@material-ui/core';
import React from 'react'
import './styles/Login.css';
import { auth, provider, signup, useAuth } from '../firebase';
import { Google } from '@mui/icons-material';


const Login = () => {

    async function handleSignup (){
        try {
            signup(auth,provider);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
        <div className="login">
            <div className='login__wrapper'>
                <div className="login__logo">
                    <h1><img src="./logo.svg" alt="logo" />Groupper</h1>
                </div>
                <p>Start chatting now!</p>
                <Google />
                <Button onClick={handleSignup}><span>Sign in with Google</span></Button>
            </div>
        </div>
        </>
    )
}

export default Login
