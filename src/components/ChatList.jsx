import { useEffect, useState } from "react";
import { MessageCircle, Search, Code, Heart, Users, Clock, ChevronRight } from "lucide-react";
import { BASE_URL } from "../constants";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ChatList = () => {
    const [allChats, setAllChats] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const user = useSelector(store => store?.auth?.user)
    const navigate = useNavigate()

    const fetchAllChats = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${BASE_URL}/chat/all`, { withCredentials: true });
            setAllChats(res.data.data.chats);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching chats:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllChats();
    }, []);

    const getChatPartner = (participants) => {
        const currentUserId = user._id
        return participants.find(p => p._id !== currentUserId);
    };

    const getLastMessage = (messages) => {
        if (!messages || messages.length === 0) return null;
        return messages[messages.length - 1];
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        if (diffInHours < 1) {
            return "Just now";
        } else if (diffInHours < 24) {
            return `${Math.floor(diffInHours)}h ago`;
        } else if (diffInHours < 168) {
            return `${Math.floor(diffInHours / 24)}d ago`;
        } else {
            return date.toLocaleDateString();
        }
    };

    const gotoChat = (targetid) => {
        navigate(`/chat/${targetid}`)
    }

    const filteredChats = allChats.filter(chat => {
        const partner = getChatPartner(chat.participants);
        const fullName = `${partner?.firstName || ""} ${partner?.lastName || ""}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
    });

    return (
        <div className="min-h-screen flex flex-col bg-base-200">
            {/* Header */}
            <div className="bg-base-100 shadow-lg sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40" size={20} />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            className="input input-bordered w-full pl-10 bg-base-200"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Chat List Content */}
            <div className="flex-1">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="loading loading-spinner loading-lg text-primary"></div>
                        </div>
                    ) : filteredChats.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4 opacity-20">
                                <MessageCircle size={64} className="mx-auto" />
                            </div>
                            <h3 className="text-xl font-semibold text-base-content mb-2">
                                {searchTerm ? "No matches found" : "No conversations yet"}
                            </h3>
                            <p className="text-base-content/60">
                                {searchTerm ? "Try searching for a different name" : "Start swiping to find your perfect coding partner!"}
                            </p>
                            {!searchTerm && (
                                <button className="btn btn-primary mt-4 gap-2">
                                    <Code size={16} />
                                    Start Matching
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredChats.map((chat) => {
                                const partner = getChatPartner(chat.participants);
                                const lastMessage = getLastMessage(chat.messages);
                                const currentUserId = user._id;

                                return (
                                    <div
                                        key={chat._id}
                                        className="card bg-base-100 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.02] border border-base-300"
                                    >
                                        <div className="card-body p-4">
                                            <div className="flex items-center gap-4" >
                                                <div className="avatar placeholder">
                                                    <div className="bg-primary text-primary-content rounded-full w-12 h-12 flex items-center justify-center">
                                                        <img
                                                            src={partner.photoUrl}
                                                            alt={`${partner.firstName} ${partner.lastName}`}
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                                e.target.parentElement.querySelector('.placeholder-avatar').style.display = 'flex';
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h3 className="font-semibold text-base-content truncate">
                                                            {partner?.firstName} {partner?.lastName}
                                                        </h3>
                                                        <div className="flex items-center gap-1 text-base-content/50 text-sm">
                                                            <Clock size={14} />
                                                            <span>{formatTime(chat.updatedAt)}</span>
                                                        </div>
                                                    </div>

                                                    {lastMessage && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-base-content/60 text-sm truncate">
                                                                {lastMessage.senderId._id === currentUserId ? "You: " : ""}
                                                                {lastMessage.text}
                                                            </span>
                                                            <div className="flex items-center gap-1 text-base-content/40">
                                                                <span className="text-xs">•</span>
                                                                <span className="text-xs">{chat.messages.length} messages</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="text-base-content/40">
                                                    <ChevronRight size={20} />
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

            {/* Sticky Footer */}
            <div className="bg-base-100 py-6 border-t border-base-300">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="flex justify-center items-center gap-8 text-sm text-base-content/60">
                        <div className="flex items-center gap-2">
                            <Users size={16} />
                            <span>{allChats.length} Active Chats</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MessageCircle size={16} />
                            <span>{allChats.reduce((acc, chat) => acc + chat.messages.length, 0)} Messages</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Code size={16} />
                            <span>Keep Coding!</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatList;
