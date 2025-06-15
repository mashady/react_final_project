"use client";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export default function ChatWindow({ userId, targetUserId }) {
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    console.log('🔌 Initializing socket connection');
    const newSocket = io();
    
    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id);
    });

    setSocket(newSocket);
    socketRef.current = newSocket;

    return () => {
      console.log('🔌 Cleaning up socket connection');
      newSocket.close();
    };
  }, []);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const currentSocket = socketRef.current;
    if (!currentSocket || !userId) {
      console.log('⚠️ No socket or userId yet');
      return;
    }

    console.log('\n🔄 Setting up chat:');
    console.log('- User ID:', userId);
    console.log('- Target User:', targetUserId);
    console.log('- Socket ID:', currentSocket.id);
    
    // Join user's room
    currentSocket.emit("join", userId);
    
    const handlePrivateMessage = ({ from, message }) => {
      console.log('\n📥 Received private message:');
      console.log('- From:', from);
      console.log('- Message:', message);
      setMessages(prev => {
        console.log('- Adding to messages');
        return [...prev, { from, message }];
      });
    };

    const handleSentConfirmation = ({ from, message }) => {
      console.log('\n✅ Message sent confirmation:');
      console.log('- From:', from);
      console.log('- Message:', message);
      setMessages(prev => {
        console.log('- Adding to messages');
        return [...prev, { from, message }];
      });
    };

    // Set up event listeners
    currentSocket.on("private_message", handlePrivateMessage);
    currentSocket.on("message_sent_confirmation", handleSentConfirmation);

    return () => {
      console.log('\n🧹 Cleaning up chat listeners');
      currentSocket.off("private_message", handlePrivateMessage);
      currentSocket.off("message_sent_confirmation", handleSentConfirmation);
      currentSocket.emit("leave_room");
    };
  }, [socket, userId, targetUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    const messageText = input.trim();
    if (!messageText || !targetUserId || !userId || !socketRef.current) {
      console.log('⚠️ Cannot send message:');
      console.log('- Message:', messageText ? '✓' : '✗');
      console.log('- Target:', targetUserId ? '✓' : '✗');
      console.log('- User:', userId ? '✓' : '✗');
      console.log('- Socket:', socketRef.current ? '✓' : '✗');
      return;
    }
    
    console.log('\n📤 Sending message:');
    console.log('- From:', userId);
    console.log('- To:', targetUserId);
    console.log('- Message:', messageText);
    
    const messageData = {
      to: targetUserId,
      from: userId,
      message: messageText
    };
    
    socketRef.current.emit("private_message", messageData);
    
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
