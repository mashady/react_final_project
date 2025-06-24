"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";
import { X, Send } from "lucide-react";

const SOCKET_URL = "http://localhost:4000";

function getUserDisplay(user) {
  if (!user) return { name: "User", avatar: "/owner.jpg" };
  let name = user.name;
  if (!name || /^User\s*\d+$/i.test(name)) {
    name = user.email || undefined;
  }
  return {
    name: name || "User",
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
  hideHeader = false,
}) {
  const isSelfChat =
    userId && targetUserId && String(userId) === String(targetUserId);
  if (isSelfChat) {
    return (
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          height: "200px",
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid #e5e7eb",
          ...customStyles.popupStyle,
        }}
      >
        <div className="text-center w-full">
          <div className="font-semibold text-black text-lg mb-2">
            You cannot chat with yourself.
          </div>
          <div className="text-gray-500 text-sm">
            Please select another user to start a conversation.
          </div>
        </div>
      </div>
    );
  }

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

  const handlePrivateMessage = useCallback((msg) => {
    const msgObj = {
      id: `temp-${Date.now()}`,
      from: msg.from.toString(),
      message: msg.message,
      timestamp: msg.timestamp,
      type: "received",
      source: "realtime",
      sender_name: msg.sender_name,
      sender_email: msg.sender_email,
      sender_avatar: msg.sender_avatar,
      receiver_name: msg.receiver_name,
      receiver_email: msg.receiver_email,
      receiver_avatar: msg.receiver_avatar,
    };
    console.log("📩 Received real-time message:", msgObj);
    setMessages((prev) => [...prev, msgObj]);
  }, []);

  const handleSentConfirmation = useCallback((msg) => {
    const msgObj = {
      id: `temp-${Date.now()}`,
      from: msg.from.toString(),
      message: msg.message,
      timestamp: msg.timestamp,
      type: "sent",
      source: "realtime",
      sender_name: msg.sender_name,
      sender_email: msg.sender_email,
      sender_avatar: msg.sender_avatar,
      receiver_name: msg.receiver_name,
      receiver_email: msg.receiver_email,
      receiver_avatar: msg.receiver_avatar,
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

      <div style={popupStyle}>
        {!hideHeader && (
          <div
            style={{
              padding: "20px 20px 18px 20px",
              borderBottom: "none",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 2px 12px 0 rgba(0,0,0,0.06)",
              zIndex: 2,
            }}
          >
            <div className="font-semibold text-black text-base truncate">
              {(() => {
                if (
                  targetUserInfo?.name &&
                  !/^User\s*\d+$/i.test(targetUserInfo.name)
                ) {
                  return targetUserInfo.name;
                }
                if (propTargetUser?.email) return propTargetUser.email;
                return "Chat";
              })()}
            </div>
            <button
              onClick={handleClose}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#f3f4f6";
                e.target.style.boxShadow = "0 2px 8px 0 rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "none";
                e.target.style.boxShadow = "none";
              }}
              aria-label="Close chat"
            >
              <X size={20} color="#6b7280" />
            </button>
          </div>
        )}

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

        <div
          ref={messagesContainerRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px 16px 16px 16px",
            background: "#fff",
            minHeight: 0,
            maxHeight: "calc(100% - 140px)",
            display: "flex",
            flexDirection: "column",
            gap: 0,
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
                marginBottom: "10px",
                display: "flex",
                justifyContent:
                  msg.from === userId?.toString() ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  maxWidth: "75%",
                  padding: "13px 18px 11px 18px",
                  borderRadius: "22px",
                  fontSize: "15px",
                  lineHeight: "1.5",
                  wordBreak: "break-word",
                  boxShadow:
                    msg.from === userId?.toString()
                      ? "0 2px 8px rgba(0,0,0,0.1)"
                      : "0 2px 8px rgba(0,0,0,0.06)",
                  ...(msg.from === userId?.toString()
                    ? {
                        background: "#111",
                        color: "#fff",
                        borderBottomRightRadius: "7px",
                        borderTopRightRadius: "0px",
                        border: "none",
                      }
                    : {
                        background: "#f6f6f6",
                        color: "#222",
                        borderBottomLeftRadius: "7px",
                        borderTopLeftRadius: "0px",
                        border: "1px solid #ececec",
                      }),
                  opacity: 1,
                  animation: "none",
                }}
              >
                {/* Only show message text and timestamp, no user name */}
                <div>{msg.message}</div>
                <div
                  style={{
                    fontSize: "10px",
                    opacity: 0.6,
                    marginTop: "6px",
                    textAlign: "right",
                    letterSpacing: 0.2,
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

        <form
          onSubmit={sendMessage}
          style={{
            padding: "18px 16px 18px 16px",
            borderTop: "none",
            backgroundColor: "#fff",
            display: "flex",
            gap: "10px",
            alignItems: "center",
            boxShadow: "0 -2px 12px rgba(0,0,0,0.04)",
            zIndex: 2,
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            disabled={!isHistoryLoaded || !socketId}
            style={{
              flex: 1,
              padding: "13px 18px",
              border: "1.5px solid #ececec",
              borderRadius: "22px",
              fontSize: "15px",
              outline: "none",
              backgroundColor: "#fafafa",
              transition: "border-color 0.2s, box-shadow 0.2s",
              boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#111";
              e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08) ";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#ececec";
              e.target.style.boxShadow = "0 1px 4px rgba(0,0,0,0.03)";
            }}
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={!input.trim() || !isHistoryLoaded || !socketId}
            style={{
              background:
                input.trim() && isHistoryLoaded && socketId
                  ? "#111"
                  : "#ececec",
              color:
                input.trim() && isHistoryLoaded && socketId ? "#fff" : "#bbb",
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
              transition: "all 0.2s cubic-bezier(.4,0,.2,1)",
              boxShadow:
                input.trim() && isHistoryLoaded && socketId
                  ? "0 2px 8px rgba(0,0,0,0.10)"
                  : "none",
            }}
            onMouseEnter={(e) => {
              if (input.trim() && isHistoryLoaded && socketId) {
                e.target.style.background = "#222";
                e.target.style.transform = "scale(1)";
              }
            }}
            onMouseLeave={(e) => {
              if (input.trim() && isHistoryLoaded && socketId) {
                e.target.style.backgroundColor = "#111";
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
