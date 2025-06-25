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
        <main className="d-flex flex-column">
            <p className="m-auto mb-2 h5">Welcome to your personal score tracker! <br/><strong>Please log in to access your
                score data.</strong></p>
            <p className="m-auto mb-3">If you do not have an account, enter a username and password and an account will be
                created for you.</p>

            <form id="login" action='/login' method='POST' className="m-auto bg-warning bg-opacity-25 p-4 rounded-2">

                <h2>Login Form</h2>
                <p>Please enter your username <br/>and password for the site.</p>

                <label htmlFor="username">Username:</label><br/>
                <input id="username" type='text' className="mt-1 mb-4 ms-2" name='username' value={ username } onChange={ (e) => setUsername(e.target.value)  }/><br/>
                <label htmlFor="password">Password:</label><br/>
                <input id="password" type='password' className="mt-1 mb-4 ms-2" name='password' value={ password } onChange={ (e) => setPassword(e.target.value) }/><br/>
                <button id="loginSubmit" type="submit" className="btn btn-primary" onClick={login}>Login</button>
            </form>

            <div id="message" className="m-auto text-danger mt-1">
                <p>{message}</p>
            </div>

        </main>
    }</div>;
}

export default Login;