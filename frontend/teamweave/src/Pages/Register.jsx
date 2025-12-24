import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiUser, FiLock, FiMail, FiEye, FiEyeOff } from 'react-icons/fi'
import '../Styles/Auth.css'
import authImg from '../assets/auth.png'
import { useDispatch } from 'react-redux'
import { handleRegister } from '../API/AuthAPI'

function Register() {
    const navigate = useNavigate()
    const dispatch = useDispatch()


    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: "USER"
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
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters'
        }
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address'
        }
        
        if (!formData.password) {
            newErrors.password = 'Password is required'
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
        }
        
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (validateForm()) {
            setIsLoading(true)
            try {
                // Here you would make your API call
                // For now, we'll simulate a registration
                const reponce = await handleRegister(formData);
                console.log(reponce)
                // Navigate to login on successful registration
                navigate(`/verify?email=${formData.email}`)
            } catch (error) {
                setErrors({ general: 'Registration failed. Please try again.' })
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
                            <h2>Create Account</h2>
                            <p>Fill in your information to get started</p>
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
                                        placeholder="Choose a username"
                                        required
                                    />
                                </div>
                                {errors.username && <span className="errorText">{errors.username}</span>}
                            </div>

                            <div className="formGroup">
                                <label htmlFor="email">Email</label>
                                <div className="inputContainer">
                                    <FiMail className="inputIcon" />
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={errors.email ? 'error' : ''}
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                                {errors.email && <span className="errorText">{errors.email}</span>}
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
                                        placeholder="Create a password"
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
                                    <input type="checkbox" required />
                                    <span className="checkmark"></span>
                                    I agree to the <Link to="/terms" className="authLink">Terms of Service</Link> and <Link to="/privacy" className="authLink">Privacy Policy</Link>
                                </label>
                            </div>

                            <button 
                                type="submit" 
                                className="authButton"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Creating account...' : 'Create Account'}
                            </button>

                            <div className="authFooter">
                                <p>
                                    Already have an account? 
                                    <Link to="/login" className="authLink"> Sign in</Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register
