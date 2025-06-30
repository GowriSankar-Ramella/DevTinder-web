import React, { useState, useEffect } from 'react';
import { User, MapPin, Building, Clock, Camera, Save, Heart, X, Code, Briefcase, Star, Github, Linkedin, Mail } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { addUser } from '../utils/authSlice';
import ErrorToast from './ErrorToast';
import SuccessToast from './SuccessToast';


const ProfileEditPage = () => {
    const user = useSelector(store => store.auth.user)
    const dispatch = useDispatch()
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessgae, setSuccessMessage] = useState("")

    const [profile, setProfile] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        skills: user?.skills?.join(', ') || '',
        about: user?.about || '',
        photoUrl: user?.photoUrl || '',
        age: user?.age || '',
        location: user?.location || '',
        company: user?.company || '',
        experience: user?.experience || '',
        email: user?.email || '',
        github: user?.github || '',
        linkedin: user?.linkedin || ''
    });

    const [showPreviewDetails, setShowPreviewDetails] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (field, value) => {
        setProfile(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        try {
            setIsLoading(true);
            const skillsArray = getSkillsArray()
            const profileData = { ...profile, skills: skillsArray }
            const { email, ...profileWithoutEmail } = profileData
            const res = await axios.patch("http://localhost:3000/profile/update", profileWithoutEmail, { withCredentials: true })
            dispatch(addUser(res.data.data.user))
            setSuccessMessage("Profile Updated Successfully!!")
        } catch (error) {
            console.log(error.response.data)
            setErrorMessage(error.response.data);
        } finally {
            setIsLoading(false);
        }
    };

    const getSkillsArray = () => {
        return profile.skills
            .split(',')
            .map(skill => skill.trim())
            .filter(skill => skill.length > 0);
    };

    const handlePreviewLike = () => {
        console.log('Preview like clicked');
    };

    const handlePreviewPass = () => {
        console.log('Preview pass clicked');
    };

    const closeToast = () => {
        setShowToast(false);
    };

    return (
        <div className="min-h-screen bg-base-200 p-4">
            <SuccessToast
                message={successMessgae}
                onClose={() => setSuccessMessage('')}
            />
            <ErrorToast
                message={errorMessage}
                onClose={() => setErrorMessage('')}
            />

            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold text-base-content mb-2">
                        Edit Your <span className="text-primary">DevTinder</span> Profile
                    </h1>
                    <p className="py-6 text-base-content/70">
                        Update your information to attract the perfect coding partner
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Edit Form */}
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title text-2xl mb-6 flex items-center">
                                <User className="mr-2 text-primary" />
                                Profile Information
                            </h2>

                            <div className="space-y-6">
                                {/* Name Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium">First Name</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={profile.firstName}
                                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                                            className="input input-bordered w-full focus:input-primary"
                                            placeholder="Enter your first name"
                                        />
                                    </div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium">Last Name</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={profile.lastName}
                                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                                            className="input input-bordered w-full focus:input-primary"
                                            placeholder="Enter your last name"
                                        />
                                    </div>
                                </div>

                                {/* Email Field (Read-only) */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium flex items-center">
                                            <Mail className="w-4 h-4 mr-1" />
                                            Email Address
                                        </span>
                                    </label>
                                    <input
                                        type="email"
                                        value={profile.email}
                                        className="input input-bordered w-full bg-base-200 cursor-not-allowed"
                                        placeholder="your.email@example.com"
                                        readOnly
                                    />
                                    <label className="label">
                                        <span className="label-text-alt opacity-70">Email cannot be changed</span>
                                    </label>
                                </div>

                                {/* Photo URL */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium flex items-center">
                                            <Camera className="w-4 h-4 mr-1" />
                                            Photo URL
                                        </span>
                                    </label>
                                    <input
                                        type="url"
                                        value={profile.photoUrl}
                                        onChange={(e) => handleInputChange('photoUrl', e.target.value)}
                                        className="input input-bordered w-full focus:input-primary"
                                        placeholder="https://example.com/your-photo.jpg"
                                    />
                                </div>

                                {/* Age, Location, Company */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium">Age</span>
                                        </label>
                                        <input
                                            type="number"
                                            value={profile.age}
                                            onChange={(e) => handleInputChange('age', e.target.value)}
                                            className="input input-bordered w-full focus:input-primary"
                                            placeholder="25"
                                            min="18"
                                            max="100"
                                        />
                                    </div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium flex items-center">
                                                <MapPin className="w-4 h-4 mr-1" />
                                                Location
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            value={profile.location}
                                            onChange={(e) => handleInputChange('location', e.target.value)}
                                            className="input input-bordered w-full focus:input-primary"
                                            placeholder="City, Country"
                                        />
                                    </div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium flex items-center">
                                                <Building className="w-4 h-4 mr-1" />
                                                Company
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            value={profile.company}
                                            onChange={(e) => handleInputChange('company', e.target.value)}
                                            className="input input-bordered w-full focus:input-primary"
                                            placeholder="Company Name"
                                        />
                                    </div>
                                </div>

                                {/* Experience */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium flex items-center">
                                            <Clock className="w-4 h-4 mr-1" />
                                            Experience ( Years )
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        value={profile.experience}
                                        onChange={(e) => handleInputChange('experience', e.target.value)}
                                        className="input input-bordered w-full focus:input-primary"
                                        placeholder="e.g., 3 years, Senior Developer, etc."
                                    />
                                </div>

                                {/* Social Links */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium flex items-center">
                                                <Github className="w-4 h-4 mr-1" />
                                                GitHub Profile
                                            </span>
                                        </label>
                                        <input
                                            type="url"
                                            value={profile.github}
                                            onChange={(e) => handleInputChange('github', e.target.value)}
                                            className="input input-bordered w-full focus:input-primary"
                                            placeholder="https://github.com/username"
                                        />
                                    </div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium flex items-center">
                                                <Linkedin className="w-4 h-4 mr-1" />
                                                LinkedIn Profile
                                            </span>
                                        </label>
                                        <input
                                            type="url"
                                            value={profile.linkedin}
                                            onChange={(e) => handleInputChange('linkedin', e.target.value)}
                                            className="input input-bordered w-full focus:input-primary"
                                            placeholder="https://linkedin.com/in/username"
                                        />
                                    </div>
                                </div>

                                {/* Skills */}
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-medium">Skills (comma-separated)</span>
                                    </label>
                                    <textarea
                                        value={profile.skills}
                                        onChange={(e) => handleInputChange('skills', e.target.value)}
                                        className="textarea textarea-bordered w-full h-20 resize-none focus:outline-none focus:border-primary"
                                        placeholder="React, Node.js, Python, JavaScript, MongoDB"
                                    />
                                    <label className="label">
                                        <span className="label-text-alt opacity-70">Separate skills with commas</span>
                                    </label>
                                </div>

                                {/* About */}
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-medium">About Me</span>
                                    </label>
                                    <textarea
                                        value={profile.about}
                                        onChange={(e) => handleInputChange('about', e.target.value)}
                                        className="textarea textarea-bordered w-full h-24 resize-none focus:outline-none focus:border-primary"
                                        placeholder="Tell us about yourself, your passion for coding, and what you're looking for..."
                                    />
                                </div>

                                {/* Save Button */}
                                <button
                                    onClick={handleSave}
                                    disabled={isLoading}
                                    className={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`}
                                >
                                    {!isLoading && <Save className="mr-2" size={20} />}
                                    {isLoading ? 'Saving...' : 'Save Profile'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Profile Preview Card - Matching Original Design */}
                    <div className="card bg-base-100 shadow-xl h-fit sticky top-4">
                        <div className="card-body">
                            <h2 className="card-title text-2xl mb-6">
                                Profile Preview
                            </h2>

                            {/* Preview Card Container */}
                            <div className="relative w-full max-w-sm mx-auto">
                                {/* Main Card */}
                                <div className="card bg-base-100 shadow-2xl rounded-3xl overflow-hidden transform transition-all duration-300 hover:scale-105">

                                    {/* Image Section */}
                                    <div className="relative h-80 overflow-hidden">
                                        {profile.photoUrl ? (
                                            <img
                                                src={profile.photoUrl}
                                                alt={`${profile.firstName} ${profile.lastName}`}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.parentElement.querySelector('.placeholder').style.display = 'flex';
                                                }}
                                            />
                                        ) : null}

                                        {/* Placeholder when no image */}
                                        <div className={`placeholder w-full h-full bg-base-300 flex items-center justify-center ${profile.photoUrl ? 'hidden' : 'flex'}`}>
                                            <User size={48} className="text-base-content/40" />
                                        </div>

                                        {/* Gradient Overlay */}
                                        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />

                                        {/* Basic Info Overlay */}
                                        <div className="absolute bottom-4 left-4 right-4 text-white">
                                            <h2 className="text-xl font-bold">
                                                {profile.firstName || profile.lastName
                                                    ? `${profile.firstName} ${profile.lastName}`.trim()
                                                    : 'Your Name'
                                                }
                                                {profile.age && (
                                                    <span className="text-lg font-normal ml-2">{profile.age}</span>
                                                )}
                                            </h2>
                                            <div className="flex items-center gap-1 text-sm opacity-90">
                                                <MapPin size={14} />
                                                <span>{profile.location || 'Location not specified'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick Info */}
                                    <div className="p-4 space-y-3">
                                        {/* Company & Experience */}
                                        <div className="flex items-center gap-4 text-sm text-base-content">
                                            <div className="flex items-center gap-1">
                                                <Briefcase size={16} className="text-primary" />
                                                <span className="font-medium">{profile.company || 'Freelancer'}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Star size={16} className="text-secondary" />
                                                <span>{profile.experience || '3 years'} experience</span>
                                            </div>
                                        </div>

                                        {/* Skills Preview */}
                                        <div>
                                            <div className="flex items-center gap-1 mb-2">
                                                <Code size={16} className="text-primary" />
                                                <span className="font-medium text-sm text-base-content">Top Skills</span>
                                            </div>
                                            <div className="flex flex-wrap gap-1">
                                                {getSkillsArray().slice(0, 3).map((skill, index) => (
                                                    <span
                                                        key={index}
                                                        className="badge badge-primary badge-sm text-xs"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                                {getSkillsArray().length > 3 && (
                                                    <span className="badge badge-outline badge-sm text-xs">
                                                        +{getSkillsArray().length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* About Preview */}
                                        <div>
                                            <p className="text-sm text-base-content/70 line-clamp-2">
                                                {profile.about || 'No description added yet...'}
                                            </p>
                                            <button
                                                className="text-primary text-xs font-medium mt-1 hover:underline"
                                                onClick={() => setShowPreviewDetails(!showPreviewDetails)}
                                            >
                                                {showPreviewDetails ? 'Show less' : 'Read more'}
                                            </button>
                                        </div>

                                        {/* Expanded Details */}
                                        {showPreviewDetails && (
                                            <div className="space-y-3 pt-3 border-t border-base-300 animate-in slide-in-from-top-2 duration-300">
                                                <div>
                                                    <h4 className="font-medium text-sm mb-2 text-base-content">All Skills</h4>
                                                    <div className="flex flex-wrap gap-1">
                                                        {getSkillsArray().map((skill, index) => (
                                                            <span
                                                                key={index}
                                                                className="badge badge-outline badge-sm"
                                                            >
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="flex justify-center gap-4 pt-2">
                                                    <button
                                                        className={`btn btn-circle btn-outline btn-sm ${!profile.github ? 'opacity-40 cursor-not-allowed' : 'hover:btn-primary'}`}
                                                        disabled={!profile.github}
                                                        onClick={() => profile.github && window.open(profile.github, '_blank')}
                                                    >
                                                        <Github size={16} />
                                                    </button>
                                                    <button
                                                        className={`btn btn-circle btn-outline btn-sm ${!profile.linkedin ? 'opacity-40 cursor-not-allowed' : 'hover:btn-info'}`}
                                                        disabled={!profile.linkedin}
                                                        onClick={() => profile.linkedin && window.open(profile.linkedin, '_blank')}
                                                    >
                                                        <Linkedin size={16} />
                                                    </button>
                                                    <button
                                                        className={`btn btn-circle btn-outline btn-sm ${!profile.email ? 'opacity-40 cursor-not-allowed' : 'hover:btn-secondary'}`}
                                                        disabled={!profile.email}
                                                        onClick={() => profile.email && window.open(`mailto:${profile.email}`, '_blank')}
                                                    >
                                                        <Mail size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex justify-center gap-6 p-6 bg-base-200">
                                        <button
                                            className="btn btn-circle btn-lg btn-outline hover:btn-error group"
                                            onClick={handlePreviewPass}
                                        >
                                            <X size={24} className="group-hover:text-white" />
                                        </button>

                                        <button className="btn btn-circle btn-sm btn-outline hover:btn-secondary">
                                            <Star size={16} />
                                        </button>

                                        <button
                                            className="btn btn-circle btn-lg btn-primary group"
                                            onClick={handlePreviewLike}
                                        >
                                            <Heart size={24} className="group-hover:fill-current" />
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileEditPage;