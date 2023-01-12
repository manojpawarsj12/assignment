import axios from "axios"
import { useState } from "react"
import { useRouter } from 'next/router'

export default function signup() {
    const [username, setUsername] = useState("")
    const [password, setpassword] = useState("")
    const router = useRouter()

    async function onSubmit(event) {
        event.preventDefault()
        if (username && password) {
            const loginRes = await axios.post("http://localhost:3001/signup", {
                email: username,
                password: password
            })
            // TODO: error handling
            router.push('/login')
        }
    }
    return (
        <div className="container">
            <form onSubmit={onSubmit} className="form-wrapper">
                <input className="input-field" type="email" placeholder="Enter your email" value={username} onChange={e => setUsername(e.target.value)} />
                <input className="input-field" type="password" placeholder="Enter your password" value={password} onChange={e => setpassword(e.target.value)} />
                <button type="submit" className='primary-btn'>Sign up</button>
            </form>
        </div>
    )
}