import React from "react";

export default function ConfirmDialog({ open, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.25)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 4px 32px rgba(0,0,0,0.15)",
          padding: 32,
          minWidth: 320,
          maxWidth: "90vw",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 18 }}>
          {message}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
          <button
            onClick={onConfirm}
            style={{
              background: "#111",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "10px 24px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Yes
          </button>
          <button
            onClick={onCancel}
            style={{
              background: "#f3f4f6",
              color: "#222",
              border: "none",
              borderRadius: 6,
              padding: "10px 24px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
