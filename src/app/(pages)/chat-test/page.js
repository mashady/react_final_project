'use client';
import React, { useState } from 'react';
import ChatWindow from '@/components/chat/ChatWindow';

const MOCK_USERS = [
  { id: 'user1', name: 'User 1' },
  { id: 'user2', name: 'User 2' },
  { id: 'user3', name: 'User 3' },
];

export default function ChatTestPage() {
  const [currentUser, setCurrentUser] = useState(MOCK_USERS[0].id);
  const [targetUser, setTargetUser] = useState(MOCK_USERS[1].id);

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', padding: 24, border: '1px solid #eee', borderRadius: 8 }}>
      <h2>Mock Chat Test Page</h2>
      <div style={{ marginBottom: 16 }}>
        <label>
          <b>Your User ID:</b>
          <select value={currentUser} onChange={e => setCurrentUser(e.target.value)} style={{ marginLeft: 8 }}>
            {MOCK_USERS.map(u => (
              <option key={u.id} value={u.id}>{u.name} ({u.id})</option>
            ))}
          </select>
        </label>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>
          <b>Chat With (Target User ID):</b>
          <select value={targetUser} onChange={e => setTargetUser(e.target.value)} style={{ marginLeft: 8 }}>
            {MOCK_USERS.filter(u => u.id !== currentUser).map(u => (
              <option key={u.id} value={u.id}>{u.name} ({u.id})</option>
            ))}
          </select>
        </label>
      </div>
      <ChatWindow userId={currentUser} targetUserId={targetUser} />
      <div style={{ marginTop: 24, fontSize: 13, color: '#888' }}>
        <p>Open this page in two browsers/tabs, select different user IDs, and chat in real time!</p>
      </div>
    </div>
  );
}
