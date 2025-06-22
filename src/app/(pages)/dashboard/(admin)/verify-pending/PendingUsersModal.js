import React from "react";
import {
  X,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Eye,
  Calendar,
  User,
} from "lucide-react";

const PendingUsersModal = ({
  showModal,
  selectedUser,
  errors,
  processing,
  setShowModal,
  handleStatusUpdate,
  getRoleColor,
  getTimeAgo,
  formatDate,
}) => {
  if (!showModal || !selectedUser) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl transform transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-medium text-slate-800 flex items-center gap-2">
            <Clock size={20} className="text-amber-600" />
            Pending Verification
          </h3>
          <button
            onClick={() => setShowModal(false)}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition-colors duration-200"
          >
            <X size={20} />
          </button>
        </div>
        {/* Error messages */}
        {errors.general && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {errors.general.map((msg, i) => (
              <p key={i}>{msg}</p>
            ))}
          </div>
        )}
        <div className="space-y-4">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-medium mx-auto mb-4">
              {selectedUser.name.charAt(0)}
            </div>
            <h4 className="text-xl font-medium text-slate-800">
              {selectedUser.name}
            </h4>
            <p className="text-slate-600">{selectedUser.email}</p>
            <div className="mt-2">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 flex items-center gap-1 justify-center w-fit mx-auto">
                <Clock size={12} />
                Pending Verification
              </span>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <User size={16} className="text-slate-400" />
                <span className="text-slate-600">Role</span>
              </div>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${getRoleColor(
                  selectedUser.role
                )}`}
              >
                {selectedUser.role}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle size={16} className="text-slate-400" />
                <span className="text-slate-600">Email Status</span>
              </div>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  selectedUser.email_verified_at
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {selectedUser.email_verified_at ? "Verified" : "Unverified"}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText size={16} className="text-slate-400" />
                <span className="text-slate-600">Document</span>
              </div>
              {selectedUser.verification_document ? (
                <a
                  href={selectedUser.verification_document}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline text-sm flex items-center gap-1"
                >
                  <Eye size={12} />
                  View
                </a>
              ) : (
                <span className="text-red-600 text-xs">Missing</span>
              )}
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-slate-400" />
                <span className="text-slate-600">Pending Since</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-slate-800">
                  {getTimeAgo(selectedUser.created_at)}
                </div>
                <div className="text-xs text-slate-500">
                  {formatDate(selectedUser.created_at)}
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={() => handleStatusUpdate(selectedUser.id, "unverified")}
              className="flex-1 px-4 py-3 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors duration-200 flex items-center justify-center gap-2"
              disabled={processing}
            >
              <XCircle size={16} />
              {processing ? "Processing..." : "Reject"}
            </button>
            <button
              type="button"
              onClick={() => handleStatusUpdate(selectedUser.id, "verified")}
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2"
              disabled={processing}
            >
              <CheckCircle size={16} />
              {processing ? "Processing..." : "Approve"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingUsersModal;
