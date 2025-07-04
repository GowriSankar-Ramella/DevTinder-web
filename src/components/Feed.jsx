import axios from "axios";
import { Briefcase, Code, Github, Heart, Linkedin, Mail, MapPin, Search, Star, User, Users, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFeed, removeuser } from "../utils/feedSlice";
import SuccessToast from "./SuccessToast";
import ErrorToast from "./ErrorToast";
import { BASE_URL } from "../constants";

const TinderCard = () => {
    const [showPreviewDetails, setShowPreviewDetails] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [rotation, setRotation] = useState(0);
    const cardRef = useRef(null);
    const startPos = useRef({ x: 0, y: 0 });
    const dispatch = useDispatch()
    const [successMessage, setSuccessMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const feed = useSelector(store => store.feed)

    const handleMouseDown = (e) => {
        setIsDragging(true);
        startPos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;

        const deltaX = e.clientX - startPos.current.x;
        const deltaY = e.clientY - startPos.current.y;

        setDragOffset({ x: deltaX, y: deltaY });
        setRotation(deltaX * 0.1);
    };

    const handleMouseUp = (e) => {
        if (!isDragging) return;

        const deltaX = e.clientX - startPos.current.x;

        if (Math.abs(deltaX) > 150) {
            if (deltaX > 0) {
                handleLike();
            } else {
                handlePass();
            }
        } else {
            setDragOffset({ x: 0, y: 0 });
            setRotation(0);
        }

        setIsDragging(false);
    };

    const handleLike = async () => {
        try {
            await axios.post(`${BASE_URL}/request/send/interested/${user._id}`, {}, { withCredentials: true })
            setSuccessMessage("Connection request sent!!")
            setDragOffset({ x: 400, y: -100 });
            setRotation(30);
            setTimeout(() => {
                // Reset card position after animation
                dispatch(removeuser(user._id))
                setDragOffset({ x: 0, y: 0 });
                setRotation(0);
            }, 500);
        } catch (error) {
            setErrorMessage(error.response.data)
        }
    };

    const handlePass = async () => {
        try {
            await axios.post(`${BASE_URL}/request/send/ignored/${user._id}`, {}, { withCredentials: true })
            setSuccessMessage("Connection Ignored!!")
            setDragOffset({ x: -400, y: -100 });
            setRotation(30);
            setTimeout(() => {
                // Reset card position after animation
                dispatch(removeuser(user._id))
                setDragOffset({ x: 0, y: 0 });
                setRotation(0);
            }, 500);
        } catch (error) {
            setErrorMessage(error.response.data)
        }
    };

    const handleSuperLike = async () => {
        try {
            await axios.post(`${BASE_URL}/request/send/saved/${user._id}`, {}, { withCredentials: true })
            setSuccessMessage("Connection Liked!!")
            setDragOffset({ x: 0, y: -400 });
            setRotation(30);
            setTimeout(() => {
                // Reset card position after animation
                dispatch(removeuser(user._id))
                setDragOffset({ x: 0, y: 0 });
                setRotation(0);
            }, 500);
        } catch (error) {
            setErrorMessage(error.response.data)
        }
    };

    const getFeed = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/user/feed`, { withCredentials: true })
            dispatch(addFeed(res.data.data.unknown))
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getFeed()
    }, [])

    // Loading state
    if (!feed) {
        return (
            <div className="hero min-h-screen bg-base-200">
                <div className="hero-content flex-col">
                    <div className="text-center">
                        <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
                        <h2 className="text-2xl font-bold mb-2">Finding Your Dev Matches</h2>
                        <p className="text-base-content/70">We're searching for developers who share your interests...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Empty state
    if (feed.length === 0) {
        return (
            <div className="hero min-h-screen bg-base-200">
                <div className="hero-content flex-col text-center">
                    <div className="max-w-md">
                        <div className="mb-6">
                            <div className="relative">
                                <div className="w-32 h-32 mx-auto mb-4 bg-base-300 rounded-full flex items-center justify-center">
                                    <Users size={48} className="text-base-content/40" />
                                </div>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mb-4">
                            You've Seen Everyone!
                        </h2>

                        <p className="text-base-content/70 mb-6 leading-relaxed">
                            Great job exploring! You've viewed all available developers in your area.
                            Check back later for new profiles or expand your search preferences.
                        </p>

                        <div className="space-y-4">
                            <button
                                className="btn btn-primary btn-wide"
                                onClick={getFeed}
                            >
                                <Search size={20} />
                                Refresh Feed
                            </button>

                            <div className="divider">OR</div>

                            <div className="text-sm text-base-content/60">
                                <p>💡 <strong>Tip:</strong> Update your profile to attract more connections!</p>
                            </div>
                        </div>

                        {/* Decorative elements */}
                        <div className="flex justify-center gap-4 mt-8 opacity-50">
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                            <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


    const user = feed[0]

    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col">
                <SuccessToast
                    message={successMessage}
                    onClose={() => setSuccessMessage('')}
                />
                <ErrorToast
                    message={errorMessage}
                    onClose={() => setErrorMessage('')}
                />
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-4">
                        Find Your <span className="text-primary">Dev Match</span>
                    </h1>
                    <p className="text-base-content/70">
                        Swipe to connect with fellow developers
                    </p>
                </div>

                {/* Card Container */}
                <div className="relative w-full max-w-sm">
                    {/* Main Card */}
                    <div
                        ref={cardRef}
                        className="card bg-base-100 shadow-2xl rounded-3xl overflow-hidden transform transition-all duration-300 cursor-grab active:cursor-grabbing select-none hover:shadow-primary/20"
                        style={{
                            transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg)`,
                            transition: isDragging ? 'none' : 'transform 0.3s ease-out'
                        }}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                    >
                        {/* Image Section */}
                        <div className="relative h-96 overflow-hidden">
                            {user.photoUrl ? (
                                <img
                                    src={user.photoUrl}
                                    alt={`${user.firstName} ${user.lastName}`}
                                    className="w-full h-full object-cover"
                                    draggable={false}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.parentElement.querySelector('.placeholder').style.display = 'flex';
                                    }}
                                />
                            ) : null}

                            {/* Placeholder when no image */}
                            <div className={`placeholder w-full h-full bg-base-300 flex items-center justify-center ${user.photoUrl ? 'hidden' : 'flex'}`}>
                                <User size={48} className="text-base-content/40" />
                            </div>

                            {/* Swipe Indicators */}
                            <div
                                className="absolute top-8 left-8 px-4 py-2 rounded-full border-4 border-error text-error font-bold text-xl transform rotate-12 opacity-0 transition-opacity bg-base-100/90"
                                style={{ opacity: dragOffset.x < -50 ? Math.min(Math.abs(dragOffset.x) / 150, 1) : 0 }}
                            >
                                NOPE
                            </div>
                            <div
                                className="absolute top-8 right-8 px-4 py-2 rounded-full border-4 border-success text-success font-bold text-xl transform -rotate-12 opacity-0 transition-opacity bg-base-100/90"
                                style={{ opacity: dragOffset.x > 50 ? Math.min(dragOffset.x / 150, 1) : 0 }}
                            >
                                LIKE
                            </div>

                            {/* Gradient Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/70 to-transparent" />

                            {/* Basic Info Overlay */}
                            <div className="absolute bottom-4 left-4 right-4 text-white">
                                <h2 className="text-2xl font-bold mb-1">
                                    {user.firstName || user.lastName
                                        ? `${user.firstName} ${user.lastName}`.trim()
                                        : 'Your Name'
                                    }
                                    {user.gender && (
                                        <span className="text-xl font-normal ml-2">,{user.gender}</span>
                                    )}
                                    {user.age && (
                                        <span className="text-xl font-normal ml-2">({user.age})</span>
                                    )}
                                </h2>
                                <div className="flex items-center gap-1 text-sm opacity-90 mb-2">
                                    <MapPin size={16} />
                                    <span>{user.location || 'Location not specified'}</span>
                                </div>

                                {/* Company & Experience */}
                                <div className="flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-1">
                                        <Briefcase size={14} className="text-white" />
                                        <span>{user.company || 'Freelancer'}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Star size={14} className="text-white" />
                                        <span>{user.experience || '3 years'} experience</span>
                                    </div>
                                </div>
                            </div>

                            {/* Info Toggle Button */}
                            <button
                                className="absolute bottom-4 right-4 btn btn-circle btn-sm bg-white/20 backdrop-blur border-white/30 text-white hover:bg-white/30"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowPreviewDetails(!showPreviewDetails);
                                }}
                            >
                                <div className={`transform transition-transform ${showPreviewDetails ? 'rotate-180' : ''}`}>
                                    ⋯
                                </div>
                            </button>
                        </div>

                        {/* Expanded Details */}
                        {showPreviewDetails && (
                            <div className="card-body space-y-4 max-h-64 overflow-y-auto">
                                {/* About */}
                                <div>
                                    <h4 className="font-semibold text-base-content mb-2">About</h4>
                                    <p className="text-sm text-base-content/70 leading-relaxed">
                                        {user.about || 'No description added yet...'}
                                    </p>
                                </div>

                                {/* Skills */}
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Code size={16} className="text-primary" />
                                        <h4 className="font-semibold text-base-content">Skills</h4>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {user.skills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="badge badge-primary badge-outline"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Social Links */}
                                <div>
                                    <h4 className="font-semibold text-base-content mb-2">Connect</h4>
                                    <div className="flex gap-3">
                                        <button
                                            className={`btn btn-circle btn-sm btn-outline ${!user.github ? 'btn-disabled' : 'hover:btn-neutral'}`}
                                            disabled={!user.github}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                user.github && window.open(user.github, '_blank');
                                            }}
                                        >
                                            <Github size={16} />
                                        </button>
                                        <button
                                            className={`btn btn-circle btn-sm btn-outline ${!user.linkedin ? 'btn-disabled' : 'hover:btn-info'}`}
                                            disabled={!user.linkedin}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                user.linkedin && window.open(user.linkedin, '_blank');
                                            }}
                                        >
                                            <Linkedin size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center items-center gap-6 mt-6">
                        <button
                            className="btn btn-circle btn-lg btn-outline hover:btn-error group"
                            onClick={handlePass}
                        >
                            <X size={24} className="group-hover:text-white" />
                        </button>

                        <button
                            className="btn btn-circle btn-outline hover:btn-info"
                            onClick={handleSuperLike}
                        >
                            <Star size={20} />
                        </button>

                        <button
                            className="btn btn-circle btn-lg btn-primary group"
                            onClick={handleLike}
                        >
                            <Heart size={24} className="group-hover:fill-current" />
                        </button>
                    </div>

                    {/* Instructions */}
                    <div className="text-center mt-6 text-base-content/60 text-sm">
                        <p>Drag the card or use buttons below</p>
                        <p className="text-xs mt-1">← Swipe left to pass • Swipe right to like →</p>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="flex gap-4 mt-8">
                    <div className="stat bg-base-100 rounded-box shadow-lg">
                        <div className="stat-figure text-primary">
                            <Heart className="text-2xl" />
                        </div>
                        <div className="stat-title">Your Likes</div>
                        <div className="stat-value text-primary">24</div>
                    </div>

                    <div className="stat bg-base-100 rounded-box shadow-lg">
                        <div className="stat-figure text-secondary">
                            <User className="text-2xl" />
                        </div>
                        <div className="stat-title">Matches</div>
                        <div className="stat-value text-secondary">12</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TinderCard;