// UsersTable.js
import React from "react";
import {
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Clock,
} from "lucide-react";

export default function UsersTable({
  loading,
  currentUsers,
  getRoleColor,
  getVerificationStatusColor,
  getVerificationIcon,
  formatDate,
  openModal,
  handleDeleteUser,
  currentPage,
  totalPages,
  paginate,
  goToFirstPage,
  goToPrevPage,
  goToNextPage,
  goToLastPage,
  getPageNumbers,
  indexOfFirstUser,
  indexOfLastUser,
  filteredUsers,
  usersPerPage,
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {loading ? (
        <div className="p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading users...</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-medium text-slate-600">
                    User
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-slate-600">
                    Role
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-slate-600">
                    Verification
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-slate-600">
                    Email Status
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-slate-600">
                    Joined
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {currentUsers.length > 0 ? (
                  currentUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50 transition-colors duration-200"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full flex items-center justify-center text-white font-medium">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">
                              {user.name}
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
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getVerificationStatusColor(
                              user.verification_status
                            )}`}
                          >
                            {getVerificationIcon(user.verification_status)}
                            {user.verification_status}
                          </span>
                        </div>
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
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Calendar size={14} />
                          {formatDate(user.created_at)}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openModal("view", user)}
                            className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => openModal("edit", user)}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-12 text-center">
                      <Clock size={48} className="text-amber-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-800 mb-2">
                        No users found
                      </h3>
                      <p className="text-slate-600">
                        {filteredUsers.length === 0
                          ? "No users available"
                          : "No users match your search criteria"}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination - Only show if there are users */}
          {currentUsers.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200">
              <div className="text-sm text-slate-600">
                Showing {indexOfFirstUser + 1} to{" "}
                {Math.min(indexOfLastUser, filteredUsers.length)} of{" "}
                {filteredUsers.length} users
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={goToFirstPage}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg ${
                    currentPage === 1
                      ? "text-slate-300 cursor-not-allowed"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <ChevronsLeft size={18} />
                </button>
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg ${
                    currentPage === 1
                      ? "text-slate-300 cursor-not-allowed"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <ChevronLeft size={18} />
                </button>
                {getPageNumbers().map((number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                      currentPage === number
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {number}
                  </button>
                ))}
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg ${
                    currentPage === totalPages
                      ? "text-slate-300 cursor-not-allowed"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <ChevronRight size={18} />
                </button>
                <button
                  onClick={goToLastPage}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg ${
                    currentPage === totalPages
                      ? "text-slate-300 cursor-not-allowed"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <ChevronsRight size={18} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}