import React, { useEffect, useState } from 'react';
import { Users, MapPin, Building, Github, Linkedin, Mail, User, Search } from 'lucide-react';
import axios from 'axios';

const Connections = () => {

    const [connections, setConnections] = useState([])
    const [searchTerm, setSearchTerm] = useState('');
    const [filtered, setFiltered] = useState([])

    const fetchConnections = async () => {
        try {
            const res = await axios.get("http://localhost:3000/user/connections", { withCredentials: true })
            setConnections(res.data.data.data)
            setFiltered(res.data.data.data)
        } catch (error) {
            console.log(error)
        }
    }

    const filterConnections = () => {
        setFiltered(connections.filter(connection =>
            connection.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            connection.lastName.toLowerCase().includes(searchTerm.toLowerCase())
        ))
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


    return (
        <div className="min-h-screen bg-base-200 p-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-base-content mb-2">
                        My Connections
                    </h1>
                    <p className="text-base-content/70">
                        {connections.length} connection{connections.length !== 1 ? 's' : ''}
                    </p>
                </div>

                {/* Search Bar */}
                <div className="mb-8">
                    <div className="relative max-w-md mx-auto">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name..."
                            className="input input-bordered w-full pl-10 focus:input-primary"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                </div>

                {/* Connections */}
                {filtered.length === 0 ? (
                    <div className="text-center py-16">
                        <Users size={64} className="mx-auto text-base-content/20 mb-4" />
                        <h3 className="text-xl font-semibold text-base-content/60 mb-2">
                            {searchTerm ? 'No connections found' : 'No connections yet'}
                        </h3>
                        <p className="text-base-content/40">
                            {searchTerm ? 'Try searching with a different name' : 'Start connecting with other developers!'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((connection) => (
                            <div key={connection._id} className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
                                <div className="card-body">
                                    {/* Profile Picture */}
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="avatar">
                                            <div className="w-16 h-16 rounded-full">
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
                                                <div className={`placeholder-avatar w-full h-full bg-base-300 rounded-full flex items-center justify-center ${connection.photoUrl ? 'hidden' : 'flex'}`}>
                                                    <User size={24} className="text-base-content/40" />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">
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
                                        <span className="text-sm font-medium">
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
                                                    <span key={index} className="badge badge-outline badge-sm">
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
                                            className={`btn btn-circle btn-sm btn-outline ${connection.github === 'N/A' ? 'opacity-40 cursor-not-allowed' : 'hover:btn-primary'}`}
                                            disabled={connection.github === 'N/A'}
                                            onClick={() => connection.github !== 'N/A' && window.open(connection.github, '_blank')}
                                        >
                                            <Github size={16} />
                                        </button>
                                        <button
                                            className={`btn btn-circle btn-sm btn-outline ${connection.linkedin === 'N/A' ? 'opacity-40 cursor-not-allowed' : 'hover:btn-info'}`}
                                            disabled={connection.linkedin === 'N/A'}
                                            onClick={() => connection.linkedin !== 'N/A' && window.open(connection.linkedin, '_blank')}
                                        >
                                            <Linkedin size={16} />
                                        </button>
                                        <button
                                            className="btn btn-circle btn-sm btn-outline hover:btn-secondary"
                                            onClick={() => window.open(`mailto:${connection.email}`, '_blank')}
                                        >
                                            <Mail size={16} />
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