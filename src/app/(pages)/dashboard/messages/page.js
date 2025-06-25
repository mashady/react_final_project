"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Loader2, MessageSquare, X, Clock, Search } from "lucide-react";
import dynamic from "next/dynamic";

const ChatWindow = dynamic(() => import("@/components/chat/ChatWindow"), {
  ssr: false,
});

// Helper to get user display info from inbox message
function getUserDisplayFromMsg(msg, currentUserId, fallback) {
  const isCurrentUserSender = msg.sender_id === currentUserId;
  const otherUserId = isCurrentUserSender ? msg.receiver_id : msg.sender_id;

  const otherUserName = isCurrentUserSender
    ? msg.receiver_name
    : msg.sender_name;
  const otherUserEmail = isCurrentUserSender
    ? msg.receiver_email
    : msg.sender_email;

  let displayName = otherUserName;

  if (!displayName || displayName.trim() === "") {
    if (otherUserEmail) {
      displayName = otherUserEmail;
    } else {
      displayName = `User ${otherUserId}`;
    }
  }

  return {
    id: otherUserId,
    name: displayName,
    email: otherUserEmail,
    avatar: "/owner.jpg",
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
  const [targetUserId, setTargetUserId] = useState(null);
  const [targetUserInfo, setTargetUserInfo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [chatMinimized, setChatMinimized] = useState(false);
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
      .catch((err) => {
        console.error("Inbox error:", err);
        setError("Failed to load inbox");
      })
      .finally(() => setLoading(false));
  }, [userId, token]);

  const senders = useMemo(() => {
    if (!userId || !inbox.length) return [];

    const conversationMap = new Map();

    inbox.forEach((msg) => {
      const otherUserId =
        msg.sender_id === userId ? msg.receiver_id : msg.sender_id;

      if (
        !conversationMap.has(otherUserId) ||
        new Date(msg.created_at) >
          new Date(conversationMap.get(otherUserId).created_at)
      ) {
        conversationMap.set(otherUserId, msg);
      }
    });

    return Array.from(conversationMap.values());
  }, [inbox, userId]);

  const filteredSenders = senders.filter((msg) => {
    const userDisplay = getUserDisplayFromMsg(msg, userId, user);
    return (
      userDisplay.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userDisplay.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.message?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  useEffect(() => {
    if (!targetUserId) return setTargetUserInfo(null);

    const conversation = inbox.find(
      (m) => m.sender_id === targetUserId || m.receiver_id === targetUserId
    );

    if (conversation) {
      const userDisplay = getUserDisplayFromMsg(conversation, userId, user);
      setTargetUserInfo(userDisplay);
    } else {
      axios
        .get(`http://localhost:4000/api/users/${targetUserId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setTargetUserInfo({
            id: targetUserId,
            name: res.data.name || res.data.email || `User ${targetUserId}`,
            email: res.data.email,
            avatar: "/owner.jpg",
          });
        })
        .catch(() => {
          setTargetUserInfo({
            id: targetUserId,
            name: `User ${targetUserId}`,
            email: null,
            avatar: "/owner.jpg",
          });
        });
    }
  }, [targetUserId, inbox, userId, user, token]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && targetUserId) {
        setTargetUserId(null);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [targetUserId]);

  const handleUserSelect = (senderId) => {
    console.log("User selected:", senderId); // Debug log
    setTargetUserId(senderId);
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

  const hasNewMessages = Object.values(newMessageMap).some(Boolean);

  console.log("Current state:", { targetUserId, targetUserInfo }); // Debug log

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <div className="max-w-3xl mx-auto p-4">
        <div className="flex items-center justify-center mb-6">
          <h1 className="text-2xl font-bold text-black mb-6">Messages</h1>
        </div>

        {userId ? (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-black">
                  Conversations
                </h2>
                {filteredSenders.length > 0 && (
                  <span className="bg-black text-white text-xs px-2 py-1 rounded-md font-medium">
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
                  className="pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200 w-full sm:w-64 text-black"
                />
              </div>
            </div>

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
                  <div className="bg-gray-100 border border-gray-300 rounded-md p-6 max-w-md mx-auto">
                    <p className="text-black font-medium">{error}</p>
                  </div>
                </div>
              ) : filteredSenders.length === 0 ? (
                <div className="text-center py-16">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-black text-lg font-semibold">
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
                        Contact
                        {hasNewMessages && (
                          <span
                            className="ml-2 inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse"
                            title="New message"
                          ></span>
                        )}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredSenders.map((msg) => {
                      const userDisplay = getUserDisplayFromMsg(
                        msg,
                        userId,
                        user
                      );
                      const hasNew = newMessageMap[userDisplay.id];
                      return (
                        <tr
                          key={userDisplay.id}
                          className="hover:bg-gray-100 transition-colors duration-200 cursor-pointer group"
                          onClick={() => handleUserSelect(userDisplay.id)}
                        >
                          <td className="px-4 py-3">
                            <div className="font-semibold text-black group-hover:text-black transition-colors duration-200">
                              {userDisplay.name}
                              {hasNew && (
                                <span
                                  className="ml-2 inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse"
                                  title="New message"
                                ></span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUserSelect(userDisplay.id);
                              }}
                              className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white rounded-md hover:bg-gray-900 transition-colors duration-200 text-sm font-medium"
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
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-10 max-w-md mx-auto">
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

      {targetUserId && targetUserInfo && (
        <>
          {/* Optional: Backdrop for UX */}
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setTargetUserId(null)}
            aria-label="Close chat overlay"
          />
          <div
            className="fixed top-0 left-0 z-50 shadow-xl"
            style={{ width: 350, height: "100vh", maxWidth: "100vw" }}
          >
            <div className="bg-white rounded-r-xl shadow border border-gray-300 overflow-hidden h-full flex flex-col">
              {/* Chat Header (black, with close button) */}
              <div className="bg-black px-4 py-3 flex items-center justify-between">
                <div className="font-semibold text-white text-base truncate">
                  {targetUserInfo?.name || targetUserInfo?.email || "User"}
                </div>
                <button
                  onClick={() => setTargetUserId(null)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
                  aria-label="Close chat"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
              {/* Chat Content */}
              <div className="flex-1 min-h-0">
                <ChatWindow
                  userId={userId}
                  targetUserId={targetUserId}
                  currentUser={user}
                  targetUser={targetUserInfo}
                  forceOpen={true}
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
                  onClose={() => setTargetUserId(null)}
                  hideHeader={true}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Page;
