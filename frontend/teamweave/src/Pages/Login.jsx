import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiUser, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import Cookies from 'js-cookie'
import '../Styles/Auth.css'
import authImg from '../assets/auth.png'
import { handleLogin } from '../API/AuthAPI'

function Login() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    const validateForm = () => {
        const newErrors = {}
        
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required'
        }
        
        if (!formData.password) {
            newErrors.password = 'Password is required'
        }
        
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (validateForm()) {
            setIsLoading(true)
            try {
                // Call the handleLogin function directly
                await handleLogin(formData)
                console.log("Cookies: " + Cookies.get("jwtToken"))
                // Navigate to dashboard on successful login
                navigate('/')
            } catch (error) {
                setErrors({ general: 'Login failed. Please check your credentials.' })
            } finally {
                setIsLoading(false)
            }
        }
    }

    return (
        <div className="authContainer">
            <div className="authLayout">
                {/* Left Section - Image */}
                <div className="authImageSection">
                    <div className="authImageContent">
                        <img src={authImg}></img>
                    </div>
                </div>

                {/* Right Section - Form */}
                <div className="authFormSection">
                    <div className="authFormContainer">
                        <div className="authHeader">
                            <h2>Sign In</h2>
                            <p>Enter your credentials to access your account</p>
                        </div>

                        <form className="authForm" onSubmit={handleSubmit}>
                            {errors.general && (
                                <div className="errorMessage">
                                    {errors.general}
                                </div>
                            )}

                            <div className="formGroup">
                                <label htmlFor="username">Username</label>
                                <div className="inputContainer">
                                    <FiUser className="inputIcon" />
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        className={errors.username ? 'error' : ''}
                                        placeholder="Enter your username"
                                        required
                                    />
                                </div>
                                {errors.username && <span className="errorText">{errors.username}</span>}
                            </div>

                            <div className="formGroup">
                                <label htmlFor="password">Password</label>
                                <div className="inputContainer">
                                    <FiLock className="inputIcon" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className={errors.password ? 'error' : ''}
                                        placeholder="Enter your password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="passwordToggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                                {errors.password && <span className="errorText">{errors.password}</span>}
                            </div>

                            <div className="formOptions">
                                <label className="checkboxContainer">
                                    <input type="checkbox" />
                                    <span className="checkmark"></span>
                                    Remember me
                                </label>
                                <Link to="/forgot-password" className="forgotPassword">
                                    Forgot password?
                                </Link>
                            </div>

                            <button 
                                type="submit" 
                                className="authButton"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Signing in...' : 'Sign In'}
                            </button>

                            <div className="authFooter">
                                <p>
                                    Don't have an account? 
                                    <Link to="/register" className="authLink"> Sign up</Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
