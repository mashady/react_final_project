import React from "react";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

const SubmitStatus = ({ status, onDismiss }) => {
  if (!status) return null;

  const getStatusConfig = () => {
    switch (status.type) {
      case "success":
        return {
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          textColor: "text-green-800",
          icon: <CheckCircle className="w-5 h-5 text-green-600" />
        };
      case "error":
        return {
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          textColor: "text-red-800",
          icon: <XCircle className="w-5 h-5 text-red-600" />
        };
      case "warning":
        return {
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          textColor: "text-yellow-800",
          icon: <AlertCircle className="w-5 h-5 text-yellow-600" />
        };
      default:
        return {
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          textColor: "text-blue-800",
          icon: <AlertCircle className="w-5 h-5 text-blue-600" />
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`mb-6 p-4 rounded-lg border ${config.bgColor} ${config.borderColor} ${config.textColor} relative`}>
      <div className="flex items-start gap-3">
        {config.icon}
        <div className="flex-1">
          <p className="text-sm font-medium">{status.message}</p>
          {status.details && (
            <p className="text-xs mt-1 opacity-75">{status.details}</p>
          )}
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="ml-auto -mr-1 -mt-1 p-1 rounded hover:bg-black hover:bg-opacity-10 transition-colors"
            aria-label="Dismiss notification"
          >
            <XCircle className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SubmitStatus;