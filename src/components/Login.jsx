import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios'
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/authSlice';
import SuccessToast from './SuccessToast';
import ErrorToast from './ErrorToast';
import { BASE_URL } from '../constants';

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [successMessage, setSuccessMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post(BASE_URL + "/auth/login", { email, password }, { withCredentials: true })
            dispatch(addUser(res.data.data.user))
            setSuccessMessage("Loggedin Successfully!!!")
            setTimeout(() => {
                navigate("/")
            }, 2000)
        } catch (error) {
            setErrorMessage(error.response.data)
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200">
            <SuccessToast
                message={successMessage}
                onClose={() => setSuccessMessage('')}
            />
            <ErrorToast
                message={errorMessage}
                onClose={() => setErrorMessage('')}
            />
            <div className="flex flex-col lg:flex-row items-center justify-center gap-12 p-4">

                {/* Left side - Branding */}
                <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold">
                        <span className="text-primary">Dev</span>Tinder
                    </h1>
                    <p className="py-6 text-lg max-w-md">
                        Where developers meet, collaborate, and build amazing things together.
                        Find your perfect coding partner today!
                    </p>

                    {/* Feature highlights */}
                    <div className="space-y-2">
                        <div className="badge badge-outline gap-2 p-3">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                            Match with skilled developers
                        </div>
                        <div className="badge badge-outline gap-2 p-3">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                            </svg>
                            Real-time chat
                        </div>
                        <div className="badge badge-outline gap-2 p-3">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 12H4a1 1 0 01-1-1V5a1 1 0 011-1h5a1 1 0 011 1v6a1 1 0 01-1 1zM16 18h-5a1 1 0 01-1-1v-6a1 1 0 011-1h5a1 1 0 011 1v6a1 1 0 01-1 1z" />
                            </svg>
                            Collaborate on projects
                        </div>
                    </div>
                </div>

                {/* Right side - Login Form */}
                <div className="card w-full max-w-sm shadow-2xl bg-base-100">
                    <div className="card-body">
                        <h2 className="card-title text-2xl font-bold text-center w-full">Welcome Back!</h2>
                        <p className="text-center text-base-content/60 mb-4">Login to continue your journey</p>

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            {/* Email Input */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <label className="input input-bordered flex items-center gap-2">
                                    <svg className="w-4 h-4 opacity-70" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="grow"
                                        placeholder="developer@example.com"
                                        required
                                    />
                                </label>
                            </div>

                            {/* Password Input */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Password</span>
                                </label>
                                <label className="input input-bordered flex items-center gap-2">
                                    <svg className="w-4 h-4 opacity-70" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="grow"
                                        placeholder="Enter password"
                                        required
                                    />
                                </label>
                            </div>

                            {/* Remember Me Checkbox */}
                            <div className="form-control">
                                <label className="label cursor-pointer justify-start gap-2">
                                    <input type="checkbox" className="checkbox checkbox-primary checkbox-sm" />
                                    <span className="label-text">Remember me</span>
                                </label>
                            </div>

                            {/* Login Button */}
                            <button type="submit" className="btn btn-primary w-full">
                                Login
                            </button>

                            {/* Error message placeholder */}
                            <div className="alert alert-error hidden">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <span>Invalid email or password</span>
                            </div>
                        </form>

                        {/* Sign up link */}
                        <div className="divider">New here?</div>

                        <p className="text-center">
                            Don't have an account yet?
                            <Link to="/signup" className="link link-primary font-semibold ml-1">
                                Sign up now
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;