import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Login from './Login.jsx'

let loggedIn;

async function checkLogin() {
    const response = await fetch('/api/checkLogin', {
        method: 'GET'
    })

    const result = await response.json();

    console.log(result.loggedIn)

    loggedIn = result.loggedIn;
}

const root = createRoot(document.getElementById('root'))
checkLogin()
    .then ( () => {
        console.log(loggedIn);
        if (loggedIn) {
            root.render(
                <StrictMode>
                    <App/>
                </StrictMode>,
            )
        } else {
            root.render(
                <StrictMode>
                    <Login/>
                </StrictMode>,
            )
        }
    })

