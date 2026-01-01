import axios from 'axios'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'

// const base_url = "http://localhost:8081/auth"
// const base_url_verify = "http://localhost:8081/verification"

const base_url = "https://auth-service-zq2s.onrender.com/auth"
const base_url_verify = "https://auth-service-zq2s.onrender.com/verification"

export const handleLogin = async (LoginDetails) => {
    console.log("logindetails", LoginDetails)
    try {
        const response = await axios.post(base_url + "/login", LoginDetails)
        console.log("response", response.data)

        if (response.data.response && response.data.response.token) {
            // Check if email is verified
            // if (response.data.response.emailVerified) {
            // Set cookie with 10 hours expiration
            Cookies.set('jwtToken', response.data.response.token, {
                expires: 10 / 24,
                path: '/',
                sameSite: 'Lax'
            })
            console.log("Cookie set successfully:", Cookies.get('jwtToken'))
            return { success: true, message: "Login successful", data: response.data.response }
            // } else {
            //     throw new Error("Email not verified")
            // }
        } else {
            throw new Error("Login failed - no token received")
        }

    } catch (error) {
        console.log("Login error:", error)
        throw error
    }
}

export const handleRegister = async (RegisterDetails) => {
    console.log("registerdetails", RegisterDetails)
    try {

        const response = await axios.post(base_url + "/register", RegisterDetails)
        console.log("response", response.data)
        return response.data

    } catch (error) {
        console.log("error", error)
        throw error
    }
}

export const handleLogout = (toast, navigate) => {
    try {
        Cookies.remove('jwtToken')
        toast.success("Logged out successfully")
        navigate('/login')
    } catch (error) {
        toast.error("Logout failed")
        console.log("error", error)
    }
}

export const getToken = () => {
    return Cookies.get('jwtToken')
}

export const isAuthenticated = () => {
    const token = getToken()
    return token !== undefined && token !== null
}

export const resendVerification = async (email) => {
    try {
        const response = await axios.get(base_url + '/resendverification', { params: { email } })
        return response.data
    } catch (err) {
        console.error('resendVerification error', err)
        throw err
    }
}

export const getUserDetailsFromToken = async (id) => {
    try {
        const response = await axios.get(base_url + '/getUser', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${Cookies.get("jwtToken")}`
            },
            params: { id }  // <-- send taskId as query param
        })
        return response.data
    } catch (err) {
        console.error('resendVerification error', err)
        throw err
    }
}

// export const getOpt = async (username)=>{
//     try {
//         const response = await axios.get(base_url + '/forgotpassword', {
//             params: { username }  // <-- send taskId as query param
//         })
//         return response.data
//     } catch (err) {
//         console.error('forgotpassword error', err)
//         throw err
//     }
// }

// New helper - request OTP for password reset (keeps existing GET behavior)
export const requestPasswordOtp = async (username) => {
    try {
        const response = await axios.get(base_url + '/forgotpassword', {
            params: { username }
        })
        return response.data
    } catch (err) {
        console.error('requestPasswordOtp error', err)
        throw err
    }
}

// New helper - reset password with OTP. Backend endpoint expected at POST /resetpassword
export const resetPasswordWithOtp = async ({ username, otp, newPassword }) => {
    try {
        const response = await axios.get(base_url_verify + '/verifyotp', {
            params: {
                username: username,
                otp: otp,
                password: newPassword
            }
        })
        return response.data
    } catch (err) {
        console.error('resetPasswordWithOtp error', err)
        throw err
    }
}