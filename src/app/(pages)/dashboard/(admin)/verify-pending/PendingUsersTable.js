import React from "react";
import {
  Eye,
  CheckCircle,
  XCircle,
  FileText,
  Calendar,
  AlertCircle,
} from "lucide-react";

const PendingUsersTable = ({
  currentUsers,
  getRoleColor,
  formatDate,
  getTimeAgo,
  openModal,
  handleStatusUpdate,
  processing,
}) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-white border-b border-grey-100">
        <tr>
          <th className="text-left py-4 px-6 text-sm font-medium text-slate-600">
            User
          </th>
          <th className="text-left py-4 px-6 text-sm font-medium text-slate-600">
            Role
          </th>
          <th className="text-left py-4 px-6 text-sm font-medium text-slate-600">
            Document
          </th>
          <th className="text-left py-4 px-6 text-sm font-medium text-slate-600">
            Email Status
          </th>
          <th className="text-left py-4 px-6 text-sm font-medium text-slate-600">
            Pending Since
          </th>
          <th className="text-left py-4 px-6 text-sm font-medium text-slate-600">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-amber-200">
        {currentUsers.map((user) => {
          const daysPending = Math.floor(
            (new Date() - new Date(user.created_at)) / (1000 * 60 * 60 * 24)
          );
          const isUrgent = daysPending >= 7;
          return (
            <tr
              key={user.id}
              className={`hover:bg-amber-50 transition-colors duration-200 ${
                isUrgent ? "bg-red-50 border-l-4 border-red-400" : ""
              }`}
            >
              <td className="py-4 px-6">
                <div className="flex items-center gap-3">
                  {/* <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium">
                    {user.name.charAt(0)}
                  </div> */}
                  <div>
                    <p className="font-medium text-slate-800 flex items-center gap-2">
                      {user.name}
                      {isUrgent && (
                        <AlertCircle size={16} className="text-red-500" />
                      )}
                    </p>
                    <p className="text-sm text-slate-600">{user.email}</p>
                  </div>
                </div>
              </td>
              <td className="py-4 px-6">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(
                    user.role
                  )}`}
                >
                  {user.role}
                </span>
              </td>
              <td className="py-4 px-6">
                {user.verification_document ? (
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-blue-600" />
                    <span className="text-sm text-blue-600">Available</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <XCircle size={16} className="text-red-500" />
                    <span className="text-sm text-red-600">Missing</span>
                  </div>
                )}
              </td>
              <td className="py-4 px-6">
                <div className="flex items-center gap-2">
                  {user.email_verified_at ? (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center gap-1">
                      <CheckCircle size={12} />
                      Verified
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 flex items-center gap-1">
                      <XCircle size={12} />
                      Unverified
                    </span>
                  )}
                </div>
              </td>
              <td className="py-4 px-6">
                <div className="text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    {getTimeAgo(user.created_at)}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {formatDate(user.created_at)}
                  </div>
                </div>
              </td>
              <td className="py-4 px-6">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openModal("view", user)}
                    className="p-2 text-slate-600 cursor-pointer hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                    title="View Details"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(user.id, "verified")}
                    className="p-2 text-green-600 cursor-pointer hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors duration-200"
                    disabled={processing}
                    title="Approve"
                  >
                    <CheckCircle size={16} />
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(user.id, "unverified")}
                    className="p-2 text-red-600 cursor-pointer hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    disabled={processing}
                    title="Reject"
                  >
                    <XCircle size={16} />
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default PendingUsersTable;
