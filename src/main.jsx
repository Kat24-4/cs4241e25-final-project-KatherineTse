import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css';
import App from './App.jsx'
import Login from './Login.jsx'
import Header from './Header.jsx'

let loggedIn;

async function checkLogin() {
    const response = await fetch('/api/checkLogin', {
        method: 'GET'
    })

    const result = await response.json();

    loggedIn = result.loggedIn;
}

const root = createRoot(document.getElementById('root'))
checkLogin()
    .then ( () => {
        if (loggedIn) {
            root.render(
                <StrictMode>
                    <Header />
                    <App/>
                </StrictMode>,
            )
        } else {
            root.render(
                <StrictMode>
                    <Header />
                    <Login/>
                </StrictMode>,
            )
        }
    })

