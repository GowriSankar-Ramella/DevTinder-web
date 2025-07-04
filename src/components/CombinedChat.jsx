import { useEffect, useState, useRef } from "react";
import { MessageCircle, Search, Code, Heart, Users, Clock, ChevronRight, Send, ArrowLeft, User, CheckCheck } from "lucide-react";
import { BASE_URL } from "../constants";
import { useSelector } from "react-redux";
import axios from "axios";
import { createSocketConnection } from "../utils/socket";

const CombinedChatInterface = () => {
    const [allChats, setAllChats] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedChat, setSelectedChat] = useState(null);
    const [prevMgs, setPrevMsgs] = useState([]);
    const [message, setMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [typingUsers, setTypingUsers] = useState(new Map()); // Map<userId, {firstName, isTyping}>
    const [socket, setSocket] = useState(null);
    const [typingTimeout, setTypingTimeout] = useState(null);
    const user = useSelector(store => store?.auth?.user);

    // Add ref for messages container
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    // Function to scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Auto-scroll when messages change
    useEffect(() => {
        scrollToBottom();
    }, [prevMgs]);

    // Auto-scroll when typing indicator changes
    useEffect(() => {
        if (selectedChat && typingUsers.has(selectedChat._id)) {
            scrollToBottom();
        }
    }, [typingUsers, selectedChat]);

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

    const fetchPrevChat = async (targetUserId) => {
        try {
            const res = await axios.get(`${BASE_URL}/chat/${targetUserId}`, { withCredentials: true });
            setPrevMsgs(res.data.data.messages);
        } catch (error) {
            console.log(error);
        }
    };

    // Initialize socket and handle user online status
    useEffect(() => {
        if (!user) return;

        const socketInstance = createSocketConnection();
        setSocket(socketInstance);
        setIsConnected(true);

        // Emit user online status
        socketInstance.emit("user-online", {
            userId: user._id,
            firstName: user.firstName,
            lastName: user.lastName
        });

        // Listen for online users updates
        socketInstance.on("online-users-updated", (users) => {
            setOnlineUsers(users);
        });

        // Listen for typing indicators
        socketInstance.on("user-typing", ({ userId, firstName, isTyping }) => {
            setTypingUsers(prev => {
                const updated = new Map(prev);
                if (isTyping) {
                    updated.set(userId, { firstName, isTyping: true });
                } else {
                    updated.delete(userId);
                }
                return updated;
            });
        });

        return () => {
            // Emit user offline status before disconnecting
            socketInstance.emit("user-offline", {
                userId: user._id,
                firstName: user.firstName
            });
            socketInstance.disconnect();
            setIsConnected(false);
        };
    }, [user]);

    useEffect(() => {
        fetchAllChats();
    }, []);

    useEffect(() => {
        if (!user || !selectedChat || !socket) return;

        socket.emit("joinChat", {
            firstName: user.firstName,
            userId: user._id,
            targetUserId: selectedChat._id
        });

        const handleMessageReceived = ({ firstName, lastName, text, userId, targetUserId }) => {
            // Only add the message if it's not from the current user
            if (userId !== user._id) {
                setPrevMsgs(prevMgs => [...prevMgs, {
                    senderId: { firstName, lastName, _id: userId },
                    text,
                    createdAt: new Date().toISOString(),
                    _id: Date.now().toString()
                }]);
            }
        };

        socket.on("messageReceived", handleMessageReceived);
        fetchPrevChat(selectedChat._id);

        return () => {
            socket.off("messageReceived", handleMessageReceived);
        };
    }, [selectedChat, user, socket]);

    const getChatPartner = (participants) => {
        const currentUserId = user._id;
        return participants.find(p => p._id !== currentUserId);
    };

    const getLastMessage = (messages) => {
        if (!messages || messages.length === 0) return null;
        return messages[messages.length - 1];
    };

    const isUserOnline = (userId) => {
        return onlineUsers.some(onlineUser => onlineUser.userId === userId);
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

    const formatChatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const handleChatSelect = (chat) => {
        const partner = getChatPartner(chat.participants);
        setSelectedChat(partner);
        // Clear typing indicators when switching chats
        setTypingUsers(new Map());
    };

    const handleInput = (e) => {
        setMessage(e.target.value);

        // Handle typing indicators
        if (!socket || !selectedChat) return;

        // Start typing indicator
        socket.emit("typing-start", {
            userId: user._id,
            targetUserId: selectedChat._id,
            firstName: user.firstName
        });

        // Clear existing timeout
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        // Set new timeout to stop typing indicator
        const timeout = setTimeout(() => {
            socket.emit("typing-stop", {
                userId: user._id,
                targetUserId: selectedChat._id,
                firstName: user.firstName
            });
        }, 1000);

        setTypingTimeout(timeout);
    };

    const handleSendMessage = () => {
        if (!message.trim() || !selectedChat || !socket) return;

        // Stop typing indicator
        socket.emit("typing-stop", {
            userId: user._id,
            targetUserId: selectedChat._id,
            firstName: user.firstName
        });

        // Clear typing timeout
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        socket.emit("sendMessage", {
            firstName: user.firstName,
            userId: user._id,
            targetUserId: selectedChat._id,
            lastName: user.lastName,
            text: message
        });

        // Add message to local state immediately for better UX (optimistic update)
        setPrevMsgs(prev => [...prev, {
            senderId: { _id: user._id, firstName: user.firstName, lastName: user.lastName },
            text: message,
            createdAt: new Date().toISOString(),
            _id: Date.now().toString()
        }]);

        setMessage("");
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const filteredChats = allChats.filter(chat => {
        const partner = getChatPartner(chat.participants);
        const fullName = `${partner?.firstName || ""} ${partner?.lastName || ""}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
    });

    // Check if selected chat partner is typing
    const isPartnerTyping = selectedChat && typingUsers.has(selectedChat._id);

    return (
        <div className="h-screen bg-base-200 flex">
            {/* Chat List Sidebar */}
            <div className="w-1/3 bg-base-100 border-r border-base-300 flex flex-col">
                {/* Search Header */}
                <div className="p-4 border-b border-base-300">
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

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="loading loading-spinner loading-lg text-primary"></div>
                        </div>
                    ) : filteredChats.length === 0 ? (
                        <div className="text-center py-12 px-4">
                            <div className="text-4xl mb-4 opacity-20">
                                <MessageCircle size={48} className="mx-auto" />
                            </div>
                            <h3 className="text-lg font-semibold text-base-content mb-2">
                                {searchTerm ? "No matches found" : "No conversations yet"}
                            </h3>
                            <p className="text-base-content/60 text-sm">
                                {searchTerm ? "Try searching for a different name" : "Start swiping to find your perfect coding partner!"}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {filteredChats.map((chat) => {
                                const partner = getChatPartner(chat.participants);
                                const lastMessage = getLastMessage(chat.messages);
                                const currentUserId = user._id;
                                const isSelected = selectedChat?._id === partner?._id;
                                const partnerOnline = isUserOnline(partner?._id);

                                return (
                                    <div
                                        key={chat._id}
                                        className={`p-4 cursor-pointer hover:bg-base-200 transition-colors border-b border-base-300/50 ${isSelected ? 'bg-primary/10 border-l-4 border-l-primary' : ''
                                            }`}
                                        onClick={() => handleChatSelect(chat)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="w-12 h-12 rounded-full bg-primary text-primary-content flex items-center justify-center relative">
                                                    {partner?.photoUrl ? (
                                                        <img
                                                            src={partner.photoUrl}
                                                            alt={`${partner.firstName} ${partner.lastName}`}
                                                            className="w-full h-full rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-sm font-semibold">
                                                            {partner?.firstName?.charAt(0)}{partner?.lastName?.charAt(0)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-semibold text-base-content truncate">
                                                            {partner?.firstName} {partner?.lastName}
                                                        </h3>
                                                        {partnerOnline && (
                                                            <div className="w-2 h-2 bg-success rounded-full"></div>
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-base-content/50">
                                                        {formatTime(chat.updatedAt)}
                                                    </span>
                                                </div>

                                                {lastMessage && (
                                                    <p className="text-sm text-base-content/60 truncate">
                                                        {lastMessage.senderId._id === currentUserId ? "You: " : ""}
                                                        {lastMessage.text}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer Stats */}
                <div className="p-4 border-t border-base-300 bg-base-100">
                    <div className="flex justify-between items-center text-xs text-base-content/60">
                        <div className="flex items-center gap-1">
                            <Users size={14} />
                            <span>{allChats.length} Chats</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-success rounded-full"></div>
                            <span>{onlineUsers.length} Online</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col">
                {selectedChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="bg-base-100 border-b border-base-300 p-4">
                            <div className="flex items-center gap-3">
                                <div className="avatar">
                                    <div className="w-10 h-10 rounded-full relative">
                                        {selectedChat?.photoUrl ? (
                                            <img src={selectedChat.photoUrl} alt={selectedChat.firstName} className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            <div className="bg-primary text-primary-content flex items-center justify-center w-full h-full rounded-full">
                                                <User size={16} />
                                            </div>
                                        )}

                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold text-base-content">
                                        {selectedChat.firstName} {selectedChat.lastName}
                                    </div>
                                    <div className="text-xs text-base-content/60">
                                        {isPartnerTyping
                                            ? 'typing...'
                                            : isUserOnline(selectedChat._id)
                                                ? 'Online'
                                                : 'Offline'
                                        }
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-success' : 'bg-error'}`}></div>
                                    <span className="text-xs text-base-content/60">
                                        {isConnected ? 'Connected' : 'Disconnected'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-base-200">
                            {prevMgs.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <div className="text-6xl mb-4">💬</div>
                                    <h3 className="text-xl font-semibold text-base-content mb-2">Start the conversation!</h3>
                                    <p className="text-base-content/60">Send a message to begin chatting</p>
                                </div>
                            ) : (
                                prevMgs.map((msg) => {
                                    const isCurrentUser = msg.senderId._id === user._id;

                                    return (
                                        <div key={msg._id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`flex items-end gap-2 max-w-xs lg:max-w-md ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                                                {!isCurrentUser && (
                                                    <div className="avatar">
                                                        <div className="w-8 h-8 rounded-full relative">
                                                            {selectedChat.photoUrl ? (
                                                                <img src={selectedChat.photoUrl} alt={selectedChat.firstName} className="w-full h-full rounded-full object-cover" />
                                                            ) : (
                                                                <div className="bg-secondary text-secondary-content flex items-center justify-center w-full h-full rounded-full">
                                                                    <User size={12} />
                                                                </div>
                                                            )}

                                                        </div>
                                                    </div>
                                                )}

                                                <div className={`relative px-4 py-3 rounded-2xl max-w-xs lg:max-w-md ${isCurrentUser
                                                    ? 'bg-primary text-primary-content rounded-br-md'
                                                    : 'bg-base-100 text-base-content shadow-lg border border-base-300 rounded-bl-md'
                                                    }`}>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm leading-relaxed mb-1">{msg.text}</span>
                                                        <div className={`flex items-center gap-1 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                                                            <Clock size={10} className="opacity-50" />
                                                            <span className="text-xs opacity-50">
                                                                {formatChatTime(msg.createdAt)}
                                                            </span>
                                                            {isCurrentUser && (
                                                                <CheckCheck size={12} className="opacity-50 ml-1" />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}

                            {/* Typing Indicator */}
                            {isPartnerTyping && (
                                <div className="flex justify-start">
                                    <div className="flex items-center gap-2">
                                        <div className="avatar">
                                            <div className="w-8 h-8 rounded-full relative">
                                                {selectedChat.photoUrl ? (
                                                    <img src={selectedChat.photoUrl} alt={selectedChat.firstName} className="w-full h-full rounded-full object-cover" />
                                                ) : (
                                                    <div className="bg-secondary text-secondary-content flex items-center justify-center w-full h-full rounded-full">
                                                        <User size={12} />
                                                    </div>
                                                )}

                                            </div>
                                        </div>
                                        <div className="bg-base-100 text-base-content shadow-lg border border-base-300 rounded-2xl rounded-bl-md px-4 py-3">
                                            <div className="flex gap-1">
                                                <div className="w-2 h-2 bg-base-content/40 rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 bg-base-content/40 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                <div className="w-2 h-2 bg-base-content/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Invisible div to scroll to */}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <div className="bg-base-100 border-t border-base-300 p-4">
                            <div className="flex gap-2">
                                <div className="flex-1 relative">
                                    <textarea
                                        className="textarea textarea-bordered w-full resize-none pr-12 bg-base-200 focus:bg-base-100 transition-colors duration-200"
                                        placeholder="Type your message..."
                                        value={message}
                                        onChange={handleInput}
                                        onKeyPress={handleKeyPress}
                                        rows="1"
                                        style={{
                                            minHeight: '3rem',
                                            maxHeight: '8rem',
                                            overflow: 'hidden'
                                        }}
                                    />
                                    <div className="absolute right-2 bottom-2 text-xs text-base-content/40">
                                        {message.length}/500
                                    </div>
                                </div>
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!message.trim()}
                                    className="btn btn-primary btn-square h-12 w-12 transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
                                >
                                    <Send size={20} />
                                </button>
                            </div>

                            {/* Quick Actions */}
                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={() => setMessage("Hey there! 👋")}
                                    className="btn btn-ghost btn-xs"
                                >
                                    👋 Wave
                                </button>
                                <button
                                    onClick={() => setMessage("Want to collaborate on a project? 🚀")}
                                    className="btn btn-ghost btn-xs"
                                >
                                    🚀 Collaborate
                                </button>
                                <button
                                    onClick={() => setMessage("Let's connect! 🤝")}
                                    className="btn btn-ghost btn-xs"
                                >
                                    🤝 Connect
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    /* No Chat Selected */
                    <div className="flex-1 flex items-center justify-center bg-base-200">
                        <div className="text-center">
                            <div className="text-6xl mb-4 opacity-20">
                                <MessageCircle size={64} className="mx-auto" />
                            </div>
                            <h3 className="text-2xl font-semibold text-base-content mb-2">Welcome to DevTinder Chat</h3>
                            <p className="text-base-content/60">Select a conversation to start chatting</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CombinedChatInterface;