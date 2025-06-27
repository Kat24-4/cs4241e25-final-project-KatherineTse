import { useState } from 'react';
import App from './App';

function Login() {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [message, setMessage] = useState('');

    const [hideLogin, setHideLogin] = useState(false);
    const [hideCreate, setHideCreate] = useState(true);


    async function login(event) {
        event.preventDefault();

        const json = {username: username, password: password},
            body = JSON.stringify(json);

        const response = await fetch('/api/login', {
            method: 'POST',
            body
        })

        const result = await response.text()

        const message = JSON.parse(result)

        if (message === "success") {
            setLoggedIn(true);
        } else if (message === "No User") {
            setMessage("No User Found! Please try again or create an account.")
        } else if (message === "Incorrect password") {
            setMessage("Incorrect Password! Login Failed. Please try again.")
        } else if (message === "Login Failed") {
            setMessage("Login failed! Please try again.")
        }

        setUsername('');
        setPassword('');
    }

    async function createAccount(event) {
        event.preventDefault();

        if (password === confirmPassword) {
            const json = {firstName: firstName, lastName: lastName, username: username, password: password},
                body = JSON.stringify(json);

            const response = await fetch('/api/create', {
                method: 'POST',
                body
            })

            const result = await response.text()

            const message = JSON.parse(result)

            if (message === "success") {
                setLoggedIn(true);
            } else if (message === "Creation Failure") {
                setMessage("Account creation failed! Please try again.")
            } else if (message === "Already user") {
                setMessage("Username already taken! Please try again or log in.")
            } else if (message === "Missing Info") {
                setMessage("Missing Information! PLease try again.")
            } else {
                setMessage("An error occurred. Please try again.")
            }

        } else {
            setMessage("Passwords do not match! Please try again.")
        }
    }

    const swapForm = (form) => {
        if (form === "login") {
            setHideLogin(false);
            setHideCreate(true);
        } else if (form === "create") {
            setHideCreate(false);
            setHideLogin(true);
        }
    }

    return <div>{ loggedIn ? <App /> :
        <main className="flex-col">
            <p className="text-center text-[22px] mt-3 mb-6">Welcome to your personal score tracker! <br/><strong>Please log in to access your
                score data.</strong></p>

            <div className={'flex justify-center justify-items-center'}>
                <form id="login" className="bg-yellow-400/25 p-3 rounded-xl" hidden={hideLogin}>

                    <h2 className={'font-bold text-[24px] pb-1'}>Login Form</h2>
                    <p className={'mb-3'}>Please enter your username <br/>and password for the site.</p>

                    <label htmlFor="username">Username:</label><br/>
                    <input id="username" type='text' className="mt-1 mb-4 ms-2 border-1 rounded-md p-1 bg-yellow-50 focus:outline-[#001CB6]" name='username' value={ username } onChange={ (e) => setUsername(e.target.value)  }/><br/>

                    <label htmlFor="password">Password:</label><br/>
                    <input id="password" type='password' className="mt-1 mb-4 ms-2 border-1 rounded-md p-1 bg-yellow-50 focus:outline-[#001CB6]" name='password' value={ password } onChange={ (e) => setPassword(e.target.value) }/><br/>

                    <button id="loginSubmit" type="submit" className="mb-2 p-2 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-700" onClick={login}>Login</button>
                    <p className={"mt-1"}>Need an Account? <button type={"button"} id="openCreate" className={'ps-1 text-blue-600 underline hover:no-underline'} onClick={() => swapForm("create")}>Sign Up</button></p>
                </form>
            </div>

            <div className="flex justify-center justify-items-center">
                <form id="createUser" className="bg-yellow-400/25 p-3 rounded-xl" hidden={hideCreate}>
                    <h2 className={'font-bold text-[24px] pb-1'}>Create Account</h2>

                    <label htmlFor="firstName">First Name:</label><br />
                    <input id="firstName" type={'text'} className={'mt-1 mb-4 ms-2 border-1 rounded-md p-1 bg-yellow-50 focus:outline-[#001CB6]'} name={'firstName'} value={ firstName } onChange={ (e) => setFirstName(e.target.value) }/><br/>

                    <label htmlFor="lastName">Last Name:</label><br />
                    <input id="lastName" type={'text'} className={'mt-1 mb-4 ms-2 border-1 rounded-md p-1 bg-yellow-50 focus:outline-[#001CB6]'} name={'lastName'} value={ lastName } onChange={ (e) => setLastName(e.target.value) }/><br/>

                    <label htmlFor="newUsername">Username:</label><br/>
                    <input id="newUsername" type='text' className="mt-1 mb-4 ms-2 border-1 rounded-md p-1 bg-yellow-50 focus:outline-[#001CB6]" name='username' value={ username } onChange={ (e) => setUsername(e.target.value)  }/><br/>

                    <label htmlFor="newPassword">Password:</label><br/>
                    <input id="newPassword" type='password' className="mt-1 mb-4 ms-2 border-1 rounded-md p-1 bg-yellow-50 focus:outline-[#001CB6]" name='password' value={ password } onChange={ (e) => setPassword(e.target.value) }/><br/>

                    <label htmlFor="confirmPassword">Confirm Password:</label><br/>
                    <input id="confirmPassword" type='password' className="mt-1 mb-4 ms-2 border-1 rounded-md p-1 bg-yellow-50 focus:outline-[#001CB6]" name='password' value={ confirmPassword } onChange={ (e) => setConfirmPassword(e.target.value) }/><br/>

                    <button id="createSubmit" type="submit" className="p-2 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-700" onClick={createAccount}>Login</button>
                    <p className={"mt-2"}>Have an Account? <button type="button" id="openLogin" className={'ps-1 text-blue-600 underline hover:no-underline'} onClick={() => swapForm("login")}>Login</button></p>
                </form>
            </div>


            <div id="message" className="text-center text-red-700 mt-3">
                <p>{message}</p>
            </div>

        </main>
    }</div>;
}

export default Login;