import React, { useEffect, useState } from 'react';
import { Users, MapPin, Building, Github, Linkedin, Mail, User, Clock, Heart, UserPlus, UserX, Sparkles } from 'lucide-react';
import axios from 'axios';
import SuccessToast from './SuccessToast';
import ErrorToast from './ErrorToast';
import { BASE_URL } from '../constants';

const Requests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [processingRequest, setProcessingRequest] = useState(null);
    const [successMessage, setSuccessMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")


    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await axios.get(BASE_URL + "/user/requests/received", { withCredentials: true })
            setRequests(res.data.data.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setRequests([]);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleRequest = async (requestId, action) => {
        setProcessingRequest(requestId);
        try {

            await axios.post(`${BASE_URL}/request/review/${action}/${requestId}`, {}, { withCredentials: true })
            await new Promise(resolve => setTimeout(resolve, 1000));
            setRequests(prev => prev.filter(req => req._id !== requestId));
            setSuccessMessage(`Request ${action}ed successfully`)
        } catch (error) {
            setErrorMessage(error.response.data)
        } finally {
            setProcessingRequest(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
                    <p className="text-base-content/70">Loading connection requests...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200 p-4">
            <div className="max-w-4xl mx-auto">
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
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="relative">
                            <Heart className="text-primary animate-pulse" size={32} />
                            <Sparkles className="absolute -top-1 -right-1 text-secondary" size={16} />
                        </div>
                        <h1 className="text-4xl font-bold text-base-content">
                            Connection Requests
                        </h1>
                    </div>
                    <p className="text-base-content/70">
                        {requests.length} pending request{requests.length !== 1 ? 's' : ''} waiting for your decision
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="flex gap-4 justify-center mb-8">
                    <div className="stat bg-base-100 rounded-box shadow-sm">
                        <div className="stat-figure text-primary">
                            <UserPlus className="text-2xl" />
                        </div>
                        <div className="stat-title">New Requests</div>
                        <div className="stat-value text-primary">{requests.length}</div>
                    </div>
                </div>

                {/* Requests */}
                {requests.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="mockup-window border bg-base-100 mx-auto max-w-md">
                            <div className="flex justify-center px-4 py-16 bg-base-100">
                                <div className="text-center">
                                    <Users size={48} className="mx-auto text-base-content/20 mb-4" />
                                    <h3 className="text-lg font-semibold text-base-content/60 mb-2">
                                        No pending requests
                                    </h3>
                                    <p className="text-base-content/40 text-sm">
                                        When developers send you connection requests, they'll appear here.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {requests.map((request, index) => {
                            const sender = request.senderId;
                            const isProcessing = processingRequest === request._id;

                            return (
                                <div key={request._id} className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border border-base-300">
                                    <div className="card-body">
                                        {/* Request Header */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2 text-sm text-base-content/60">
                                                <Clock size={16} />
                                                <span>New connection request</span>
                                            </div>
                                            <div className="badge badge-primary badge-outline gap-1">
                                                <Heart size={12} />
                                                {request.status}
                                            </div>
                                        </div>

                                        <div className="flex flex-col lg:flex-row gap-6">
                                            {/* Profile Section */}
                                            <div className="flex-1">
                                                <div className="flex items-start gap-4">
                                                    {/* Profile Picture */}
                                                    <div className="avatar">
                                                        <div className="w-20 h-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                                            {sender.photoUrl ? (
                                                                <img
                                                                    src={sender.photoUrl}
                                                                    alt={`${sender.firstName} ${sender.lastName}`}
                                                                    onError={(e) => {
                                                                        e.target.style.display = 'none';
                                                                        e.target.parentElement.querySelector('.placeholder-avatar').style.display = 'flex';
                                                                    }}
                                                                />
                                                            ) : null}
                                                            <div className={`placeholder-avatar w-full h-full bg-base-300 rounded-full flex items-center justify-center ${sender.photoUrl ? 'hidden' : 'flex'}`}>
                                                                <User size={28} className="text-base-content/40" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Profile Info */}
                                                    <div className="flex-1">
                                                        <h3 className="text-2xl font-bold text-base-content mb-1">
                                                            {sender.firstName} {sender.lastName}
                                                        </h3>

                                                        <div className="flex flex-wrap items-center gap-4 text-sm text-base-content/60 mb-3">
                                                            <div className="flex items-center gap-1">
                                                                <MapPin size={14} />
                                                                {sender.location}
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <Building size={14} />
                                                                {sender.company !== 'N/A' ? sender.company : 'Freelancer'}
                                                            </div>
                                                        </div>

                                                        <p className="text-base-content/80 mb-4 leading-relaxed">
                                                            {sender.about}
                                                        </p>

                                                        {/* Skills */}
                                                        {sender.skills && sender.skills.length > 0 && (
                                                            <div className="mb-4">
                                                                <h4 className="text-sm font-medium text-base-content/70 mb-2">Skills & Technologies</h4>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {sender.skills.map((skill, skillIndex) => (
                                                                        <div key={skillIndex} className="badge badge-secondary badge-outline">
                                                                            {skill}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Social Links */}
                                                        <div className="flex gap-2">
                                                            <button
                                                                className={`btn btn-circle btn-sm btn-outline ${sender.github === 'N/A'
                                                                    ? 'btn-disabled'
                                                                    : 'hover:btn-neutral'
                                                                    }`}
                                                                disabled={sender.github === 'N/A'}
                                                                onClick={() => sender.github !== 'N/A' && window.open(sender.github, '_blank')}
                                                            >
                                                                <Github size={16} />
                                                            </button>
                                                            <button
                                                                className={`btn btn-circle btn-sm btn-outline ${sender.linkedin === 'N/A'
                                                                    ? 'btn-disabled'
                                                                    : 'hover:btn-info'
                                                                    }`}
                                                                disabled={sender.linkedin === 'N/A'}
                                                                onClick={() => sender.linkedin !== 'N/A' && window.open(sender.linkedin, '_blank')}
                                                            >
                                                                <Linkedin size={16} />
                                                            </button>
                                                            <button
                                                                className="btn btn-circle btn-sm btn-outline hover:btn-secondary"
                                                                onClick={() => window.open(`mailto:${sender.email}`, '_blank')}
                                                            >
                                                                <Mail size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Creative Action Buttons */}
                                            <div className="flex lg:flex-col gap-3 lg:justify-center lg:items-center">
                                                {/* Accept Button - Creative Design */}
                                                <button
                                                    onClick={() => handleRequest(request._id, 'accepted')}
                                                    disabled={isProcessing}
                                                    className="btn btn-success btn-lg flex-1 lg:flex-none lg:w-32 group relative overflow-hidden"
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                    <div className="relative flex items-center gap-2">
                                                        {isProcessing ? (
                                                            <>
                                                                <span className="loading loading-spinner loading-sm"></span>
                                                                Connecting...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <UserPlus size={18} className="group-hover:scale-110 transition-transform" />
                                                                <span className="hidden sm:inline">Connect</span>
                                                                <Heart size={14} className="group-hover:text-pink-300 transition-colors" />
                                                            </>
                                                        )}
                                                    </div>
                                                </button>

                                                {/* Reject Button - Creative Design */}
                                                <button
                                                    onClick={() => handleRequest(request._id, 'rejected')}
                                                    disabled={isProcessing}
                                                    className="btn btn-error btn-lg flex-1 lg:flex-none lg:w-32 group relative overflow-hidden"
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                    <div className="relative flex items-center gap-2">
                                                        {isProcessing ? (
                                                            <>
                                                                <span className="loading loading-spinner loading-sm"></span>
                                                                Processing...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <UserX size={18} className="group-hover:scale-110 transition-transform" />
                                                                <span className="hidden sm:inline">Pass</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Bottom decoration */}
                                        <div className="mt-4 pt-4 border-t border-base-300">
                                            <div className="flex items-center justify-between text-xs text-base-content/40">
                                                <span>Request #{index + 1}</span>
                                                <span className="flex items-center gap-1">
                                                    <Sparkles size={12} />
                                                    DevTinder Match
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Requests;