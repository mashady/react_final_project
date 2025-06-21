// UsersModal.js
import React from "react";
import { X, Mail, User, Shield, CheckCircle, Calendar, Eye } from "lucide-react";

export default function UsersModal({
  modalMode,
  setShowModal,
  selectedUser,
  formData,
  setFormData,
  errors,
  successMessage,
  handleCreateUser,
  handleUpdateUser,
  handleFileChange,
  getRoleColor,
  getVerificationStatusColor,
  getVerificationIcon,
  formatDate,
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl transform transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-medium text-slate-800">
            {modalMode === "create"
              ? "Add New User"
              : modalMode === "edit"
              ? "Edit User"
              : "User Details"}
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
        {modalMode === "view" ? (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full flex items-center justify-center text-white text-2xl font-medium mx-auto mb-4">
                {selectedUser?.name.charAt(0)}
              </div>
              <h4 className="text-xl font-medium text-slate-800">{selectedUser?.name}</h4>
              <p className="text-slate-600">{selectedUser?.email}</p>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-slate-400" />
                <span className="text-slate-600">{selectedUser?.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <User size={16} className="text-slate-400" />
                <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleColor(selectedUser?.role)}`}>{selectedUser?.role}</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield size={16} className="text-slate-400" />
                <span className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${getVerificationStatusColor(selectedUser?.verification_status)}`}>
                  {getVerificationIcon(selectedUser?.verification_status)}
                  {selectedUser?.verification_status}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle size={16} className="text-slate-400" />
                <span className={`px-2 py-1 rounded text-xs font-medium ${selectedUser?.email_verified_at ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  Email {selectedUser?.email_verified_at ? "Verified" : "Unverified"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-slate-400" />
                <span className="text-slate-600">Joined {formatDate(selectedUser?.created_at)}</span>
              </div>
              {selectedUser?.verification_document && (
                <div className="flex items-center gap-3">
                  <Eye size={16} className="text-slate-400" />
                  <a
                    href={selectedUser.verification_document}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline text-sm"
                  >
                    View Document
                  </a>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Name*</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3 py-2 border ${errors.name ? "border-red-500" : "border-slate-300"} rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all duration-300`}
                  required
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name[0]}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email*</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-3 py-2 border ${errors.email ? "border-red-500" : "border-slate-300"} rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all duration-300`}
                  required
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email[0]}</p>}
              </div>
              {modalMode === "create" && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Password* (min 8 characters)</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`w-full px-3 py-2 border ${errors.password ? "border-red-500" : "border-slate-300"} rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all duration-300`}
                    required
                    minLength="8"
                  />
                  {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password[0]}</p>}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Role*</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className={`w-full px-3 py-2 border ${errors.role ? "border-red-500" : "border-slate-300"} rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all duration-300`}
                  required
                >
                  <option value="student">Student</option>
                  <option value="owner">Owner</option>
                  <option value="admin">Admin</option>
                </select>
                {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role[0]}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Verification Status*</label>
                <select
                  value={formData.verification_status}
                  onChange={(e) => setFormData({ ...formData, verification_status: e.target.value })}
                  className={`w-full px-3 py-2 border ${errors.verification_status ? "border-red-500" : "border-slate-300"} rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all duration-300`}
                  required
                >
                  <option value="unverified">Unverified</option>
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                </select>
                {errors.verification_status && <p className="mt-1 text-sm text-red-600">{errors.verification_status[0]}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Verification Document (JPEG, JPG, PNG, PDF)</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className={`w-full px-3 py-2 border ${errors.verification_document ? "border-red-500" : "border-slate-300"} rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all duration-300`}
                  accept=".jpeg,.jpg,.png,.pdf"
                />
                {errors.verification_document && <p className="mt-1 text-sm text-red-600">{errors.verification_document[0]}</p>}
                {selectedUser?.verification_document && (
                  <p className="mt-2 text-sm text-slate-500">Current document: {selectedUser.verification_document.split("/").pop()}</p>
                )}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={modalMode === "create" ? handleCreateUser : handleUpdateUser}
                className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors duration-200 flex items-center justify-center gap-2"
                disabled={!!successMessage}
              >
                Save
                {modalMode === "create" ? "Create User" : "Update User"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
