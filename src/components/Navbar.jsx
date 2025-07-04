import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios"
import { removeUser } from '../utils/authSlice';
import { BASE_URL } from '../constants';

const Navbar = () => {
    const dispatch = useDispatch()
    const user = useSelector((store) => store.auth?.user);
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await axios.get(BASE_URL + "/auth/logout", { withCredentials: true })
            dispatch(removeUser())
            navigate("/home")
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="navbar bg-gradient-to-r from-base-100 to-base-200 shadow-xl backdrop-blur-lg border-b border-base-300">
            {/* Left side - Logo */}
            <div className="navbar-start">
                <Link to="/feed" className="btn btn-ghost text-xl font-bold hover:scale-105 transition-transform duration-200">
                    <div className="flex items-center gap-2">
                        <div className="text-2xl font-bold">
                            <span className="text-primary">Dev</span><span className="text-secondary">Tinder</span>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Center - Navigation Links */}
            {user && (
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1 gap-2">
                        <li>
                            <Link to="/feed" className="btn btn-ghost btn-sm hover:btn-primary hover:text-primary-content transition-all duration-200 rounded-xl">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                Discover
                            </Link>
                        </li>
                        <li>
                            <Link to="/connections" className="btn btn-ghost btn-sm hover:btn-primary hover:text-primary-content transition-all duration-200 rounded-xl">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                                Connections
                            </Link>
                        </li>
                        <li>
                            <Link to="/requests" className="btn btn-ghost btn-sm hover:btn-primary hover:text-primary-content transition-all duration-200 rounded-xl">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                Requests
                            </Link>
                        </li>
                        <li>
                            <Link to="/saved" className="btn btn-ghost btn-sm hover:btn-primary hover:text-primary-content transition-all duration-200 rounded-xl">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                Liked
                            </Link>
                        </li>
                        <li>
                            <Link to="/chat" className="btn btn-ghost btn-sm hover:btn-primary hover:text-primary-content transition-all duration-200 rounded-xl">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                Messages
                            </Link>
                        </li>
                    </ul>
                </div>
            )}

            {/* Right side - User section */}
            <div className="navbar-end">
                <div className="flex items-center gap-4">
                    {/* Welcome message with notification badge */}
                    <div className="hidden sm:flex items-center gap-2">
                        <span className="text-sm text-base-content/70">
                            Welcome back,
                        </span>
                        <span className="font-semibold text-primary">
                            {user.firstName}
                        </span>
                    </div>

                    {/* Profile dropdown */}
                    <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost btn-circle avatar hover:scale-105 transition-transform duration-200">
                            <div className="w-10 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-100">
                                <img
                                    src={user.photoUrl}
                                    alt={user.firstName}
                                    className="rounded-full"
                                />
                            </div>
                        </label>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-2xl bg-base-100 rounded-2xl w-56 border border-base-300">
                            <li className="menu-title px-4 py-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full overflow-hidden">
                                        <img
                                            src={user.photoUrl}
                                            alt={user.firstName}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <span className="font-semibold text-base-content">
                                            {user.firstName} {user.lastName}
                                        </span>
                                        <span className="text-xs text-base-content/60 block">
                                            Developer
                                        </span>
                                    </div>
                                </div>
                            </li>
                            <div className="divider my-1"></div>
                            <li>
                                <Link to="/edit" className="hover:bg-primary hover:text-primary-content transition-colors duration-200 rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Edit Profile
                                </Link>
                            </li>
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className="hover:bg-error hover:text-error-content transition-colors duration-200 rounded-lg"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;