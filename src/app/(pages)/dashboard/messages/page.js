"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Loader2, MessageSquare, X, Clock, Search } from "lucide-react";
import dynamic from "next/dynamic";
import { io } from "socket.io-client";
import { useTranslation } from "../../../../TranslationContext";

const ChatWindow = dynamic(() => import("@/components/chat/ChatWindow"), {
  ssr: false,
});

const SOCKET_URL = "http://localhost:4000";

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
  const { t, locale } = useTranslation();
  const [inbox, setInbox] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [targetUserId, setTargetUserId] = useState(null);
  const [targetUserInfo, setTargetUserInfo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [chatMinimized, setChatMinimized] = useState(false);
  const [newMessageMap, setNewMessageMap] = useState({});
  const [socket, setSocket] = useState(null);

  // Initialize Socket.IO connection for real-time updates
  useEffect(() => {
    if (!userId) return;

    console.log("🔌 Initializing inbox socket connection");
    const newSocket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      timeout: 10000,
    });

    newSocket.on("connect", () => {
      console.log("✅ Inbox socket connected:", newSocket.id);
      // Join user's room to receive messages
      newSocket.emit("join", userId.toString());
    });

    newSocket.on("connect_error", (err) => {
      console.error("❌ Inbox socket connection error:", err);
    });

    // Listen for incoming messages to update inbox
    newSocket.on("private_message", (messageData) => {
      console.log("📩 Received message for inbox update:", messageData);

      // Only update if this message is for the current user
      if (parseInt(messageData.to) === userId) {
        // Create a message object that matches the inbox format
        const newMessage = {
          id: `temp-${Date.now()}`,
          sender_id: parseInt(messageData.from),
          receiver_id: parseInt(messageData.to),
          message: messageData.message,
          created_at: messageData.timestamp,
          sender_name: messageData.sender_name,
          sender_email: messageData.sender_email,
          receiver_name: messageData.receiver_name,
          receiver_email: messageData.receiver_email,
        };

        // Update inbox with new message
        setInbox((prevInbox) => {
          // Remove any existing messages from this conversation
          const filteredInbox = prevInbox.filter((msg) => {
            const isFromSameConversation =
              (msg.sender_id === newMessage.sender_id &&
                msg.receiver_id === newMessage.receiver_id) ||
              (msg.sender_id === newMessage.receiver_id &&
                msg.receiver_id === newMessage.sender_id);
            return !isFromSameConversation;
          });

          // Add the new message at the beginning (most recent)
          return [newMessage, ...filteredInbox];
        });

        // Mark as having new message if not currently chatting with this user
        const senderId = parseInt(messageData.from);
        if (targetUserId !== senderId) {
          setNewMessageMap((prev) => ({
            ...prev,
            [senderId]: true,
          }));
        }
      }
    });

    // Also listen for sent message confirmations to update inbox
    newSocket.on("message_sent_confirmation", (messageData) => {
      console.log("✓ Sent message confirmation for inbox:", messageData);

      if (parseInt(messageData.from) === userId) {
        const newMessage = {
          id: `temp-sent-${Date.now()}`,
          sender_id: parseInt(messageData.from),
          receiver_id: parseInt(messageData.to),
          message: messageData.message,
          created_at: messageData.timestamp,
          sender_name: messageData.sender_name,
          sender_email: messageData.sender_email,
          receiver_name: messageData.receiver_name,
          receiver_email: messageData.receiver_email,
        };

        // Update inbox with sent message
        setInbox((prevInbox) => {
          const filteredInbox = prevInbox.filter((msg) => {
            const isFromSameConversation =
              (msg.sender_id === newMessage.sender_id &&
                msg.receiver_id === newMessage.receiver_id) ||
              (msg.sender_id === newMessage.receiver_id &&
                msg.receiver_id === newMessage.sender_id);
            return !isFromSameConversation;
          });

          return [newMessage, ...filteredInbox];
        });
      }
    });

    setSocket(newSocket);

    return () => {
      console.log("🔌 Cleaning up inbox socket connection");
      newSocket.emit("leave_room");
      newSocket.close();
    };
  }, [userId, targetUserId]);

  // Load initial inbox data
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

    return Array.from(conversationMap.values()).sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
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
    console.log("User selected:", senderId);
    setTargetUserId(senderId);
    setChatMinimized(false);
    setNewMessageMap((prevMap) => ({ ...prevMap, [senderId]: false }));
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString(locale, {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 48) {
      return t("yesterday");
    } else {
      return date.toLocaleDateString(locale);
    }
  };
  const hasNewMessages = Object.values(newMessageMap).some(Boolean);

  console.log("Current state:", { targetUserId, targetUserInfo });

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <div className="max-w-3xl mx-auto p-4">
        <div className="flex items-center justify-center mb-6">
          <h1 className="text-2xl font-bold text-black mb-6">
            {t("messagesTitle")}
          </h1>
        </div>

        {userId ? (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-black">
                  {t("conversations")}
                </h2>
                {filteredSenders.length > 0 && (
                  <span className="bg-black text-white text-xs px-2 py-1 rounded-md font-medium">
                    {filteredSenders.length}
                  </span>
                )}
                {socket?.connected && (
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-md font-medium">
                    Live
                  </span>
                )}
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={t("searchPlaceholder")}
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
                    <p className="text-gray-700">{t("loadingConversations")}</p>
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
                      ? t("noMatchingConversations")
                      : t("noMessagesYet")}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    {searchTerm
                      ? t("tryDifferentSearch")
                      : t("startConversationHint")}
                  </p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-white border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                        {t("contactHeader")}
                        {/* ... */}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                        {t("lastMessageHeader")}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                        {t("timeHeader")}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                        {t("actionsHeader")}
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
                            <div className="text-gray-600 text-sm truncate max-w-xs">
                              {msg.message}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-gray-500 text-sm">
                              {formatTime(msg.created_at)}
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
                              {t("chatButton")}
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
                {t("signInRequired")}
              </h3>
              <p className="text-gray-700">{t("loginToAccessMessages")}</p>
            </div>
          </div>
        )}
      </div>

      {targetUserId && targetUserInfo && (
        <div
          className="fixed left-4 bottom-4 z-50 transition-all duration-300 ease-in-out"
          style={{ width: "350px", height: "50vh" }}
        >
          <div className="bg-white rounded-t-xl shadow border border-gray-300 overflow-hidden h-full flex flex-col">
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
      )}
    </div>
  );
};

export default Page;
