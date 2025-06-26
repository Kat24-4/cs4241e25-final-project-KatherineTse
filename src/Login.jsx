import { useState } from 'react';
import App from './App';

function Login() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [message, setMessage] = useState('');

    async function login(event) {
        event.preventDefault();

        const json = {username: username, password: password};
        const body = JSON.stringify(json);

        const response = await fetch('/api/login', {
            method: 'POST',
            body
        })

        const result = await response.text()

        const message = JSON.parse(result)

        if (message === "success") {
            setLoggedIn(true);
        } else if (message === "Creation Failure") {
            setMessage("Account creation failed! Please try again.")
        } else if (message === "Incorrect password") {
            setMessage("Incorrect Password! Login Failed. Please try again.")
        } else if (message === "Login Failed") {
            setMessage("Login failed! Please try again.")
        }

        setUsername('');
        setPassword('');
    }

    return <div>{ loggedIn ? <App /> :
        <main className="flex-col">
            <p className="text-center text-[22px] mt-3 mb-6">Welcome to your personal score tracker! <br/><strong>Please log in to access your
                score data.</strong></p>

            <div className={'flex justify-center justify-items-center'}>
                <form id="login" action='/login' method='POST' className="bg-yellow-400/25 p-3 rounded-xl">

                    <h2 className={'font-bold text-[24px] pb-1'}>Login Form</h2>
                    <p className={'mb-3'}>Please enter your username <br/>and password for the site.</p>

                    <label htmlFor="username">Username:</label><br/>
                    <input id="username" type='text' className="mt-1 mb-4 ms-2 border-1 rounded-md p-1 bg-yellow-50 focus:outline-[#001CB6]" name='username' value={ username } onChange={ (e) => setUsername(e.target.value)  }/><br/>
                    <label htmlFor="password">Password:</label><br/>
                    <input id="password" type='password' className="mt-1 mb-4 ms-2 border-1 rounded-md p-1 bg-yellow-50 focus:outline-[#001CB6]" name='password' value={ password } onChange={ (e) => setPassword(e.target.value) }/><br/>
                    <button id="loginSubmit" type="submit" className="p-2 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-700" onClick={login}>Login</button>
                </form>
            </div>

            <div id="message" className="text-center text-red-700 mt-3">
                <p>{message}</p>
            </div>

        </main>
    }</div>;
}

export default Login;