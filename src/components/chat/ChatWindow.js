"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";
import { X, Send, User } from "lucide-react";

// Always use backend port for Socket.IO
const SOCKET_URL = "http://localhost:4000";

function getUserDisplay(user) {
  if (!user) return { name: "User", avatar: "/owner.jpg" };
  return {
    name: user.name || user.username || user.email || "User",
    avatar: user.avatar || user.picture || "/owner.jpg",
  };
}

export default function ChatWindow({
  userId,
  targetUserId,
  forceOpen = false,
  currentUser: propCurrentUser,
  targetUser: propTargetUser,
  onClose,
  customStyles = {},
}) {
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);
  const [socketId, setSocketId] = useState(undefined);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [errors, setErrors] = useState([]);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(!!forceOpen);

  useEffect(() => {
    if (forceOpen) setIsOpen(true);
  }, [forceOpen]);

  useEffect(() => {
    console.log("🔌 Initializing socket connection");
    const newSocket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      timeout: 10000,
    });

    newSocket.on("connect", () => {
      console.log("✅ Socket connected:", newSocket.id, "to", SOCKET_URL);
      setSocketId(newSocket.id);
    });

    newSocket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err);
    });

    newSocket.on("database_error", (errorData) => {
      console.warn("⚠️ Database error (non-blocking):", errorData);
      setErrors((prev) => [
        ...prev,
        {
          timestamp: new Date(),
          type: "database",
          ...errorData,
        },
      ]);
    });

    setSocket(newSocket);
    socketRef.current = newSocket;

    return () => {
      console.log("🔌 Cleaning up socket connection");
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (!userId || !targetUserId) {
      setIsHistoryLoaded(true);
      setMessages([]);
      return;
    }

    console.log("\n📥 Loading chat history...");
    setMessages([]);
    setIsHistoryLoaded(false);

    fetch(
      `http://localhost:4000/api/messages?user1=${userId}&user2=${targetUserId}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data.messages) {
          const history = data.messages.map((msg) => ({
            id: msg.id,
            from: msg.sender_id.toString(),
            message: msg.message,
            timestamp: msg.created_at,
            type: msg.sender_id === userId ? "sent" : "received",
            source: "history",
          }));
          console.log(`✅ Loaded ${history.length} historical messages`);
          setMessages(history);
        }
        setIsHistoryLoaded(true);
      })
      .catch((err) => {
        console.error("❌ Error loading history:", err);
        setErrors((prev) => [
          ...prev,
          {
            timestamp: new Date(),
            type: "history",
            message: "Failed to load chat history",
            error: err.message,
          },
        ]);
        setIsHistoryLoaded(true);
      });
  }, [userId, targetUserId]);

  const handlePrivateMessage = useCallback(({ from, message, timestamp }) => {
    const msgObj = {
      id: `temp-${Date.now()}`,
      from: from.toString(),
      message,
      timestamp,
      type: "received",
      source: "realtime",
    };
    console.log("📩 Received real-time message:", msgObj);

    setMessages((prev) => [...prev, msgObj]);
  }, []);

  const handleSentConfirmation = useCallback(({ from, message, timestamp }) => {
    const msgObj = {
      id: `temp-${Date.now()}`,
      from: from.toString(),
      message,
      timestamp,
      type: "sent",
      source: "realtime",
    };
    console.log("✓ Message sent confirmation:", msgObj);

    setMessages((prev) => [...prev, msgObj]);
  }, []);

  useEffect(() => {
    if (!socket || !socketId || !userId || !isHistoryLoaded) {
      return;
    }

    console.log("\n🔄 Setting up real-time chat:");
    console.log("- User ID:", userId);
    console.log("- Target User:", targetUserId);
    console.log("- Socket ID:", socketId);

    socket.emit("join", userId.toString());

    socket.on("private_message", handlePrivateMessage);
    socket.on("message_sent_confirmation", handleSentConfirmation);

    return () => {
      console.log("\n🧹 Cleaning up chat listeners");
      socket.off("private_message", handlePrivateMessage);
      socket.off("message_sent_confirmation", handleSentConfirmation);
      socket.emit("leave_room");
    };
  }, [
    socket,
    socketId,
    userId,
    targetUserId,
    isHistoryLoaded,
    handlePrivateMessage,
    handleSentConfirmation,
  ]);

  useEffect(() => {
    if (messagesEndRef.current && messagesContainerRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    const messageText = input.trim();

    if (!messageText) {
      setErrors((prev) => [
        ...prev,
        {
          timestamp: new Date(),
          type: "send",
          message: "Cannot send an empty message.",
        },
      ]);
      return;
    }
    if (!userId || !targetUserId) {
      let missing = [];
      if (!userId) missing.push("user");
      if (!targetUserId) missing.push("recipient");
      setErrors((prev) => [
        ...prev,
        {
          timestamp: new Date(),
          type: "send",
          message: `Cannot send message: missing ${missing.join(" and ")}.`,
        },
      ]);
      return;
    }
    if (!socketRef.current) {
      setErrors((prev) => [
        ...prev,
        {
          timestamp: new Date(),
          type: "send",
          message: "Cannot send message: not connected to chat server.",
        },
      ]);
      return;
    }

    console.log("\n📤 Sending message:");
    console.log("- From:", userId);
    console.log("- To:", targetUserId);
    console.log("- Message:", messageText);

    const messageData = {
      to: targetUserId.toString(),
      from: userId.toString(),
      message: messageText,
    };

    socketRef.current.emit("private_message", messageData);
    setInput("");
  };

  const clearErrors = () => {
    setErrors([]);
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setIsOpen(false);
    }
  };

  const bubbleButtonStyle = {
    position: "fixed",
    bottom: 32,
    right: 32,
    zIndex: 1000,
    background: "#000",
    color: "#fff",
    borderRadius: "50%",
    width: 64,
    height: 64,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
    cursor: "pointer",
    fontSize: 32,
    border: "none",
    transition: "all 0.2s ease",
    ...customStyles.bubbleButtonStyle,
  };

  const popupStyle = {
    width: "100%",
    maxWidth: "400px",
    height: "500px",
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
    overflow: "hidden",
    display: forceOpen || isOpen ? "flex" : "none",
    flexDirection: "column",
    border: "1px solid #e5e7eb",
    ...customStyles.popupStyle,
  };

  const [currentUserInfo, setCurrentUserInfo] = useState(null);
  const [targetUserInfo, setTargetUserInfo] = useState(null);

  useEffect(() => {
    if (propCurrentUser) setCurrentUserInfo(getUserDisplay(propCurrentUser));
    else if (typeof window !== "undefined") {
      try {
        const reduxUser =
          window.__NEXT_REDUX_WRAPPER__?.getState?.()?.user?.data;
        setCurrentUserInfo(getUserDisplay(reduxUser));
      } catch {}
    }
  }, [propCurrentUser, userId]);

  useEffect(() => {
    if (propTargetUser) setTargetUserInfo(getUserDisplay(propTargetUser));
    else if (targetUserId && typeof window !== "undefined") {
      fetch(`/api/users/${targetUserId}`)
        .then((res) => res.json())
        .then((data) => setTargetUserInfo(getUserDisplay(data)))
        .catch(() => setTargetUserInfo(getUserDisplay(null)));
    }
  }, [propTargetUser, targetUserId]);

  return (
    <>
      {!forceOpen && (
        <button
          style={bubbleButtonStyle}
          aria-label={isOpen ? "Close chat" : "Open chat"}
          onClick={() => setIsOpen((v) => !v)}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.1)";
            e.target.style.background = "#333";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.background = "#000";
          }}
        >
          {isOpen ? (
            <X size={24} />
          ) : (
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path
                d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      )}

      {/* Chat Popup */}
      <div style={popupStyle}>
        {/* Header */}
        <div
          style={{
            padding: "16px",
            borderBottom: "1px solid #e5e7eb",
            background: "#f9fafb",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {targetUserInfo ? (
              <>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "#000",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                >
                  {targetUserInfo.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: "600",
                      color: "#111827",
                      fontSize: "16px",
                    }}
                  >
                    {targetUserInfo.name}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#6b7280",
                    }}
                  >
                    {socketId ? "Online" : "Connecting..."}
                  </div>
                </div>
              </>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "#e5e7eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <User size={20} color="#6b7280" />
                </div>
                <div
                  style={{
                    fontWeight: "600",
                    color: "#111827",
                    fontSize: "16px",
                  }}
                >
                  Chat
                </div>
              </div>
            )}
          </div>
          <button
            onClick={handleClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#e5e7eb";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "none";
            }}
            aria-label="Close chat"
          >
            <X size={20} color="#6b7280" />
          </button>
        </div>

        {/* Error Messages */}
        {errors.length > 0 && (
          <div
            style={{
              backgroundColor: "#fef3c7",
              borderBottom: "1px solid #f59e0b",
              padding: "8px 16px",
              fontSize: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <strong style={{ color: "#92400e" }}>
                Warnings ({errors.length})
              </strong>
              <button
                onClick={clearErrors}
                style={{
                  background: "none",
                  border: "none",
                  color: "#92400e",
                  cursor: "pointer",
                  padding: "4px",
                }}
              >
                ×
              </button>
            </div>
            {errors.slice(-2).map((error, idx) => (
              <div key={idx} style={{ marginTop: 4, color: "#92400e" }}>
                • {error.type}: {error.message}
              </div>
            ))}
          </div>
        )}

        {/* Messages Container */}
        <div
          ref={messagesContainerRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px",
            background: "#fff",
            minHeight: 0,
            maxHeight: "calc(100% - 140px)",
          }}
        >
          {!isHistoryLoaded && (
            <div
              style={{
                textAlign: "center",
                color: "#6b7280",
                fontSize: "14px",
                padding: "20px",
              }}
            >
              Loading chat history...
            </div>
          )}
          {messages.length === 0 && isHistoryLoaded && (
            <div
              style={{
                textAlign: "center",
                color: "#9ca3af",
                fontSize: "14px",
                padding: "32px 16px",
              }}
            >
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>💬</div>
              <div>No messages yet. Say hello!</div>
            </div>
          )}
          {messages.map((msg, idx) => (
            <div
              key={msg.id || idx}
              style={{
                marginBottom: "12px",
                display: "flex",
                justifyContent:
                  msg.from === userId?.toString() ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  maxWidth: "70%",
                  padding: "12px 16px",
                  borderRadius: "18px",
                  fontSize: "14px",
                  lineHeight: "1.4",
                  wordBreak: "break-word",
                  ...(msg.from === userId?.toString()
                    ? {
                        background: "#000",
                        color: "#fff",
                        borderBottomRightRadius: "4px",
                      }
                    : {
                        background: "#f3f4f6",
                        color: "#111827",
                        borderBottomLeftRadius: "4px",
                        border: "1px solid #e5e7eb",
                      }),
                }}
              >
                <div>{msg.message}</div>
                <div
                  style={{
                    fontSize: "10px",
                    opacity: 0.7,
                    marginTop: "4px",
                    textAlign: "right",
                  }}
                >
                  {msg.timestamp
                    ? new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form
          onSubmit={sendMessage}
          style={{
            padding: "16px",
            borderTop: "1px solid #e5e7eb",
            background: "#f9fafb",
            display: "flex",
            gap: "12px",
            alignItems: "center",
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            disabled={!isHistoryLoaded || !socketId}
            style={{
              flex: 1,
              padding: "12px 16px",
              border: "1px solid #d1d5db",
              borderRadius: "20px",
              fontSize: "14px",
              outline: "none",
              background: "#fff",
              transition: "border-color 0.2s ease",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#000";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#d1d5db";
            }}
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={!input.trim() || !isHistoryLoaded || !socketId}
            style={{
              background:
                input.trim() && isHistoryLoaded && socketId
                  ? "#000"
                  : "#d1d5db",
              color: "#fff",
              border: "none",
              borderRadius: "50%",
              width: "44px",
              height: "44px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor:
                input.trim() && isHistoryLoaded && socketId
                  ? "pointer"
                  : "not-allowed",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (input.trim() && isHistoryLoaded && socketId) {
                e.target.style.background = "#333";
                e.target.style.transform = "scale(1.05)";
              }
            }}
            onMouseLeave={(e) => {
              if (input.trim() && isHistoryLoaded && socketId) {
                e.target.style.background = "#000";
                e.target.style.transform = "scale(1)";
              }
            }}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </>
  );
}
