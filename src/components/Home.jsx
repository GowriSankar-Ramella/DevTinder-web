import { Code, Heart, Rocket, Users, Github, Linkedin, MessageCircle, Zap, Star, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [currentStat, setCurrentStat] = useState(0);
    const navigate = useNavigate()

    useEffect(() => {
        setIsVisible(true);
        const interval = setInterval(() => {
            setCurrentStat(prev => (prev + 1) % 3);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const stats = [
        { icon: Code, title: "Developers", value: "1000+", color: "text-primary" },
        { icon: Heart, title: "Matches", value: "500+", color: "text-secondary" },
        { icon: Users, title: "Projects", value: "250+", color: "text-accent" }
    ];

    const features = [
        {
            icon: Zap,
            title: "Smart Matching",
            description: "Matches you with developers who complement your skills"
        },
        {
            icon: Sparkles,
            title: "Project Collaboration",
            description: "Find the perfect team members for your next breakthrough project"
        },
        {
            icon: Star,
            title: "Skill Growth",
            description: "Learn from peers and expand your technical expertise together"
        }
    ];

    const handleNavigation = (path) => {
        navigate(path)
    };

    return (
        <div className="min-h-screen bg-base-200 relative overflow-hidden">
            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl"></div>
                <div className="absolute top-60 right-20 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-accent rounded-full blur-3xl"></div>
            </div>

            {/* Floating Code Snippets */}
            <div className="absolute inset-0 pointer-events-none opacity-10">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute text-base-content font-mono text-sm animate-bounce"
                        style={{
                            left: `${10 + (i * 15)}%`,
                            top: `${20 + (i * 10)}%`,
                            animationDelay: `${i * 0.5}s`,
                            animationDuration: '4s'
                        }}
                    >
                        {i % 3 === 0 && "const love = () => code();"}
                        {i % 3 === 1 && "if(developer) { connect(); }"}
                        {i % 3 === 2 && "while(coding) { grow(); }"}
                    </div>
                ))}
            </div>

            <div className="relative z-10">
                {/* Navigation */}
                <div className="navbar bg-base-100/80 backdrop-blur-sm shadow-lg">
                    <div className="navbar-start">
                        <div className="text-2xl font-bold">
                            <span className="text-primary">Dev</span><span className="text-secondary">Tinder</span>
                        </div>
                    </div>
                    <div className="navbar-end gap-2">
                        <button
                            onClick={() => handleNavigation('/login')}
                            className="btn btn-ghost btn-sm"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => handleNavigation('/signup')}
                            className="btn btn-primary btn-sm"
                        >
                            Sign Up
                        </button>
                    </div>
                </div>

                {/* Hero Section */}
                <div className="hero min-h-[80vh]">
                    <div className="hero-content text-center">
                        <div className={`max-w-4xl transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            <h1 className="text-5xl md:text-6xl font-bold mb-6">
                                Welcome to <span className="text-primary">DevTinder</span>
                            </h1>
                            <p className="py-6 text-lg max-w-2xl mx-auto">
                                Connect with fellow developers, collaborate on projects, and find your perfect coding partner!
                                Join thousands of developers building the future together.
                            </p>

                            {/* Enhanced Stats */}
                            <div className="flex flex-wrap gap-6 justify-center mb-8">
                                {stats.map((stat, index) => {
                                    const Icon = stat.icon;
                                    return (
                                        <div
                                            key={index}
                                            className={`stat bg-base-100 rounded-box shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${currentStat === index ? 'ring-2 ring-primary' : ''
                                                }`}
                                        >
                                            <div className={`stat-figure ${stat.color}`}>
                                                <Icon size={32} />
                                            </div>
                                            <div className="stat-title">{stat.title}</div>
                                            <div className={`stat-value ${stat.color}`}>{stat.value}</div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                                <button
                                    onClick={() => handleNavigation('/signup')}
                                    className="btn btn-primary btn-lg gap-2 transform hover:scale-105 transition-all duration-300"
                                >
                                    <Rocket size={20} /> Get Started
                                </button>
                                <button
                                    onClick={() => handleNavigation('/login')}
                                    className="btn btn-outline btn-lg gap-2 transform hover:scale-105 transition-all duration-300"
                                >
                                    <Code size={20} /> Join Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="py-20 bg-base-100">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-base-content mb-4">
                                Why Developers Choose Us
                            </h2>
                            <p className="text-base-content/70 max-w-2xl mx-auto">
                                Join thousands of developers who've found their perfect coding companions
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {features.map((feature, index) => {
                                const IconComponent = feature.icon;
                                return (
                                    <div
                                        key={index}
                                        className="card bg-base-200 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                                    >
                                        <div className="card-body items-center text-center">
                                            <div className="text-primary mb-4 p-4 bg-primary/10 rounded-full">
                                                <IconComponent size={48} />
                                            </div>
                                            <h3 className="card-title text-base-content">{feature.title}</h3>
                                            <p className="text-base-content/70">{feature.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Social Proof */}
                <div className="py-12 bg-base-200">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <p className="text-base-content/60 mb-6">Trusted by developers from</p>
                        <div className="flex justify-center items-center gap-8 opacity-60 flex-wrap">
                            <Github size={32} className="hover:opacity-100 hover:text-primary transition-all cursor-pointer" />
                            <Linkedin size={32} className="hover:opacity-100 hover:text-primary transition-all cursor-pointer" />
                            <MessageCircle size={32} className="hover:opacity-100 hover:text-primary transition-all cursor-pointer" />
                            <div className="text-2xl font-bold hover:opacity-100 hover:text-primary transition-all cursor-pointer">Google</div>
                            <div className="text-2xl font-bold hover:opacity-100 hover:text-primary transition-all cursor-pointer">Microsoft</div>
                            <div className="text-2xl font-bold hover:opacity-100 hover:text-primary transition-all cursor-pointer">Meta</div>
                        </div>
                    </div>
                </div>

                {/* Footer CTA */}
                <div className="hero py-20 bg-primary text-primary-content">
                    <div className="hero-content text-center">
                        <div className="max-w-md">
                            <h2 className="text-3xl font-bold mb-4">Ready to Find Your Match?</h2>
                            <p className="mb-6">Join DevTinder today and start connecting with amazing developers!</p>
                            <button
                                onClick={() => handleNavigation('/signup')}
                                className="btn btn-secondary btn-lg gap-2"
                            >
                                <Heart size={20} /> Start Matching
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;