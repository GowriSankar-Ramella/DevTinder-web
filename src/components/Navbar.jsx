import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios"
import { removeUser } from '../utils/authSlice';

const Navbar = () => {
    const dispatch = useDispatch()
    const user = useSelector((store) => store.auth?.user);
    const navigate = useNavigate()
    const handleLogout = async () => {
        try {
            await axios.get("http://localhost:3000/auth/logout", { withCredentials: true })
            dispatch(removeUser())
            navigate("/home")
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className="navbar bg-base-100 shadow-lg">
            {/* Left side - Logo */}
            <div className="navbar-start">
                <Link to="/feed" className="btn btn-ghost text-xl">
                    <span className="text-primary">Dev</span>Tinder
                </Link>
            </div>

            {/* Center - Navigation Links */}
            {user && (
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        <li><Link to="/feed">Discover</Link></li>
                        <li><Link to="/connections">Connections</Link></li>
                        <li><Link to="/requests">Requests</Link></li>
                        <li><Link to="/saved">Liked</Link></li>
                    </ul>
                </div>
            )}

            {/* Right side - Conditional rendering based on auth */}
            <div className="navbar-end">
                <div className="flex items-center gap-4">
                    {/* Welcome message */}
                    <span className="hidden sm:inline-block text-sm">
                        Welcome, <span className="font-semibold">{user.firstName}</span>
                    </span>

                    {/* Profile dropdown */}
                    <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <img
                                    src={user.photoUrl}
                                    alt={user.firstName}
                                />
                            </div>
                        </label>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                            <li className="menu-title">
                                <span>{user.firstName} {user.lastName}</span>
                            </li>
                            <li><Link to="/edit">My Profile</Link></li>
                            <li><button onClick={handleLogout}>Logout</button></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;