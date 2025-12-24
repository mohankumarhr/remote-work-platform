import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../Styles/ForgotPassword.css'
import { requestPasswordOtp, resetPasswordWithOtp } from '../API/AuthAPI'
import { toast } from 'react-toastify'

function ForgotPassword(){
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [loading, setLoading] = useState(false)
    const [otpRequested, setOtpRequested] = useState(false)
    const [otp, setOtp] = useState('')
    const [newPassword, setNewPassword] = useState('')

    const handleRequestOtp = async (e) => {
        e.preventDefault()
        if (!username.trim()){
            toast.error('Please enter your username')
            return
        }
        setLoading(true)
        try{
            const res = await requestPasswordOtp(username)
            // Expect backend to return success message
            toast.success(res?.message || 'OTP sent to your registered email')
            setOtpRequested(true)
        }catch(err){
            console.error('request OTP error', err)
            toast.error(err?.response?.data?.message || 'Failed to request OTP')
        }finally{
            setLoading(false)
        }
    }

    const handleChangePassword = async (e) => {
        e.preventDefault()
        if (!otp.trim() || !newPassword){
            toast.error('Please enter OTP and a new password')
            return
        }
        setLoading(true)
        try{
            const res = await resetPasswordWithOtp({ username, otp, newPassword })
            toast.success(res?.message || 'Password changed successfully')
            navigate('/login')
        }catch(err){
            console.error('reset password error', err)
            toast.error(err?.response?.data?.message || 'Failed to change password')
        }finally{
            setLoading(false)
        }
    }

    return (
        <div className="forgotContainer">
            <div className="forgotCard">
                <h2>Forgot Password</h2>
                {!otpRequested ? (
                    <form onSubmit={handleRequestOtp} className="forgotForm">
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder="Enter your username"
                        />

                        <button type="submit" className="primaryButton" disabled={loading}>
                            {loading ? 'Please wait...' : 'Get OTP'}
                        </button>

                        <div className="helperRow">
                            <button type="button" className="linkButton" onClick={() => navigate('/login')}>Back to login</button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleChangePassword} className="forgotForm">
                        <label>OTP</label>
                        <input
                            type="text"
                            value={otp}
                            onChange={e => setOtp(e.target.value)}
                            placeholder="Enter the OTP"
                        />

                        <label>New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                        />

                        <button type="submit" className="primaryButton" disabled={loading}>
                            {loading ? 'Please wait...' : 'Change Password'}
                        </button>

                        <div className="helperRow">
                            <button type="button" className="linkButton" onClick={() => setOtpRequested(false)}>Request OTP again</button>
                            <button type="button" className="linkButton" onClick={() => navigate('/login')}>Back to login</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}

export default ForgotPassword
