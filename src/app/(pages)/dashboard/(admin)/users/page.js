import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Mail, Calendar, User, Save, X, Shield, CheckCircle, Clock, XCircle } from 'lucide-react';
import axios from 'axios';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view'
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'student',
    verification_status: 'unverified'
  });

  // Configure axios base URL (adjust to your Laravel app URL)
  const API_BASE_URL = 'http://localhost:8000/api';
  
  // Simulate API calls (replace with actual API endpoints)
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/users`);
      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        console.error('Failed to fetch users:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      // Fallback to mock data for development
      const mockUsers = [
        { 
          id: 1, 
          name: 'John Doe', 
          email: 'john@example.com', 
          role: 'owner', 
          verification_status: 'verified',
          verification_document: null,
          email_verified_at: '2024-01-15T10:00:00.000000Z',
          created_at: '2024-01-15T10:00:00.000000Z',
          updated_at: '2024-01-15T10:00:00.000000Z',
          deleted_at: null
        }
      ];
      setUsers(mockUsers);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/users`, formData);
      if (response.data.success) {
        await fetchUsers(); // Refresh the list
        setShowModal(false);
        resetForm();
      } else {
        console.error('Failed to create user:', response.data.message);
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleUpdateUser = async () => {
    try {
      const response = await axios.put(`${API_BASE_URL}/users/${selectedUser.id}`, formData);
      if (response.data.success) {
        await fetchUsers(); // Refresh the list
        setShowModal(false);
        resetForm();
      } else {
        console.error('Failed to update user:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await axios.delete(`${API_BASE_URL}/users/${userId}`);
        if (response.data.success) {
          await fetchUsers(); // Refresh the list
        } else {
          console.error('Failed to delete user:', response.data.message);
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const openModal = (mode, user = null) => {
    setModalMode(mode);
    setSelectedUser(user);
    if (user && mode !== 'view') {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        verification_status: user.verification_status
      });
    }
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'student',
      verification_status: 'unverified'
    });
    setSelectedUser(null);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchUsers();
  }, []);

  const getRoleColor = (role) => {
    switch (role) {
      case 'owner': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-red-100 text-red-800';
      case 'moderator': return 'bg-blue-100 text-blue-800';
      case 'student': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVerificationStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'unverified': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVerificationIcon = (status) => {
    switch (status) {
      case 'verified': return <CheckCircle size={14} />;
      case 'pending': return <Clock size={14} />;
      case 'unverified': return <XCircle size={14} />;
      default: return <XCircle size={14} />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-light text-slate-800 tracking-tight">Users Management</h1>
              <p className="text-slate-600 mt-2 font-light">Manage your platform users with ease</p>
            </div>
            <button
              onClick={() => openModal('create')}
              className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus size={20} />
              Add New User
            </button>
          </div>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-light text-slate-800 mt-1">{users.length}</p>
              </div>
              <div className="bg-slate-100 p-3 rounded-lg">
                <User size={24} className="text-slate-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Owners</p>
                <p className="text-3xl font-light text-slate-800 mt-1">{users.filter(u => u.role === 'owner').length}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Shield size={24} className="text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Students</p>
                <p className="text-3xl font-light text-slate-800 mt-1">{users.filter(u => u.role === 'student').length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <User size={24} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Verified</p>
                <p className="text-3xl font-light text-slate-800 mt-1">{users.filter(u => u.verification_status === 'verified').length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle size={24} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Pending</p>
                <p className="text-3xl font-light text-slate-800 mt-1">{users.filter(u => u.verification_status === 'pending').length}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock size={24} className="text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all duration-300"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading users...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left py-4 px-6 text-sm font-medium text-slate-600">User</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-slate-600">Role</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-slate-600">Verification</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-slate-600">Email Status</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-slate-600">Joined</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors duration-200">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full flex items-center justify-center text-white font-medium">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">{user.name}</p>
                            <p className="text-sm text-slate-600">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getVerificationStatusColor(user.verification_status)}`}>
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
                            onClick={() => openModal('view', user)}
                            className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => openModal('edit', user)}
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
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl transform transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-medium text-slate-800">
                {modalMode === 'create' && 'Add New User'}
                {modalMode === 'edit' && 'Edit User'}
                {modalMode === 'view' && 'User Details'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition-colors duration-200"
              >
                <X size={20} />
              </button>
            </div>

            {modalMode === 'view' ? (
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
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleColor(selectedUser?.role)}`}>
                      {selectedUser?.role}
                    </span>
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
                    <span className={`px-2 py-1 rounded text-xs font-medium ${selectedUser?.email_verified_at ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      Email {selectedUser?.email_verified_at ? 'Verified' : 'Unverified'}
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
                    <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all duration-300"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all duration-300"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all duration-300"
                    >
                      <option value="student">Student</option>
                      <option value="owner">Owner</option>
                      <option value="admin">Admin</option>
                      <option value="moderator">Moderator</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Verification Status</label>
                    <select
                      value={formData.verification_status}
                      onChange={(e) => setFormData({...formData, verification_status: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all duration-300"
                    >
                      <option value="unverified">Unverified</option>
                      <option value="pending">Pending</option>
                      <option value="verified">Verified</option>
                    </select>
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
                    onClick={() => {
                      modalMode === 'create' ? handleCreateUser() : handleUpdateUser();
                    }}
                    className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <Save size={16} />
                    {modalMode === 'create' ? 'Create User' : 'Update User'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;