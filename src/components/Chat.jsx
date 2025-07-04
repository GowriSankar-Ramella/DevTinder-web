import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import axios from "axios";
import { BASE_URL } from "../constants";
import { Send, ArrowLeft, User, Clock, CheckCheck } from "lucide-react";

const Chat = () => {
    const { targetUserId } = useParams();
    const user = useSelector(store => store.auth?.user);
    const [prevMgs, setPrevMsgs] = useState([]);
    const [message, setMessage] = useState("");
    const [targetUser, setTargetUser] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [isConnected, setIsConnected] = useState(false);

    const handleInput = (e) => {
        setMessage(e.target.value);
    };

    const handleClick = () => {
        if (!message.trim()) return;

        const socket = createSocketConnection();
        socket.emit("sendMessage", {
            firstName: user.firstName,
            userId: user._id,
            targetUserId,
            lastName: user.lastName,
            text: message
        });

        // Add message to local state immediately for better UX
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
            handleClick();
        }
    };

    const fetchPrevChat = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/chat/${targetUserId}`, { withCredentials: true });
            setPrevMsgs(res.data.data.messages);

            // Set target user from first message if available
            if (res.data.data.messages.length > 0) {
                const firstMessage = res.data.data.messages[0];
                const targetUserData = firstMessage.senderId._id === user._id
                    ? res.data.data.messages.find(msg => msg.senderId._id !== user._id)?.senderId
                    : firstMessage.senderId;
                setTargetUser(targetUserData);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    useEffect(() => {
        if (!user) return;

        const socket = createSocketConnection();
        setIsConnected(true);

        socket.emit("joinChat", {
            firstName: user.firstName,
            userId: user._id,
            targetUserId
        });

        socket.on("messageReceived", ({ firstName, lastName, text }) => {
            console.log(`message received from ${firstName + " " + lastName} : ${text}`);
            setPrevMsgs(prevMgs => [...prevMgs, {
                senderId: { firstName, lastName, _id: targetUserId },
                text,
                createdAt: new Date().toISOString(),
                _id: Date.now().toString()
            }]);
        });

        fetchPrevChat();

        return () => {
            socket.disconnect();
            setIsConnected(false);
        };
    }, []);

    return (
        <div className="min-h-screen bg-base-200 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 h-screen flex flex-col">
                {/* Chat Header */}
                <div className="navbar bg-base-100/80 backdrop-blur-sm shadow-lg border-b border-base-300">
                    <div className="navbar-start">
                        <button className="btn btn-ghost btn-circle">
                            <ArrowLeft size={20} />
                        </button>
                        <div className="avatar online ml-2">
                            <div className="w-10 h-10 rounded-full">
                                {targetUser?.photoUrl ? (
                                    <img src={targetUser.photoUrl} alt={targetUser.firstName} />
                                ) : (
                                    <div className="bg-primary text-primary-content flex items-center justify-center w-full h-full">
                                        <User size={16} />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="ml-3">
                            <div className="font-semibold text-base-content">
                                {targetUser ? `${targetUser.firstName} ${targetUser.lastName}` : 'Loading...'}
                            </div>
                            <div className="text-xs text-base-content/60">
                                {isConnected ? 'Online' : 'Connecting...'}
                            </div>
                        </div>
                    </div>
                    <div className="navbar-end">
                        <div className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-success' : 'bg-error'}`}></div>
                            <span className="text-xs text-base-content/60">
                                {isConnected ? 'Connected' : 'Disconnected'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                                                <div className="w-8 h-8 rounded-full">
                                                    {msg.senderId.photoUrl ? (
                                                        <img src={msg.senderId.photoUrl} alt={msg.senderId.firstName} />
                                                    ) : (
                                                        <div className="bg-secondary text-secondary-content flex items-center justify-center w-full h-full">
                                                            <User size={12} />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        <div className={`chat-bubble ${isCurrentUser
                                            ? 'bg-primary text-primary-content'
                                            : 'bg-base-100 text-base-content shadow-lg'
                                            } relative`}>
                                            <div className="flex flex-col">
                                                <span className="text-sm">{msg.text}</span>
                                                <div className={`flex items-center gap-1 mt-1 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                                                    <Clock size={10} className="opacity-60" />
                                                    <span className="text-xs opacity-60">
                                                        {formatTime(msg.createdAt)}
                                                    </span>
                                                    {isCurrentUser && (
                                                        <CheckCheck size={12} className="opacity-60" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}

                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="flex items-center gap-2">
                                <div className="avatar">
                                    <div className="w-8 h-8 rounded-full bg-secondary text-secondary-content flex items-center justify-center">
                                        <User size={12} />
                                    </div>
                                </div>
                                <div className="chat-bubble bg-base-100 text-base-content shadow-lg">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-base-content/40 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-base-content/40 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-base-content/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Message Input */}
                <div className="bg-base-100/80 backdrop-blur-sm border-t border-base-300 p-4">
                    <div className="flex gap-2 max-w-4xl mx-auto">
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
                            onClick={handleClick}
                            disabled={!message.trim()}
                            className="btn btn-primary btn-square h-12 w-12 transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
                        >
                            <Send size={20} />
                        </button>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2 mt-2 max-w-4xl mx-auto">
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
            </div>
        </div>
    );
};

export default Chat;