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

const SOCKET_URL = "http://localhost:4000";

// Helper to get user display info from inbox message
function getUserDisplayFromMsg(msg, fallback) {
  // Prefer sender_name/receiver_name, fallback to fallback.name, fallback to 'User'
  let name = msg?.sender_name || msg?.receiver_name || fallback?.name || "User";
  // If name is 'User 123' or 'User{id}', but fallback has a real name, prefer fallback
  if (
    (/^User\s*\d+$/i.test(name) || /^User\d+$/i.test(name)) &&
    fallback?.name &&
    !/^User\s*\d+$/i.test(fallback.name) &&
    !/^User\d+$/i.test(fallback.name)
  ) {
    name = fallback.name;
  }
  // If fallback has username or email, prefer those over 'User {id}'
  if ((/^User\s*\d+$/i.test(name) || /^User\d+$/i.test(name)) && fallback) {
    if (fallback.username) name = fallback.username;
    else if (fallback.email) name = fallback.email;
  }
  // If msg has username/email for sender/receiver, prefer those over fallback
  if (/^User\s*\d+$/i.test(name) || /^User\d+$/i.test(name)) {
    if (msg?.sender_username) name = msg.sender_username;
    else if (msg?.sender_email) name = msg.sender_email;
    else if (msg?.receiver_username) name = msg.receiver_username;
    else if (msg?.receiver_email) name = msg.receiver_email;
  }
  return {
    name: name,
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
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [newMessageMap, setNewMessageMap] = useState({});

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    axios
      .get(`http://localhost:4000/api/messages/inbox`, {
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
        const otherUserId =
          Number(msg.from) === userId ? Number(msg.to) : Number(msg.from);
        if (!targetUser || otherUserId !== targetUser) {
          setNewMessageMap((prevMap) => ({ ...prevMap, [otherUserId]: true }));
        }
        return [
          {
            ...msg,
            sender_id: Number(msg.from),
            receiver_id: Number(msg.to),
            created_at: msg.timestamp,
            sender_name: msg.sender_name,
            sender_username: msg.sender_username,
            sender_email: msg.sender_email,
            sender_avatar: msg.sender_avatar,
            receiver_name: msg.receiver_name,
            receiver_username: msg.receiver_username,
            receiver_email: msg.receiver_email,
            receiver_avatar: msg.receiver_avatar,
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
  }, [userId, targetUser]);

  // Use a unique key and correct user for each conversation
  const sortedInbox = [...inbox].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  // Create senders array with the most recent message per conversation
  const senders = Array.from(
    new Map(
      sortedInbox.map((msg) => {
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
      // Use getUserDisplayFromMsg to get the best name, passing full user object as fallback
      setTargetUserInfo(
        getUserDisplayFromMsg(msg, {
          id: targetUser,
          name: user?.name,
          username: user?.username,
          email: user?.email,
          avatar: user?.avatar,
        })
      );
    } else {
      setTargetUserInfo({
        id: targetUser,
        name:
          user?.name || user?.username || user?.email || `User ${targetUser}`,
        avatar: "/owner.jpg",
      });
    }
  }, [targetUser, inbox, userId, user]);

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
    setNewMessageMap((prevMap) => ({ ...prevMap, [senderId]: false }));
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
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-3xl mx-auto p-4">
        {/* Header */}
        <div className="text-center mb-8"></div>

        {/* Main Content */}
        <div>
          {userId ? (
            <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
              {/* Table Header */}
              <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold text-black">
                    Conversations
                  </h2>
                  {filteredSenders.length > 0 && (
                    <span className="bg-black text-white text-xs px-2 py-1 rounded-full font-medium">
                      {filteredSenders.length}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-white border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200 w-full sm:w-64 text-black"
                  />
                </div>
              </div>

              {/* Table Content */}
              <div>
                {loading ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="text-center">
                      <Loader2 className="animate-spin w-8 h-8 text-black mx-auto mb-3" />
                      <p className="text-gray-700">Loading conversations...</p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="text-center py-16">
                    <div className="bg-gray-100 border border-gray-300 rounded-xl p-6 max-w-md mx-auto">
                      <p className="text-black font-medium">{error}</p>
                    </div>
                  </div>
                ) : filteredSenders.length === 0 ? (
                  <div className="text-center py-16">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-black text-lg font-medium">
                      {searchTerm
                        ? "No matching conversations"
                        : "No messages yet"}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      {searchTerm
                        ? "Try a different search term"
                        : "Start a conversation to see it here"}
                    </p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-white border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                          Contact{" "}
                          {hasNewMessage && (
                            <span
                              className="ml-2 inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse"
                              title="New message"
                            ></span>
                          )}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider hidden md:table-cell">
                          Last Message
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                          Time
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
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
                            className="hover:bg-gray-100 transition-colors duration-200 cursor-pointer group"
                            onClick={() => handleUserSelect(otherUserId)}
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-black flex items-center justify-center font-bold text-white text-sm group-hover:scale-105 transition-transform duration-200 relative">
                                  {otherUserName
                                    ? otherUserName[0].toUpperCase()
                                    : "U"}
                                  {newMessageMap[otherUserId] && (
                                    <span
                                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 border-2 border-white flex items-center justify-center animate-bounce shadow-lg"
                                      title="New message"
                                      style={{ zIndex: 2 }}
                                    >
                                      <span className="block w-2 h-2 bg-white rounded-full"></span>
                                    </span>
                                  )}
                                </div>
                                <div>
                                  <div className="font-semibold text-black group-hover:text-black transition-colors duration-200">
                                    {otherUserName || `User ${otherUserId}`}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    ID: {otherUserId}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 hidden md:table-cell">
                              <div className="max-w-xs truncate text-black group-hover:text-black transition-colors duration-200">
                                {msg.message}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1 text-sm text-gray-700">
                                <Clock className="w-3 h-3" />
                                <span>{formatDate(msg.created_at)}</span>
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                {formatTime(msg.created_at)}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUserSelect(otherUserId);
                                }}
                                className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors duration-200 text-sm font-medium"
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
              <div className="bg-white rounded-xl shadow border border-gray-200 p-10 max-w-md mx-auto">
                <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-black mb-2">
                  Sign in required
                </h3>
                <p className="text-gray-700">
                  Please log in to access your messages and start chatting
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Simple Chat Popup */}
      {targetUser && targetUserInfo && (
        <div
          className={`fixed bottom-4 left-4 z-50 transition-all duration-300 ease-in-out ${
            chatMinimized ? "translate-y-full" : "translate-y-0"
          }`}
          style={{
            width: "350px",
            height: chatMinimized ? "60px" : "500px",
          }}
        >
          <div className="bg-white rounded-t-xl shadow border border-gray-300 overflow-hidden h-full flex flex-col">
            {/* Single Chat Header (no avatar, no online, no user id) */}
            <div className="bg-black px-4 py-3 flex items-center justify-between">
              <div className="font-semibold text-white text-base truncate">
                {targetUserInfo.name}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setChatMinimized(!chatMinimized)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
                >
                  <span className="text-white text-lg font-bold">
                    {chatMinimized ? "↑" : "−"}
                  </span>
                </button>
                <button
                  onClick={() => setTargetUser(null)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
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
                  hideHeader={true}
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
