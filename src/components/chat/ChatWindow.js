"use client";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const socket = io(); // Connects to the same origin

export default function ChatWindow({ userId, targetUserId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!userId) return;
    socket.emit("join", userId);
    socket.on("private_message", ({ from, message }) => {
      setMessages((prev) => [...prev, { from, message }]);
    });
    return () => {
      socket.off("private_message");
    };
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !targetUserId) return;
    
    // Only emit the message, don't add it to messages directly
    socket.emit("private_message", {
      to: targetUserId,
      from: userId,
      message: input.trim()
    });
    
    setInput("");
  };

  return (
    <div className="border rounded w-full max-w-md mx-auto flex flex-col h-96 bg-white">
      <div className="flex-1 overflow-y-auto p-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 flex ${msg.from === userId ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-3 py-2 rounded-lg max-w-xs text-sm ${
                msg.from === userId
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-900"
              }`}
            >
              {msg.message}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="p-2 border-t flex gap-2">
        <input
          className="flex-1 border rounded p-2 text-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={!input.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
}
