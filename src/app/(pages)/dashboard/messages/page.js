"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import ChatWindow from "@/components/chat/ChatWindow";

const Page = () => {
  const user = useSelector((state) => state.user.data);
  const userId = user?.id;
  const token =
    useSelector((state) => state.user.token) || localStorage.getItem("token");


  const [inbox, setInbox] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    axios
      .get("http://localhost:8000/api/chat/inbox", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setInbox(res.data || []);
      })
      .catch(() => setError("Failed to load inbox"))
      .finally(() => setLoading(false));
  }, [userId, token]);

  const senders = Array.from(
    new Map(inbox.map((msg) => [msg.sender_id, msg])).values()
  );

  const [targetUser, setTargetUser] = useState(null);

  return (
    <div className="p-4">
      <h1 className="text-[26px] mb-4" style={{ fontWeight: 500 }}>
        Messages
      </h1>
      <div className="max-w-lg mx-auto">
        {userId ? (
          <>
            <div className="mb-4">
              <label className="block font-medium mb-1">
                Users who sent you messages:
              </label>
              {loading ? (
                <div className="text-gray-500">Loading...</div>
              ) : error ? (
                <div className="text-red-500">{error}</div>
              ) : senders.length === 0 ? (
                <div className="text-gray-400">No messages received yet.</div>
              ) : (
                <ul className="mb-4">
                  {senders.map((msg) => (
                    <li key={msg.sender_id}>
                      <button
                        className={`text-left w-full px-3 py-2 rounded mb-1 border ${
                          targetUser === msg.sender_id
                            ? "bg-blue-100 border-blue-400"
                            : "bg-gray-50 border-gray-200"
                        }`}
                        onClick={() => setTargetUser(msg.sender_id)}
                      >
                        {msg.sender_name || `User ${msg.sender_id}`} (
                        {msg.sender_id})
                        <span className="ml-2 text-xs text-gray-500">
                          {msg.message.slice(0, 30)}...
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {targetUser && (
              <div className="fixed inset-x-0 bottom-0 z-40 flex justify-center">
                <div className="bg-white shadow-2xl rounded-t-2xl w-full max-w-md mx-auto border-t border-gray-200 flex flex-col" style={{ minHeight: 420, maxHeight: '80vh' }}>
                  <div className="flex items-center justify-between px-4 py-3 border-b">
                    <div className="font-semibold text-gray-900">Chat with {senders.find(s => s.sender_id === targetUser)?.sender_name || `User ${targetUser}`}</div>
                    <button
                      className="text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
                      onClick={() => setTargetUser(null)}
                      aria-label="Close chat"
                    >
                      &times;
                    </button>
                  </div>
                  <div className="flex-1 min-h-0 flex flex-col">
                    <ChatWindow userId={userId} targetUserId={targetUser} forceOpen />
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-gray-500">
            You must be logged in to use chat.
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
