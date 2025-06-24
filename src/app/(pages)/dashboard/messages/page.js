"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import ChatWindow from "@/components/chat/ChatWindow";
import { Loader2, MessageSquare, X, Clock, Search } from "lucide-react";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:4000";

// Helper to get user display info from inbox message
function getUserDisplayFromMsg(msg, fallback) {
  let name = msg?.sender_name || msg?.receiver_name || fallback?.name || "User";
  if (
    (/^User\s*\d+$/.test(name) || /^User\d+$/.test(name)) &&
    fallback?.name &&
    !/^User\s*\d+$/.test(fallback.name) &&
    !/^User\d+$/.test(fallback.name)
  ) {
    name = fallback.name;
  }
  if ((/^User\s*\d+$/.test(name) || /^User\d+$/.test(name)) && fallback) {
    if (fallback.email) name = fallback.email;
  }
  if (/^user\s*\d+$/.test(name) || /^User\d+$/.test(name)) {
    if (msg?.sender_email) name = msg.sender_email;
    else if (msg?.receiver_email) name = msg.receiver_email;
  }
  return {
    name,
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
  const [targetUserId, setTargetUserId] = useState(null);
  const [socket, setSocket] = useState(null);
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
      .catch(() => setError("Failed to load inbox"))
      .finally(() => setLoading(false));
  }, [userId, token]);

  useEffect(() => {
    if (!userId) return;
    const socketInstance = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
    });
    setSocket(socketInstance);
    socketInstance.on("connect", () => {
      console.log("Socket connected:", socketInstance.id);
      socketInstance.emit("join", userId.toString());
    });

    socketInstance.on("private_message", (msg) => {
      console.log("Raw socket message:", msg);
      setInbox((prev) => {
        const messageObj = {
          id: `temp-${Date.now()}`,
          sender_id: Number(msg.from),
          receiver_id: Number(msg.to),
          message: msg.message,
          created_at: msg.timestamp,
          is_read: false,
          sender_name: msg.sender_name,
          sender_email: msg.sender_email,
          sender_avatar: msg.sender_avatar,
          receiver_name: msg.receiver_name,
          receiver_email: msg.receiver_email,
          receiver_avatar: msg.receiver_avatar,
        };

        const exists = prev.some(
          (m) =>
            m.sender_id === messageObj.sender_id &&
            m.receiver_id === messageObj.receiver_id &&
            m.message === messageObj.message &&
            m.created_at === messageObj.created_at
        );
        if (exists) {
          console.log("Duplicate message ignored:", messageObj);
          return prev;
        }

        const otherUserId =
          Number(msg.from) === userId ? Number(msg.to) : Number(msg.from);
        if (!targetUserId || otherUserId !== Number(targetUserId)) {
          setNewMessageMap((prevMap) => ({ ...prevMap, [otherUserId]: true }));
        }

        console.log("Adding new message to inbox:", messageObj);
        return [messageObj, ...prev];
      });
    });

    return () => {
      socketInstance.emit("leave_room");
      socketInstance.disconnect();
    };
  }, [userId, targetUserId]);

  useEffect(() => {
    console.log(
      "Inbox updated:",
      inbox.map((m) => ({
        sender_id: m.sender_id,
        receiver_id: m.receiver_id,
        message: m.message,
        created_at: m.created_at,
      }))
    );
  }, [inbox]);

  const senders = useMemo(() => {
    const result = Array.from(
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
    console.log(
      "Computed senders:",
      result.map((s) => ({
        otherUserId: s.otherUserId,
        message: s.message,
        created_at: s.created_at,
      }))
    );
    return result;
  }, [inbox, userId]);

  const filteredSenders = senders.filter((msg) => {
    const otherUserName =
      msg.sender_id === userId ? msg.receiver_name : msg.sender_name;
    return (
      otherUserName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.message?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  useEffect(() => {
    if (!targetUserId) return setTargetUserInfo(null);
    const msg = inbox.find(
      (m) => m.sender_id === targetUserId || m.receiver_id === targetUserId
    );
    if (msg) {
      setTargetUserInfo(
        getUserDisplayFromMsg(msg, {
          id: targetUserId,
          name: user?.name,
          email: user?.email,
          avatar: user?.avatar,
        })
      );
    } else {
      setTargetUserInfo({
        id: targetUserId,
        name: user?.name || user?.email || `User ${targetUserId}`,
        avatar: user?.avatar || "/owner.jpg",
      });
    }
  }, [targetUserId, inbox, user?.id, user?.name, user?.email, user?.avatar]);

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

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    }
    if (diffDays === 1) {
      return "Yesterday";
    }
    if (diffDays < 7) {
      return `${diffDays} days ago`;
    }

    return date.toLocaleDateString();
  };

  const hasNewMessages = Object.values(newMessageMap).some(Boolean);

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
                            <div className="font-semibold text-black group-hover:text-black transition-colors duration-200">
                              {otherUserName || `User ${otherUserId}`}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUserSelect(otherUserId);
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
        <div
          className={`fixed bottom-4 left-4 z-50 transition-all duration-300 ease-in-out ${
            chatMinimized ? "translate-y-full" : "translate-y-0"
          }`}
          style={{
            width: "350px",
            height: chatMinimized ? "60px" : "500px",
          }}
        >
          <div className="bg-white rounded-t-xl shadow-xl border border-gray-300 overflow-hidden h-full flex flex-col">
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
                  onClick={() => setTargetUserId(null)}
                  className="w-8 h-8 rounded bg-white/20 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {!chatMinimized && (
              <div className="flex-1 min-h-0">
                <ChatWindow
                  userId={userId}
                  targetUserId={targetUserId}
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
                      minHeight: "0",
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
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
