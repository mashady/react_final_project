"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import ChatWindow from "@/components/chat/ChatWindow";
import {
  Loader2,
  MessageSquare,
  X,
  Users,
  Clock,
  User,
  Mail,
  Search,
  Filter,
  MoreVertical,
} from "lucide-react";
import { io } from "socket.io-client";

const SOCKET_URL = typeof window !== "undefined" ? window.location.origin : "";

// Helper to get user display info from inbox message
function getUserDisplayFromMsg(msg, fallback) {
  return {
    name: msg?.sender_name || msg?.receiver_name || fallback?.name || "User",
    avatar:
      msg?.sender_avatar ||
      msg?.receiver_avatar ||
      fallback?.avatar ||
      "/owner.jpg",
    id: msg?.sender_id || fallback?.id,
  };
}

const Page = () => {
  const user = useSelector((state) => state.user.data);
  const userId = user?.id;
  const token =
    useSelector((state) => state.user.token) || localStorage.getItem("token");

  const [inbox, setInbox] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [targetUser, setTargetUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [targetUserInfo, setTargetUserInfo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [chatMinimized, setChatMinimized] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/messages/inbox`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { userId },
      })
      .then((res) => {
        setInbox(res.data || []);
      })
      .catch(() => setError("Failed to load inbox"))
      .finally(() => setLoading(false));
  }, [userId, token]);

  useEffect(() => {
    if (!userId) return;
    const socketInstance = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
    });
    setSocket(socketInstance);
    socketInstance.emit("join", userId.toString());

    // Only handle 'private_message' to avoid double message
    const updateInbox = (msg) => {
      setInbox((prev) => {
        const exists = prev.some(
          (m) =>
            m.sender_id === Number(msg.from) &&
            m.receiver_id === Number(msg.to) &&
            m.message === msg.message &&
            m.created_at === msg.timestamp
        );
        if (exists) return prev;
        return [
          {
            ...msg,
            sender_id: Number(msg.from),
            receiver_id: Number(msg.to),
            created_at: msg.timestamp,
          },
          ...prev,
        ];
      });
    };
    socketInstance.on("private_message", updateInbox);
    return () => {
      socketInstance.emit("leave_room");
      socketInstance.disconnect();
    };
  }, [userId]);

  // Use a unique key and correct user for each conversation
  const senders = Array.from(
    new Map(
      inbox.map((msg) => {
        const otherUserId =
          msg.sender_id === userId ? msg.receiver_id : msg.sender_id;
        const otherUserName =
          msg.sender_id === userId ? msg.receiver_name : msg.sender_name;
        const otherUserAvatar =
          msg.sender_id === userId ? msg.receiver_avatar : msg.sender_avatar;
        return [
          otherUserId,
          {
            ...msg,
            otherUserId,
            otherUserName,
            otherUserAvatar,
          },
        ];
      })
    ).values()
  );

  // Filter senders based on search term
  const filteredSenders = senders.filter((msg) => {
    const otherUserName =
      msg.sender_id === userId ? msg.receiver_name : msg.sender_name;
    return (
      otherUserName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.message?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Get user info for chat header
  useEffect(() => {
    if (!targetUser) return setTargetUserInfo(null);
    const msg = inbox.find(
      (m) => m.sender_id === targetUser || m.receiver_id === targetUser
    );
    if (msg) {
      const otherUserName =
        msg.sender_id === userId ? msg.receiver_name : msg.sender_name;
      const otherUserAvatar =
        msg.sender_id === userId ? msg.receiver_avatar : msg.sender_avatar;
      setTargetUserInfo({
        id: targetUser,
        name:
          otherUserName ||
          msg.sender_name ||
          msg.receiver_name ||
          `User ${targetUser}`,
        avatar:
          otherUserAvatar ||
          msg.sender_avatar ||
          msg.receiver_avatar ||
          "/owner.jpg",
      });
    } else {
      setTargetUserInfo({
        id: targetUser,
        name: `User ${targetUser}`,
        avatar: "/owner.jpg",
      });
    }
  }, [targetUser, inbox, userId]);

  // Close chat window when clicking outside or pressing escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && targetUser) {
        setTargetUser(null);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [targetUser]);

  const handleUserSelect = (senderId) => {
    setTargetUser(senderId);
    setChatMinimized(false);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return "Today";
    } else if (diffInDays === 1) {
      return "Yesterday";
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
   

      <div className="relative z-10 p-4 md:p-8">
        {/* Header */}
     

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {userId ? (
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 overflow-hidden">
              {/* Table Header */}
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-600" />
                    <h2 className="text-xl font-semibold text-gray-800">
                      Conversations
                    </h2>
                    {filteredSenders.length > 0 && (
                      <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
                        {filteredSenders.length}
                      </span>
                    )}
                  </div>

                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search conversations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 w-full sm:w-64"
                    />
                  </div>
                </div>
              </div>

              {/* Table Content */}
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="text-center">
                      <Loader2 className="animate-spin w-8 h-8 text-blue-600 mx-auto mb-3" />
                      <p className="text-gray-500">Loading conversations...</p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="text-center py-16">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
                      <p className="text-red-600 font-medium">{error}</p>
                    </div>
                  </div>
                ) : filteredSenders.length === 0 ? (
                  <div className="text-center py-16">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-lg font-medium">
                      {searchTerm
                        ? "No matching conversations"
                        : "No messages yet"}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      {searchTerm
                        ? "Try a different search term"
                        : "Start a conversation to see it here"}
                    </p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Contact
                        </th>
                     
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Time
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredSenders.map((msg) => {
                        const otherUserId =
                          msg.sender_id === userId
                            ? msg.receiver_id
                            : msg.sender_id;
                        const otherUserName =
                          msg.sender_id === userId
                            ? msg.receiver_name
                            : msg.sender_name;

                        return (
                          <tr
                            key={otherUserId}
                            className="hover:bg-blue-50 transition-colors duration-200 cursor-pointer group"
                            onClick={() => handleUserSelect(otherUserId)}
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center font-bold text-white text-sm group-hover:scale-105 transition-transform duration-200">
                                  {otherUserName
                                    ? otherUserName[0].toUpperCase()
                                    : "U"}
                                </div>
                                <div>
                                  <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                                    {otherUserName || `User ${otherUserId}`}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    ID: {otherUserId}
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Clock className="w-3 h-3" />
                                <span>{formatDate(msg.created_at)}</span>
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                {formatTime(msg.created_at)}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUserSelect(otherUserId);
                                }}
                                className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200 text-sm font-medium group-hover:bg-blue-600 group-hover:text-white"
                              >
                                <MessageSquare className="w-4 h-4" />
                                Chat
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 p-12 max-w-md mx-auto">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Sign in required
                </h3>
                <p className="text-gray-600">
                  Please log in to access your messages and start chatting
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Facebook Messenger Style Chat Popup */}
      {targetUser && targetUserInfo && (
        <div
          className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ease-in-out ${
            chatMinimized
              ? "transform translate-y-full"
              : "transform translate-y-0"
          }`}
          style={{
            width: "350px",
            height: chatMinimized ? "60px" : "500px",
          }}
        >
          <div className="bg-white rounded-t-2xl shadow-2xl border border-gray-200 overflow-hidden h-full flex flex-col">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-white text-sm">
                  {targetUserInfo.name
                    ? targetUserInfo.name[0].toUpperCase()
                    : "U"}
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">
                    {targetUserInfo.name}
                  </div>
                  <div className="text-blue-100 text-xs">Online</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setChatMinimized(!chatMinimized)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors duration-200"
                >
                  <span className="text-white text-lg font-bold">
                    {chatMinimized ? "↑" : "−"}
                  </span>
                </button>
                <button
                  onClick={() => setTargetUser(null)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors duration-200"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Chat Content */}
            {!chatMinimized && (
              <div className="flex-1 min-h-0">
                <ChatWindow
                  userId={userId}
                  targetUserId={targetUser}
                  forceOpen={true}
                  currentUser={user}
                  targetUser={targetUserInfo}
                  customStyles={{
                    popupStyle: {
                      position: "static",
                      boxShadow: "none",
                      borderRadius: 0,
                      width: "100%",
                      height: "100%",
                      minHeight: 0,
                      maxHeight: "100%",
                      background: "transparent",
                      border: "none",
                    },
                    bubbleButtonStyle: { display: "none" },
                  }}
                  onClose={() => setTargetUser(null)}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
