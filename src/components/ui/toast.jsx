import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({
    message: "",
    type: "info",
    visible: false,
  });

  const showToast = useCallback((message, options = {}) => {
    setToast({
      message,
      type: options.type || "info",
      visible: true,
      duration: options.duration || 3000,
    });
    setTimeout(
      () => setToast((t) => ({ ...t, visible: false })),
      options.duration || 3000
    );
  }, []);

  const dismiss = useCallback(
    () => setToast((t) => ({ ...t, visible: false })),
    []
  );

  return (
    <ToastContext.Provider value={{ toast, showToast, dismiss }}>
      {children}
      {toast.visible && (
        <div
          style={{
            position: "fixed",
            bottom: 32,
            left: "50%",
            transform: "translateX(-50%)",
            background:
              toast.type === "error"
                ? "#fee2e2"
                : toast.type === "success"
                ? "#d1fae5"
                : "#f3f4f6",
            color:
              toast.type === "error"
                ? "#b91c1c"
                : toast.type === "success"
                ? "#065f46"
                : "#222",
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: "14px 28px",
            minWidth: 200,
            zIndex: 9999,
            boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
            fontSize: 16,
            fontWeight: 500,
            transition: "all 0.2s cubic-bezier(.4,0,.2,1)",
          }}
          onClick={dismiss}
        >
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}

// For convenience, export a direct toast(message, options) function
let toastFunc = null;
export function toast(message, options) {
  if (toastFunc) toastFunc(message, options);
}
// Internal: set the global toast function
export function _setToastFunc(fn) {
  toastFunc = fn;
}
