import { useEffect } from 'react'
import { AUTH_TOKEN_KEY, EMAIL_KEY } from '../utils/app.constants'
import { useRouter } from 'next/router'
import { useState } from 'react';

export default function Home() {
  const router = useRouter()
  const [email, setEmail] = useState('');

  const onclick = () => {
    router.push('/upload')
  }
  const onclickFetch = ()=>{
    router.push('/fetchImage')
  }
  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY, null);
    if (!token) {
      router.push('/signup')
    }
    const email = localStorage.getItem(EMAIL_KEY, '');
    setEmail(email)
  }, [])
  return (
    <div className='container'>
      <div className='form-wrapper'>
        <h1 className='heading'>Hello, {email}</h1>
        <button className="primary-btn" onClick={onclick}>Upload File</button>
        <button className="primary-btn" onClick={onclickFetch}>FetchFile</button>
      </div>
    </div>
  )
}
