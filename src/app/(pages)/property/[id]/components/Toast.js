"use client";
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function Toast({ message, type, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getToastStyles = () => {
    const base = "fixed top-4 right-4 z-50 max-w-sm w-full bg-white border-l-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out";
    if (!isVisible) return `${base} translate-x-full opacity-0`;
    switch (type) {
      case "success": return `${base} border-green-500`;
      case "error": return `${base} border-red-500`;
      case "warning": return `${base} border-yellow-500`;
      case "info": return `${base} border-blue-500`;
      default: return `${base} border-gray-500`;
    }
  };
  const getIcon = () => {
    switch (type) {
      case "success": return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error": return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "warning": return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "info": return <Info className="w-5 h-5 text-blue-500" />;
      default: return <Info className="w-5 h-5 text-gray-500" />;
    }
  };
  return (
    <div className={getToastStyles()}>
      <div className="flex items-start p-4">
        <div className="flex-shrink-0 mr-3">{getIcon()}</div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">{message}</p>
        </div>
        <button onClick={() => { setIsVisible(false); setTimeout(onClose, 300); }} className="flex-shrink-0 ml-3 text-gray-400 hover:text-gray-600">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
