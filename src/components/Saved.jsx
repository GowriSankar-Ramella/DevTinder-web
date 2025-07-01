import { useState, useEffect } from 'react';
import { Heart, UserPlus, X, Code, MapPin, Github, Linkedin, Building, Briefcase } from 'lucide-react';
import axios from 'axios';
import SuccessToast from './SuccessToast';
import ErrorToast from './ErrorToast';
import { BASE_URL } from '../constants';

const Liked = () => {
    const [likedConnections, setLikedConnections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [successMessage, setSuccessMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")


    useEffect(() => {
        const fetchLikedConnections = async () => {
            try {
                const res = await axios.get(BASE_URL + "/user/saved", { withCredentials: true })
                console.log(res)
                setLikedConnections(res.data.data.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching liked connections:', error);
                setLoading(false);
            }
        };

        fetchLikedConnections();
    }, []);

    const handleSendRequest = async (connectionId, receiptantId) => {
        setActionLoading(connectionId);
        try {
            await axios.post(`${BASE_URL}/request/send/interested/${receiptantId}`, {}, { withCredentials: true })
            setTimeout(() => {
                setLikedConnections(prev => prev.filter(conn => conn._id !== connectionId));
                setActionLoading(null);
                setSuccessMessage("Connection request sent!!")
            }, 1000);
        } catch (error) {
            setErrorMessage('Error sending connection request:', error.response.data);
            console.log(error)
            setActionLoading(null);
        }
    };

    const handleIgnore = async (connectionId, receiptantId) => {
        setActionLoading(connectionId);
        try {
            await axios.post(`${BASE_URL}/request/send/ignored/${receiptantId}`, {}, { withCredentials: true })
            setTimeout(() => {
                setLikedConnections(prev => prev.filter(conn => conn._id !== connectionId));
                setActionLoading(null);
                setSuccessMessage("Connection Ignored!!")
            }, 1000);
        } catch (error) {
            setErrorMessage('Error ignoring connection:', error.response.data);
            console.log(error)
            setActionLoading(null);
        }
    };

    const formatName = (firstName, lastName) => {
        return `${firstName} ${lastName}`;
    };

    const hasValidSkills = (skills) => {
        return skills && skills.length > 0;
    };

    const formatExperience = (experience) => {
        if (!experience || experience === 0) return null;
        return `${experience} years`;
    };

    const isValidUrl = (url) => {
        return url && url !== "N/A" && url.trim() !== "";
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-base-100 flex items-center justify-center">
                <div className="loading loading-spinner loading-lg text-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100 p-4">
            <div className="max-w-6xl mx-auto">
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
                    <h1 className="text-4xl font-bold mb-2">
                        Your <span className="text-primary">Liked</span> Connections
                    </h1>
                    <p className="text-base-content/70">
                        These developers caught your eye! Send them a connection request or pass for now.
                    </p>

                    {/* Stats */}
                    <div className="stat bg-base-200 rounded-box inline-block mt-4">
                        <div className="stat-figure text-primary">
                            <Heart className="text-2xl w-6 h-6" />
                        </div>
                        <div className="stat-title">Total Liked</div>
                        <div className="stat-value text-primary">{likedConnections.length}</div>
                    </div>
                </div>

                {/* Liked Connections Grid */}
                {likedConnections.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {likedConnections.map((connection) => {
                            const user = connection.receiverId;
                            return (
                                <div key={connection._id} className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300">
                                    <figure className="px-6 pt-6">
                                        <img
                                            src={user.photoUrl}
                                            alt={formatName(user.firstName, user.lastName)}
                                            className="rounded-xl w-32 h-32 object-cover"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/150?text=Profile';
                                            }}
                                        />
                                    </figure>

                                    <div className="card-body items-center text-center">
                                        <h2 className="card-title text-xl">
                                            {formatName(user.firstName, user.lastName)}
                                            {user.age && <span className="text-base font-normal">, {user.age}</span>}
                                        </h2>

                                        {user.location && (
                                            <div className="flex items-center gap-1 text-sm text-base-content/70 mb-2">
                                                <MapPin className="w-4 h-4" />
                                                {user.location}
                                            </div>
                                        )}

                                        {user.company && user.company !== "N/A" && (
                                            <div className="flex items-center gap-1 text-sm text-base-content/70 mb-2">
                                                <Building className="w-4 h-4" />
                                                {user.company}
                                            </div>
                                        )}

                                        {formatExperience(user.experience) && (
                                            <div className="flex items-center gap-1 text-sm text-base-content/70 mb-2">
                                                <Briefcase className="w-4 h-4" />
                                                {formatExperience(user.experience)} experience
                                            </div>
                                        )}

                                        <p className="text-sm text-base-content/80 mb-3 line-clamp-2">
                                            {user.about || "No bio available"}
                                        </p>

                                        {/* Skills */}
                                        {hasValidSkills(user.skills) && (
                                            <div className="flex flex-wrap gap-1 mb-4 justify-center">
                                                {user.skills.slice(0, 3).map((skill, index) => (
                                                    <div key={index} className="badge badge-primary badge-sm">
                                                        {skill}
                                                    </div>
                                                ))}
                                                {user.skills.length > 3 && (
                                                    <div className="badge badge-outline badge-sm">
                                                        +{user.skills.length - 3}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Social Links */}
                                        <div className="flex gap-2 mb-4">
                                            {isValidUrl(user.github) && (
                                                <a
                                                    href={user.github.startsWith('http') ? user.github : `https://github.com/${user.github}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-ghost btn-sm btn-circle"
                                                >
                                                    <Github className="w-4 h-4" />
                                                </a>
                                            )}
                                            {isValidUrl(user.linkedin) && (
                                                <a
                                                    href={user.linkedin.startsWith('http') ? user.linkedin : `https://linkedin.com/in/${user.linkedin}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-ghost btn-sm btn-circle"
                                                >
                                                    <Linkedin className="w-4 h-4" />
                                                </a>
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="card-actions justify-center w-full gap-2">
                                            <button
                                                className={`btn btn-error btn-sm flex-1 ${actionLoading === connection._id ? 'loading' : ''
                                                    }`}
                                                onClick={() => handleIgnore(connection._id, connection.receiverId._id)}
                                                disabled={actionLoading === connection._id}
                                            >
                                                {actionLoading === connection._id ? '' : <X className="w-4 h-4" />}
                                                Ignore
                                            </button>

                                            <button
                                                className={`btn btn-primary btn-sm flex-1 ${actionLoading === connection._id ? 'loading' : ''
                                                    }`}
                                                onClick={() => handleSendRequest(connection._id, connection.receiverId._id)}
                                                disabled={actionLoading === connection._id}
                                            >
                                                {actionLoading === connection._id ? '' : <UserPlus className="w-4 h-4" />}
                                                Connect
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="text-center py-16">
                        <div className="text-6xl text-base-content/20 mb-4 flex justify-center">
                            <Heart className="w-16 h-16" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">No Liked Connections Yet</h3>
                        <p className="text-base-content/70 mb-6">
                            Start exploring and like some developer profiles to see them here!
                        </p>
                        <button className="btn btn-primary">
                            <Code className="w-4 h-4" /> Discover Developers
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Liked;