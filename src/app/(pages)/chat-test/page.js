'use client';
import React, { useState, useEffect } from 'react';
import ChatWindow from '@/components/chat/ChatWindow';

const MOCK_USERS = [
  { id: 1, name: 'User 1' },
  { id: 2, name: 'User 2' },
  { id: 3, name: 'User 3' },
];

export default function ChatTestPage() {
  const [currentUser, setCurrentUser] = useState(MOCK_USERS[0].id);
  const [targetUser, setTargetUser] = useState(MOCK_USERS[1].id);

  // Ensure targetUser is never the same as currentUser
  useEffect(() => {
    if (currentUser === targetUser) {
      const firstOther = MOCK_USERS.find(u => u.id !== currentUser);
      setTargetUser(firstOther.id);
    }
  }, [currentUser, targetUser]);

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', padding: 24, border: '1px solid #eee', borderRadius: 8 }}>
      <h2>Mock Chat Test Page</h2>
      <div style={{ marginBottom: 16 }}>
        <label>
          <b>Your User ID:</b>
          <select value={currentUser} onChange={e => setCurrentUser(Number(e.target.value))} style={{ marginLeft: 8 }}>
            {MOCK_USERS.map(u => (
              <option key={u.id} value={u.id}>{u.name} ({u.id})</option>
            ))}
          </select>
        </label>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>
          <b>Chat With (Target User ID):</b>
          <select value={targetUser} onChange={e => setTargetUser(Number(e.target.value))} style={{ marginLeft: 8 }}>
            {MOCK_USERS.filter(u => u.id !== currentUser).map(u => (
              <option key={u.id} value={u.id}>{u.name} ({u.id})</option>
            ))}
          </select>
        </label>
      </div>
      <ChatWindow userId={Number(currentUser)} targetUserId={Number(targetUser)} />
      <div style={{ marginTop: 24, fontSize: 13, color: '#888' }}>
        <p>Open this page in two browsers/tabs, select different user IDs, and chat in real time!</p>
      </div>
    </div>
  );
}
