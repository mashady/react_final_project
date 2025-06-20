"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import ChatWindow from "@/components/chat/ChatWindow";
import {
  Loader2,
  ChevronRight,
  MessageSquare,
  X,
  Users,
  Clock,
  ArrowLeft,
} from "lucide-react";
import { io } from "socket.io-client";

const SOCKET_URL = typeof window !== "undefined" ? window.location.origin : "";

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

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    axios
      .get("/api/messages/inbox", {
        headers: { Authorization: `Bearer ${token}` },
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

    socketInstance.on("private_message", (msg) => {
      setInbox((prev) => {
        // If the message is already in the inbox, don't add it again
        const exists = prev.some(
          (m) =>
            m.sender_id === Number(msg.from) &&
            m.receiver_id === Number(msg.to) &&
            m.message === msg.message &&
            m.created_at === msg.timestamp
        );
        if (exists) return prev;
        // If the message is from the current chat, update the message list for that chat
        // Otherwise, update the preview for the sender in the inbox
        let updated = false;
        const updatedInbox = prev.map((m) => {
          if (
            (m.sender_id === Number(msg.from) &&
              m.receiver_id === Number(msg.to)) ||
            (m.sender_id === Number(msg.to) &&
              m.receiver_id === Number(msg.from))
          ) {
            updated = true;
            return {
              ...m,
              message: msg.message,
              created_at: msg.timestamp,
            };
          }
          return m;
        });
        if (!updated) {
          // New conversation
          return [
            {
              ...msg,
              sender_id: Number(msg.from),
              receiver_id: Number(msg.to),
              created_at: msg.timestamp,
            },
            ...prev,
          ];
        }
        return updatedInbox;
      });
    });

    return () => {
      socketInstance.emit("leave_room");
      socketInstance.disconnect();
    };
  }, [userId]);

  const senders = Array.from(
    new Map(inbox.map((msg) => [msg.sender_id, msg])).values()
  );

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
    // If same user is clicked, close the chat
    if (targetUser === senderId) {
      setTargetUser(null);
    } else {
      setTargetUser(senderId);
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 p-4 md:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
        </div>
        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {userId ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Inbox Panel */}
              <div
                className={`lg:col-span-1 transition-all duration-300 ${
                  targetUser ? "lg:block hidden" : "block"
                }`}
              >
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-blue-600" />
                      <h2 className="text-xl font-semibold text-gray-800">
                        Conversations
                      </h2>
                      {senders.length > 0 && (
                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
                          {senders.length}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4">
                    {loading ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                          <Loader2 className="animate-spin w-8 h-8 text-blue-600 mx-auto mb-3" />
                          <p className="text-gray-500">
                            Loading conversations...
                          </p>
                        </div>
                      </div>
                    ) : error ? (
                      <div className="text-center py-12">
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                          <p className="text-red-600 font-medium">{error}</p>
                        </div>
                      </div>
                    ) : senders.length === 0 ? (
                      <div className="text-center py-12">
                        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No messages yet</p>
                        <p className="text-gray-400 text-sm mt-1">
                          Start a conversation to see it here
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {senders.map((msg) => (
                          <button
                            key={msg.sender_id}
                            className={`w-full text-left p-4 rounded-xl transition-all duration-200 group border-2 ${
                              targetUser === msg.sender_id
                                ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-md"
                                : "bg-white border-transparent hover:bg-gray-50 hover:shadow-md hover:border-gray-100"
                            }`}
                            onClick={() => handleUserSelect(msg.sender_id)}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-200 ${
                                  targetUser === msg.sender_id
                                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                                    : "bg-gradient-to-r from-gray-400 to-gray-500 text-white group-hover:from-blue-400 group-hover:to-indigo-400"
                                }`}
                              >
                                {msg.sender_name
                                  ? msg.sender_name[0].toUpperCase()
                                  : "U"}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <h3
                                    className={`font-semibold truncate ${
                                      targetUser === msg.sender_id
                                        ? "text-blue-900"
                                        : "text-gray-900"
                                    }`}
                                  >
                                    {msg.sender_name || `User ${msg.sender_id}`}
                                  </h3>
                                  <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <Clock className="w-3 h-3" />
                                    {formatTime(msg.created_at)}
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600 truncate">
                                  {msg.message}
                                </p>
                              </div>

                              <ChevronRight
                                className={`w-5 h-5 transition-all duration-200 ${
                                  targetUser === msg.sender_id
                                    ? "text-blue-500 transform rotate-90"
                                    : "text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1"
                                }`}
                              />
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Chat Panel */}
              <div
                className={`lg:col-span-2 ${
                  targetUser
                    ? "block"
                    : "hidden lg:flex lg:items-center lg:justify-center"
                }`}
              >
                {targetUser ? (
                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden h-[600px] flex flex-col">
                    {/* Chat Header */}
                    <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            className="lg:hidden p-2 hover:bg-white/50 rounded-lg transition-colors"
                            onClick={() => setTargetUser(null)}
                          >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                          </button>
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                            {senders
                              .find((s) => s.sender_id === targetUser)
                              ?.sender_name?.[0]?.toUpperCase() || "U"}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {senders.find((s) => s.sender_id === targetUser)
                                ?.sender_name || `User ${targetUser}`}
                            </h3>
                            <p className="text-sm text-gray-500">Active now</p>
                          </div>
                        </div>
                        <button
                          className="hidden lg:block p-2 hover:bg-white/50 rounded-lg transition-colors"
                          onClick={() => setTargetUser(null)}
                        >
                          <X className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                    </div>

                    {/* Chat Window */}
                    <div className="flex-1 min-h-0">
                      <ChatWindow
                        userId={userId}
                        targetUserId={targetUser}
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
                          },
                          bubbleButtonStyle: { display: "none" },
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-12">
                      <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        Select a conversation
                      </h3>
                      <p className="text-gray-500">
                        Choose a contact from the sidebar to start chatting
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-12 max-w-md mx-auto">
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

      {/* Mobile overlay when chat is open */}
      {targetUser && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setTargetUser(null)}
        />
      )}
    </div>
  );
};

export default Page;
