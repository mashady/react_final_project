"use client";
import { AlertCircle, X } from "lucide-react";
export default function FormError({ message, onClose }) {
  return (
    <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
      <AlertCircle className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
      <span className="text-sm text-red-700 flex-1">{message}</span>
      {onClose && (
        <button onClick={onClose} className="text-red-500 hover:text-red-700 ml-2">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
