import React, { useEffect, useState } from 'react';
import { Users, MapPin, Building, Github, Linkedin, Mail, User, Search, MessageCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '../constants';
import SuccessToast from './SuccessToast';
import ErrorToast from './ErrorToast';

const Connections = () => {
    const [connections, setConnections] = useState([])
    const [searchTerm, setSearchTerm] = useState('');
    const [filtered, setFiltered] = useState([])
    const [loading, setLoading] = useState(true);
    const [chatLoading, setChatLoading] = useState(null);
    const [successMessage, setSuccessMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const fetchConnections = async () => {
        try {
            setLoading(true);
            const res = await axios.get(BASE_URL + "/user/connections", { withCredentials: true })
            setConnections(res.data.data.data)
            setFiltered(res.data.data.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }

    const filterConnections = () => {
        setFiltered(connections.filter(connection =>
            connection.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            connection.lastName.toLowerCase().includes(searchTerm.toLowerCase())
        ))
    }

    const handleChat = async (connectionId) => {
        setChatLoading(connectionId);
        try {
            const res = await axios.get(`${BASE_URL}/chat/initialize/${connectionId}`, { withCredentials: true })
            setSuccessMessage("Hello sent! switch to messanger...")
        } catch (error) {
            setErrorMessage(error.response.data)
        } finally {
            setChatLoading(null);
        }
    }

    useEffect(() => {
        fetchConnections()
    }, [])

    useEffect(() => {
        filterConnections()
    }, [searchTerm])

    const handleSearch = (e) => {
        setSearchTerm(e.target.value)
    }

    // Loader Component
    const LoadingSpinner = () => (
        <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="text-base-content/60 text-lg">Loading connections...</p>
            </div>
        </div>
    );

    // Skeleton Loader for Cards
    const SkeletonCard = () => (
        <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
                <div className="flex items-center gap-4 mb-4">
                    <div className="skeleton w-16 h-16 rounded-full shrink-0"></div>
                    <div className="flex flex-col gap-2">
                        <div className="skeleton h-4 w-32"></div>
                        <div className="skeleton h-3 w-24"></div>
                    </div>
                </div>
                <div className="skeleton h-4 w-full mb-2"></div>
                <div className="skeleton h-3 w-3/4 mb-4"></div>
                <div className="flex gap-2 mb-4">
                    <div className="skeleton h-6 w-16"></div>
                    <div className="skeleton h-6 w-20"></div>
                    <div className="skeleton h-6 w-18"></div>
                </div>
                <div className="flex gap-2">
                    <div className="skeleton w-8 h-8 rounded-full"></div>
                    <div className="skeleton w-8 h-8 rounded-full"></div>
                    <div className="skeleton w-8 h-8 rounded-full"></div>
                    <div className="skeleton w-8 h-8 rounded-full"></div>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 p-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                            My Connections
                        </h1>
                        <div className="skeleton h-4 w-32 mx-auto"></div>
                    </div>

                    {/* Search Bar Skeleton */}
                    <div className="mb-8">
                        <div className="relative max-w-md mx-auto">
                            <div className="skeleton h-12 w-full rounded-lg"></div>
                        </div>
                    </div>

                    {/* Skeleton Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <SkeletonCard key={index} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 p-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <SuccessToast
                        message={successMessage}
                        onClose={() => setSuccessMessage('')}
                    />
                    <ErrorToast
                        message={errorMessage}
                        onClose={() => setErrorMessage('')}
                    />
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                        My Connections
                    </h1>
                    <div className="flex items-center justify-center gap-2">
                        <div className="badge badge-primary badge-lg">
                            <Users size={16} className="mr-1" />
                            {connections.length} connection{connections.length !== 1 ? 's' : ''}
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mb-8">
                    <div className="relative max-w-md mx-auto">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name..."
                            className="input input-bordered w-full pl-10 focus:input-primary bg-base-100/80 backdrop-blur-sm border-base-300 focus:border-primary transition-all duration-200"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                </div>

                {/* Connections */}
                {filtered.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="bg-base-100/50 backdrop-blur-sm rounded-2xl p-8 border border-base-300">
                            <Users size={64} className="mx-auto text-base-content/20 mb-4" />
                            <h3 className="text-xl font-semibold text-base-content/60 mb-2">
                                {searchTerm ? 'No connections found' : 'No connections yet'}
                            </h3>
                            <p className="text-base-content/40">
                                {searchTerm ? 'Try searching with a different name' : 'Start connecting with other developers!'}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((connection) => (
                            <div key={connection._id} className="card bg-base-100/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 border border-base-300 hover:border-primary/20 hover:-translate-y-1 group">
                                <div className="card-body">
                                    {/* Profile Picture */}
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="avatar">
                                            <div className="w-16 h-16 rounded-full ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
                                                {connection.photoUrl ? (
                                                    <img
                                                        src={connection.photoUrl}
                                                        alt={`${connection.firstName} ${connection.lastName}`}
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.parentElement.querySelector('.placeholder-avatar').style.display = 'flex';
                                                        }}
                                                    />
                                                ) : null}
                                                <div className={`placeholder-avatar w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center ${connection.photoUrl ? 'hidden' : 'flex'}`}>
                                                    <User size={24} className="text-primary/60" />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg group-hover:text-primary transition-colors duration-200">
                                                {connection.firstName} {connection.lastName}
                                            </h3>
                                            <div className="flex items-center gap-1 text-sm text-base-content/60">
                                                <MapPin size={14} />
                                                {connection.location}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Company */}
                                    <div className="flex items-center gap-2 mb-3">
                                        <Building size={16} className="text-primary" />
                                        <span className="text-sm font-medium bg-primary/10 px-2 py-1 rounded-full">
                                            {connection.company !== 'N/A' ? connection.company : 'Freelancer'}
                                        </span>
                                    </div>

                                    {/* About */}
                                    <p className="text-sm text-base-content/70 mb-4 line-clamp-2">
                                        {connection.about}
                                    </p>

                                    {/* Skills */}
                                    <div className="mb-4">
                                        <div className="flex flex-wrap gap-1">
                                            {connection.skills.length > 0 ? (
                                                connection.skills.slice(0, 4).map((skill, index) => (
                                                    <span key={index} className="badge badge-outline badge-sm hover:badge-primary transition-all duration-200">
                                                        {skill}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-xs text-base-content/40">No skills listed</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Social Links */}
                                    <div className="flex gap-2">
                                        <button
                                            className={`btn btn-circle btn-sm btn-outline ${connection.github === 'N/A' ? 'opacity-40 cursor-not-allowed' : 'hover:btn-primary hover:scale-110 transition-all duration-200'}`}
                                            disabled={connection.github === 'N/A'}
                                            onClick={() => connection.github !== 'N/A' && window.open(connection.github, '_blank')}
                                        >
                                            <Github size={16} />
                                        </button>
                                        <button
                                            className={`btn btn-circle btn-sm btn-outline ${connection.linkedin === 'N/A' ? 'opacity-40 cursor-not-allowed' : 'hover:btn-info hover:scale-110 transition-all duration-200'}`}
                                            disabled={connection.linkedin === 'N/A'}
                                            onClick={() => connection.linkedin !== 'N/A' && window.open(connection.linkedin, '_blank')}
                                        >
                                            <Linkedin size={16} />
                                        </button>
                                        {/* Chat Button */}
                                        <button
                                            className="btn btn-circle btn-sm btn-outline hover:btn-success hover:scale-110 transition-all duration-200"
                                            onClick={() => handleChat(connection._id)}
                                            disabled={chatLoading === connection._id}
                                        >
                                            {chatLoading === connection._id ? (
                                                <Loader2 size={16} className="animate-spin" />
                                            ) : (
                                                <MessageCircle size={16} />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Connections;