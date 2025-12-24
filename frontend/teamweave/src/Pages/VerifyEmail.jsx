import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import '../Styles/VerifyEmail.css'
import { resendVerification } from '../API/AuthAPI'

export default function VerifyEmail(){
  const location = useLocation()
  const navigate = useNavigate()
  const params = new URLSearchParams(location.search)
  const initialEmail = params.get('email') || ''

  const [email, setEmail] = useState(initialEmail)
  const [loading, setLoading] = useState(false)

  const handleResend = async ()=>{
    if(!email) return alert('Please enter your email')
    try{
      setLoading(true)
      const res = await resendVerification(email)
      setLoading(false)
      if(res){
        alert(res)
      } else {
        alert('Failed to resend verification. Please try again later.')
        console.log(res)
      }
    }catch(e){
      setLoading(false)
      console.error(e)
      alert('Error sending verification. Check console for details.')
    }
  }

  return (
    <div className="verify-page">
      <div className="verify-card">
        <h2>Verify your email</h2>
        <p>Please check your inbox for a verification mail. Click the button below to resend the verification email.</p>

        <label className="verify-label">Email address</label>
        <input disabled className="verify-input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" />

        <div className="verify-actions">
          <button className="btn-primary" onClick={handleResend} disabled={loading}>{loading ? 'Sending...' : 'Resend verification email'}</button>
          <button className="btn-secondary" onClick={()=>navigate('/login')}>Back to Login</button>
        </div>
      </div>
    </div>
  )
}
