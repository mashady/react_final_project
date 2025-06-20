"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";

// Always use the page's protocol and host for Socket.IO
const SOCKET_URL = typeof window !== "undefined" ? window.location.origin : "";

export default function ChatWindow({
  userId,
  targetUserId,
  forceOpen = false,
}) {
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);
  const [socketId, setSocketId] = useState(undefined);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [errors, setErrors] = useState([]);
  const messagesEndRef = useRef(null);
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);
  // Only use isOpen state if not forceOpen
  const [isOpen, setIsOpen] = useState(!!forceOpen);
  useEffect(() => {
    if (forceOpen) setIsOpen(true);
  }, [forceOpen]);

  // Initialize socket connection
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

    // Handle server errors (non-blocking database errors)
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

  // Load chat history when users change
  useEffect(() => {
    if (!userId || !targetUserId) return;

    console.log("\n📥 Loading chat history...");
    setMessages([]);
    setIsHistoryLoaded(false);

    fetch(`/api/messages?user1=${userId}&user2=${targetUserId}`)
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

  // Handle incoming messages
  const handlePrivateMessage = useCallback(({ from, message, timestamp }) => {
    const msgObj = {
      id: `temp-${Date.now()}`, // Temporary ID for real-time messages
      from: from.toString(),
      message,
      timestamp,
      type: "received",
      source: "realtime",
    };
    console.log("📩 Received real-time message:", msgObj);

    setMessages((prev) => [...prev, msgObj]);
  }, []);

  // Handle message sent confirmations
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

  // Set up socket event listeners
  useEffect(() => {
    if (!socket || !socketId || !userId || !isHistoryLoaded) {
      return;
    }

    console.log("\n🔄 Setting up real-time chat:");
    console.log("- User ID:", userId);
    console.log("- Target User:", targetUserId);
    console.log("- Socket ID:", socketId);

    // Join user's room
    socket.emit("join", userId.toString());

    // Set up event listeners
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

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    const messageText = input.trim();

    if (!messageText || !targetUserId || !userId || !socketRef.current) {
      console.log("⚠️ Cannot send message - missing requirements");
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

  // Bubble button style
  const bubbleButtonStyle = {
    position: "fixed",
    bottom: 32,
    right: 32,
    zIndex: 1000,
    background: "#2563eb",
    color: "#fff",
    borderRadius: "50%",
    width: 64,
    height: 64,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
    cursor: "pointer",
    fontSize: 32,
    border: "none",
    transition: "background 0.2s",
  };

  // Chat popup style
  const popupStyle = {
    position: "fixed",
    bottom: 112,
    right: 32,
    zIndex: 1100,
    width: 350,
    maxWidth: "90vw",
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
    overflow: "hidden",
    display: forceOpen || isOpen ? "flex" : "none",
    flexDirection: "column",
    minHeight: 420,
    maxHeight: "70vh",
  };

  return (
    <>
      {/* Only show bubble button if not forceOpen */}
      {!forceOpen && (
        <button
          style={bubbleButtonStyle}
          aria-label={isOpen ? "Close chat" : "Open chat"}
          onClick={() => setIsOpen((v) => !v)}
        >
          {isOpen ? (
            <span style={{ fontSize: 28, fontWeight: 700 }}>&times;</span>
          ) : (
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
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
            fontSize: 16,
            color: "#2563eb",
            padding: "10px 16px",
            borderBottom: "1px solid #eee",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#f3f6fa",
          }}
        >
          <span>Chat</span>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: "none",
              border: "none",
              fontSize: 22,
              color: "#2563eb",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            &times;
          </button>
        </div>
        {/* Error Messages */}
        {errors.length > 0 && (
          <div
            style={{
              backgroundColor: "#fff3cd",
              borderBottom: "1px solid #ffeaa7",
              padding: "8px",
              fontSize: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <strong style={{ color: "#856404" }}>
                Warnings ({errors.length})
              </strong>
              <button
                onClick={clearErrors}
                style={{
                  background: "none",
                  border: "none",
                  color: "#856404",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>
            {errors.slice(-2).map((error, idx) => (
              <div key={idx} style={{ marginTop: 4, color: "#856404" }}>
                • {error.type}: {error.message}
              </div>
            ))}
          </div>
        )}
        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto p-2"
          style={{ background: "#f9fafb", minHeight: 0 }}
        >
          {!isHistoryLoaded && (
            <div
              style={{
                textAlign: "center",
                color: "#888",
                fontSize: 12,
                padding: "20px",
              }}
            >
              Loading chat history...
            </div>
          )}
          {messages.map((msg, idx) => (
            <div
              key={msg.id || idx}
              className={`mb-2 flex ${
                msg.from === userId.toString() ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-3 py-2 rounded-lg max-w-xs text-sm ${
                  msg.from === userId.toString()
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-900"
                }`}
                style={{
                  boxShadow:
                    msg.from === userId.toString()
                      ? "0 2px 8px #2563eb22"
                      : "0 2px 8px #8882",
                }}
              >
                <div>{msg.message}</div>
                <div
                  style={{
                    fontSize: 10,
                    opacity: 0.7,
                    marginTop: 2,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>
                    {msg.timestamp
                      ? new Date(msg.timestamp).toLocaleTimeString()
                      : ""}
                  </span>
                  {msg.source === "realtime" && (
                    <span
                      style={{
                        color:
                          msg.from === userId.toString() ? "#add8e6" : "#666",
                      }}
                    >
                      ●
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {/* Input */}
        <form
          onSubmit={sendMessage}
          className="p-2 border-t flex gap-2"
          style={{ background: "#f3f6fa" }}
        >
          <input
            className="flex-1 border rounded p-2 text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            disabled={!isHistoryLoaded || !socketId}
            style={{ background: "#fff" }}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
            disabled={!input.trim() || !isHistoryLoaded || !socketId}
          >
            Send
          </button>
        </form>
      </div>
    </>
  );
}
