"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";

// Always use the page's protocol and host for Socket.IO
const SOCKET_URL = typeof window !== 'undefined'
  ? window.location.origin
  : '';

export default function ChatWindow({ userId, targetUserId }) {
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);
  const [socketId, setSocketId] = useState(undefined);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [errors, setErrors] = useState([]);
  const messagesEndRef = useRef(null);
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);

  // Initialize socket connection
  useEffect(() => {
    console.log('🔌 Initializing socket connection');
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      timeout: 10000,
    });

    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id, 'to', SOCKET_URL);
      setSocketId(newSocket.id);
    });

    newSocket.on('connect_error', (err) => {
      console.error('❌ Socket connection error:', err);
    });

    // Handle server errors (non-blocking database errors)
    newSocket.on('database_error', (errorData) => {
      console.warn('⚠️ Database error (non-blocking):', errorData);
      setErrors(prev => [...prev, {
        timestamp: new Date(),
        type: 'database',
        ...errorData
      }]);
    });

    setSocket(newSocket);
    socketRef.current = newSocket;

    return () => {
      console.log('🔌 Cleaning up socket connection');
      newSocket.close();
    };
  }, []);

  // Load chat history when users change
  useEffect(() => {
    if (!userId || !targetUserId) return;
    
    console.log('\n📥 Loading chat history...');
    setMessages([]);
    setIsHistoryLoaded(false);
    
    fetch(`/api/messages?user1=${userId}&user2=${targetUserId}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.messages) {
          const history = data.messages.map(msg => ({
            id: msg.id,
            from: msg.sender_id.toString(),
            message: msg.message,
            timestamp: msg.created_at,
            type: msg.sender_id === userId ? 'sent' : 'received',
            source: 'history'
          }));
          console.log(`✅ Loaded ${history.length} historical messages`);
          setMessages(history);
        }
        setIsHistoryLoaded(true);
      })
      .catch(err => {
        console.error('❌ Error loading history:', err);
        setErrors(prev => [...prev, { 
          timestamp: new Date(), 
          type: 'history',
          message: 'Failed to load chat history',
          error: err.message 
        }]);
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
      type: 'received',
      source: 'realtime'
    };
    console.log('📩 Received real-time message:', msgObj);
    
    setMessages(prev => [...prev, msgObj]);
  }, []);

  // Handle message sent confirmations
  const handleSentConfirmation = useCallback(({ from, message, timestamp }) => {
    const msgObj = {
      id: `temp-${Date.now()}`,
      from: from.toString(),
      message,
      timestamp,
      type: 'sent',
      source: 'realtime'
    };
    console.log('✓ Message sent confirmation:', msgObj);
    
    setMessages(prev => [...prev, msgObj]);
  }, []);

  // Set up socket event listeners
  useEffect(() => {
    if (!socket || !socketId || !userId || !isHistoryLoaded) {
      return;
    }

    console.log('\n🔄 Setting up real-time chat:');
    console.log('- User ID:', userId);
    console.log('- Target User:', targetUserId);
    console.log('- Socket ID:', socketId);
    
    // Join user's room
    socket.emit("join", userId.toString());
    
    // Set up event listeners
    socket.on("private_message", handlePrivateMessage);
    socket.on("message_sent_confirmation", handleSentConfirmation);

    return () => {
      console.log('\n🧹 Cleaning up chat listeners');
      socket.off("private_message", handlePrivateMessage);
      socket.off("message_sent_confirmation", handleSentConfirmation);
      socket.emit("leave_room");
    };
  }, [socket, socketId, userId, targetUserId, isHistoryLoaded, handlePrivateMessage, handleSentConfirmation]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    const messageText = input.trim();
    
    if (!messageText || !targetUserId || !userId || !socketRef.current) {
      console.log('⚠️ Cannot send message - missing requirements');
      return;
    }
    
    console.log('\n📤 Sending message:');
    console.log('- From:', userId);
    console.log('- To:', targetUserId);
    console.log('- Message:', messageText);
    
    const messageData = {
      to: targetUserId.toString(),
      from: userId.toString(),
      message: messageText
    };
    
    socketRef.current.emit("private_message", messageData);
    setInput("");
  };

  const clearErrors = () => {
    setErrors([]);
  };

  return (
    <div className="border rounded w-full max-w-md mx-auto flex flex-col h-96 bg-white">
      {/* Header */}
      <div style={{fontSize:12, color:'#888', padding:'4px 8px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between'}}>
        <span>Socket: {socketId || 'Connecting...'}</span>
        <span>History: {isHistoryLoaded ? '✓' : '⏳'}</span>
      </div>
      
      {/* Error Messages */}
      {errors.length > 0 && (
        <div style={{backgroundColor: '#fff3cd', borderBottom: '1px solid #ffeaa7', padding: '8px', fontSize: 12}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <strong style={{color: '#856404'}}>Warnings ({errors.length})</strong>
            <button onClick={clearErrors} style={{background: 'none', border: 'none', color: '#856404', cursor: 'pointer'}}>×</button>
          </div>
          {errors.slice(-2).map((error, idx) => (
            <div key={idx} style={{marginTop: 4, color: '#856404'}}>
              • {error.type}: {error.message}
            </div>
          ))}
        </div>
      )}
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-2">
        {!isHistoryLoaded && (
          <div style={{textAlign: 'center', color: '#888', fontSize: 12, padding: '20px'}}>
            Loading chat history...
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div
            key={msg.id || idx}
            className={`mb-2 flex ${msg.from === userId.toString() ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-3 py-2 rounded-lg max-w-xs text-sm ${
                msg.from === userId.toString()
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-900"
              }`}
            >
              <div>{msg.message}</div>
              <div style={{fontSize: 10, opacity: 0.7, marginTop: 2, display: 'flex', justifyContent: 'space-between'}}>
                <span>{msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ''}</span>
                {msg.source === 'realtime' && (
                  <span style={{color: msg.from === userId.toString() ? '#add8e6' : '#666'}}>●</span>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <form onSubmit={sendMessage} className="p-2 border-t flex gap-2">
        <input
          className="flex-1 border rounded p-2 text-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          disabled={!isHistoryLoaded || !socketId}
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
  );
}