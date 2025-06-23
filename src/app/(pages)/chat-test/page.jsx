"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ChatWindow from "@/components/chat/ChatWindow";

const MOCK_USERS = [
  { id: 1, name: "User 1" },
  { id: 2, name: "User 2" },
  { id: 3, name: "User 3" },
];

export default function ChatTestPage() {
  // Get the real logged-in user from Redux
  const user = useSelector((state) => state.user.data);
  const currentUser = user?.id || MOCK_USERS[0].id;

  // Get all users from Redux if available (for demo, fallback to MOCK_USERS)
  const allUsers = useSelector((state) => state.user.allUsers) || MOCK_USERS;

  // Only allow selecting a target user that is not the current user
  const availableReceivers = allUsers.filter((u) => u.id !== currentUser);
  const [targetUser, setTargetUser] = useState(
    availableReceivers[0]?.id || MOCK_USERS[1].id
  );

  // Ensure targetUser is never the same as currentUser
  useEffect(() => {
    if (currentUser === targetUser) {
      const firstOther = availableReceivers[0];
      if (firstOther) setTargetUser(firstOther.id);
    }
  }, [currentUser, targetUser, availableReceivers]);

  return (
    <div
      style={{
        maxWidth: 500,
        margin: "40px auto",
        padding: 24,
        border: "1px solid #eee",
        borderRadius: 8,
      }}
    >
      <h2>Mock Chat Test Page</h2>
      <div style={{ marginBottom: 16 }}>
        <label>
          <b>Your User ID:</b>
          <span style={{ marginLeft: 8 }}>
            {user ? `${user.name} (${user.id})` : "Not logged in"}
          </span>
        </label>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>
          <b>Chat With (Target User ID):</b>
          <select
            value={targetUser}
            onChange={(e) => setTargetUser(Number(e.target.value))}
            style={{ marginLeft: 8 }}
          >
            {availableReceivers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.id})
              </option>
            ))}
          </select>
        </label>
      </div>
      <ChatWindow
        userId={Number(currentUser)}
        targetUserId={Number(targetUser)}
      />
      <div style={{ marginTop: 24, fontSize: 13, color: "#888" }}>
        <p>
          Open this page in two browsers/tabs, log in as different users, and
          chat in real time!
        </p>
      </div>
    </div>
  );
}
