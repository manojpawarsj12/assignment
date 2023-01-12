import axios from "axios"
import { useState } from "react"
import { useRouter } from 'next/router'
import { AUTH_TOKEN_KEY, EMAIL_KEY } from '../utils/app.constants'
export default function Login() {
    const [username, setUsername] = useState("")
    const [err, setErr] = useState(null)
    const [password, setpassword] = useState("")
    const router = useRouter()
    const onclickLogin = () => {
        router.push('/signup')
    }
    async function onSubmit(event) {
        event.preventDefault()
        if (username && password) {
            try {
                const loginRes = await axios.post("http://localhost:3001/login", {
                    email: username,
                    password: password
                })
                console.log(loginRes)
                if (loginRes) {
                    localStorage.setItem(AUTH_TOKEN_KEY, loginRes.data.token);
                    localStorage.setItem(EMAIL_KEY, loginRes.data?.data?.email);
                    router.push('/')
                } else {
                    router.push('/signup')
                }
            } catch (err) {
                console.log(err)
                if (err.response) {
                    setErr(err.response.data.message)
                }
            }
        }
    }
    return (

        <div>

            <div className="container">
                <form onSubmit={onSubmit} className="form-wrapper">
                    <input className="input-field" type="email" placeholder="Enter your email" value={username} onChange={e => setUsername(e.target.value)} />
                    <input className="input-field" type="password" placeholder="Enter your password" value={password} onChange={e => setpassword(e.target.value)} />
                    <button type="submit" className="primary-btn">Log in</button>
                    <button className="primary-btn" onClick={onclickLogin}>signup</button>
                </form>

            </div>
            {err ? (<h1>{err}</h1>): ""}
        </div>
    )
}