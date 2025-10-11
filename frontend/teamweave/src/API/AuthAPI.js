import axios from 'axios'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'

const base_url = "http://localhost:8081/auth"


export const handleLogin = async (LoginDetails) => {
    console.log("logindetails", LoginDetails)
    try {
        const response = await axios.post(base_url + "/login", LoginDetails)
        console.log("response", response.data)
        
        if (response.data.response && response.data.response.token) {
            // Check if email is verified
            if (response.data.response.emailVerified) {
                // Set cookie with 10 hours expiration
                Cookies.set('jwtToken', response.data.response.token, { 
                    expires: 10/24,
                    path: '/',
                    sameSite: 'Lax'
                })
                console.log("Cookie set successfully:", Cookies.get('jwtToken'))
                return { success: true, message: "Login successful", data: response.data.response }
            } else {
                throw new Error("Email not verified")
            }
        } else {
            throw new Error("Login failed - no token received")
        }
        
    } catch (error) {
        console.log("Login error:", error)
        throw error
    }
}

export const handleRegister = async (RegisterDetails, setLoader, toast, navigate) => {
    console.log("registerdetails", RegisterDetails)
    try {
        setLoader(true)
        const response = await axios.post(base_url + "/register", RegisterDetails)
        console.log("response", response.data)
        
        if (response.data.success) {
            toast.success("Registration successful")
            setLoader(false)
            navigate('/login')
        } else {
            setLoader(false)
            toast.error("Registration failed")
        }
        
    } catch (error) {
        setLoader(false)
        toast.error("Registration failed - please try again")
        console.log("error", error)
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