"use client";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export default function ChatDebugWindow({ userId, targetUserId }) {
  const [socket, setSocket] = useState(null);
  const [logs, setLogs] = useState([]);
  const [input, setInput] = useState("");
  const logsEndRef = useRef(null);

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);
    setLogs((prev) => [...prev, `[init] Socket connecting...`]);
    newSocket.on("connect", () => {
      setLogs((prev) => [...prev, `[connect] Socket connected: ${newSocket.id}`]);
    });
    return () => {
      setLogs((prev) => [...prev, `[cleanup] Socket closing`]);
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (!socket || !userId) return;
    setLogs((prev) => [...prev, `[join] User: ${userId}`]);
    socket.emit("join", userId);
    const handlePrivate = (data) => {
      setLogs((prev) => [...prev, `[private_message] from: ${data.from}, msg: ${data.message}`]);
    };
    const handleConfirm = (data) => {
      setLogs((prev) => [...prev, `[message_sent_confirmation] from: ${data.from}, msg: ${data.message}`]);
    };
    socket.on("private_message", handlePrivate);
    socket.on("message_sent_confirmation", handleConfirm);
    return () => {
      setLogs((prev) => [...prev, `[leave_room]`]);
      socket.emit("leave_room");
      socket.off("private_message", handlePrivate);
      socket.off("message_sent_confirmation", handleConfirm);
    };
  }, [socket, userId]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !targetUserId || !userId || !socket) return;
    setLogs((prev) => [...prev, `[send] from: ${userId}, to: ${targetUserId}, msg: ${input.trim()}`]);
    socket.emit("private_message", {
      to: targetUserId,
      from: userId,
      message: input.trim(),
    });
    setInput("");
  };

  return (
    <div style={{ border: "2px solid #f90", borderRadius: 8, padding: 16, background: "#fffbe6", maxWidth: 500, margin: "24px auto" }}>
      <h3>Chat Debug Window</h3>
      <div style={{ height: 200, overflowY: "auto", background: "#222", color: "#fff", fontSize: 12, padding: 8, borderRadius: 4 }}>
        {logs.map((log, i) => (
          <div key={i}>{log}</div>
        ))}
        <div ref={logsEndRef} />
      </div>
      <form onSubmit={sendMessage} style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1, padding: 6, borderRadius: 4, border: "1px solid #ccc" }}
        />
        <button type="submit" style={{ padding: "6px 16px", borderRadius: 4, background: "#f90", color: "#fff", border: "none" }}>
          Send
        </button>
      </form>
      <div style={{ fontSize: 11, color: "#888", marginTop: 8 }}>
        userId: <b>{userId}</b> | targetUserId: <b>{targetUserId}</b>
      </div>
    </div>
  );
}
