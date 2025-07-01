"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Mail,
  Calendar,
  User,
  Save,
  X,
  Shield,
  CheckCircle,
  Clock,
  XCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import axios from "axios";
import { useTranslation } from "../../../../../TranslationContext";
import Toast from "@/app/(pages)/property/[id]/components/Toast";

import UsersHeader from "./UsersHeader";
import UsersStats from "./UsersStats";
import UsersSearchBar from "./UsersSearchBar";
import UsersTable from "./UsersTable";
import UsersModal from "./UsersModal";
import RequireAuth from "@/components/shared/RequireAuth";

const Users = () => {
  const { t, locale } = useTranslation();

  const [toast, setToast] = useState({ message: "", type: "", visible: false });
  const showToast = (message, type) => {
    setToast({ message, type, visible: true });
  };
  const handleCloseToast = () => {
    setToast({ ...toast, visible: false });
  };

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "student",
    verification_status: "unverified",
    verification_document: null,
  });
  const [errors, setErrors] = useState({});

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const API_BASE_URL = "http://localhost:8000/api";

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/users`);
      if (response.data.success) {
        setUsers(response.data.data);
        setFilteredUsers(response.data.data);
      } else {
        console.error(t("fetchUsersError"), response.data.message);
      }
    } catch (error) {
      console.error(t("fetchUsersError"), error);
      // Fallback to mock data for development
      const mockUsers = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        name:
          i < 5
            ? `${t("owner")} ${i + 1}`
            : i < 15
            ? `${t("student")} ${i + 1}`
            : `${t("admin")} ${i + 1}`,
        email:
          i < 5
            ? `owner${i + 1}@example.com`
            : i < 15
            ? `student${i + 1}@example.com`
            : `admin${i + 1}@example.com`,
        role: i < 5 ? "owner" : i < 15 ? "student" : "admin",
        verification_status:
          i % 3 === 0 ? "verified" : i % 3 === 1 ? "pending" : "unverified",
        verification_document: i % 4 === 0 ? "/documents/sample.pdf" : null,
        email_verified_at: i % 2 === 0 ? "2024-01-15T10:00:00.000000Z" : null,
        created_at: "2024-01-15T10:00:00.000000Z",
        updated_at: "2024-01-15T10:00:00.000000Z",
        deleted_at: null,
      }));
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreateUser = async () => {
    // Client-side password confirmation validation
    if (formData.password !== formData.password_confirmation) {
      setErrors({ password_confirmation: [t("passwordMismatch")] });
      return;
    }
    try {
      setErrors({});
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      formDataToSend.append(
        "password_confirmation",
        formData.password_confirmation
      );
      formDataToSend.append("role", formData.role);
      formDataToSend.append(
        "verification_status",
        formData.verification_status
      );

      if (formData.verification_document) {
        formDataToSend.append(
          "verification_document",
          formData.verification_document
        );
      }

      const response = await axios.post(
        `${API_BASE_URL}/users`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        showToast(t("userCreatedSuccess"), "success");
        await fetchUsers();
        setTimeout(() => {
          setShowModal(false);
          resetForm();
        }, 1500);
      } else {
        console.error("Failed to create user:", response.data.message);
        setErrors({ general: [response.data.message] });
      }
    } catch (error) {
      console.error("Error creating user:", error);
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
      } else {
        setErrors({
          general: [
            error.response?.data?.message ||
              "An error occurred while creating the user",
          ],
        });
      }
    }
  };

  const handleUpdateUser = async () => {
    try {
      setErrors({});
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("role", formData.role);
      formDataToSend.append(
        "verification_status",
        formData.verification_status
      );
      formDataToSend.append("_method", "PUT");

      if (formData.password) {
        formDataToSend.append("password", formData.password);
        formDataToSend.append(
          "password_confirmation",
          formData.password_confirmation
        );
      }

      if (formData.verification_document) {
        formDataToSend.append(
          "verification_document",
          formData.verification_document
        );
      }

      const response = await axios.post(
        `${API_BASE_URL}/users/${selectedUser.id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        showToast(t("userUpdatedSuccess"), "success");
        await fetchUsers();
        setTimeout(() => {
          setShowModal(false);
          resetForm();
        }, 1500);
      } else {
        console.error("Failed to update user:", response.data.message);
        setErrors({ general: [response.data.message] });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
      } else {
        setErrors({
          general: [
            error.response?.data?.message ||
              "An error occurred while updating the user",
          ],
        });
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    setUserToDelete(userId);
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/users/${userToDelete}`
      );
      if (response.data.success) {
        showToast(t("userDeletedSuccess"), "success");
        await fetchUsers();
        setTimeout(() => setShowToast(""), 3000);
      } else {
        setErrors({ general: [response.data.message] });
      }
    } catch (error) {
      setErrors({
        general: [
          error.response?.data?.message ||
            "An error occurred while deleting the user",
        ],
      });
    } finally {
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const cancelDeleteUser = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const openModal = (mode, user = null) => {
    setModalMode(mode);
    setSelectedUser(user);
    setErrors({});

    if (user && mode !== "view") {
      setFormData({
        name: user.name,
        email: user.email,
        password: "",
        password_confirmation: "",
        role: user.role,
        verification_status: user.verification_status,
        verification_document: null,
      });
    } else if (mode === "create") {
      resetForm();
    }
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      role: "student",
      verification_status: "unverified",
      verification_document: null,
    });
    setSelectedUser(null);
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      verification_document: e.target.files[0],
    });
  };

  // Handle search
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredUsers(users);
      setCurrentPage(1);
    } else {
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
      setCurrentPage(1);
    }
  }, [searchTerm, users]);

  // Get current users for pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const half = Math.floor(maxVisiblePages / 2);
      let start = currentPage - half;
      let end = currentPage + half;

      if (start < 1) {
        start = 1;
        end = maxVisiblePages;
      }

      if (end > totalPages) {
        end = totalPages;
        start = totalPages - maxVisiblePages + 1;
      }

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "owner":
        return "bg-purple-100 text-purple-800";
      case "admin":
        return "bg-red-100 text-red-800";
      case "student":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getVerificationStatusColor = (status) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "unverified":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getVerificationIcon = (status) => {
    switch (status) {
      case "verified":
        return <CheckCircle size={14} />;
      case "pending":
        return <Clock size={14} />;
      case "unverified":
        return <XCircle size={14} />;
      default:
        return <XCircle size={14} />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen" dir={locale === "ar" ? "rtl" : "ltr"}>
      {/* Custom Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000e0] bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {t("confirmDeleteTitle")}
            </h2>
            <p className="mb-6 text-gray-600">
              {t("confirmDeleteUserMessage")}
            </p>
            <div
              className={`flex justify-end gap-3 ${
                locale === "ar" ? "flex-row-reverse" : ""
              }`}
            >
              <button
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                onClick={cancelDeleteUser}
              >
                {t("cancelButton")}
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={confirmDeleteUser}
              >
                {t("deleteButton")}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white mb-4">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div
            className={`flex items-center justify-between ${
              locale === "ar" ? "flex-row-reverse" : ""
            }`}
          >
            <div>
              <h1
                className="text-3xl text-black tracking-tight flex items-center gap-3"
                style={{ fontWeight: 400 }}
              >
                {t("userManagementTitle")}
              </h1>
              <p className="text-[#555] mt-2" style={{ fontWeight: 500 }}>
                {t("userManagementDescription")}
              </p>
            </div>
            <div>
              <button
                className="bg-yellow-500 cursor-pointer hover:bg-yellow-600 text-black px-6 py-3 transition-all duration-300 flex items-center gap-2"
                onClick={() => openModal("create")}
                style={{ fontWeight: 500 }}
              >
                <Plus className="w-5 h-5" /> {t("addUserButton")}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <UsersStats filteredUsers={filteredUsers} t={t} />
        <UsersSearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          t={t}
        />

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <UsersTable
            loading={loading}
            currentUsers={currentUsers}
            getRoleColor={getRoleColor}
            getVerificationStatusColor={getVerificationStatusColor}
            getVerificationIcon={getVerificationIcon}
            formatDate={formatDate}
            openModal={openModal}
            handleDeleteUser={handleDeleteUser}
            currentPage={currentPage}
            totalPages={totalPages}
            paginate={paginate}
            goToFirstPage={goToFirstPage}
            goToPrevPage={goToPrevPage}
            goToNextPage={goToNextPage}
            goToLastPage={goToLastPage}
            getPageNumbers={getPageNumbers}
            indexOfFirstUser={indexOfFirstUser}
            indexOfLastUser={indexOfLastUser}
            filteredUsers={filteredUsers}
            usersPerPage={usersPerPage}
            t={t}
          />
        </div>

        {showModal && (
          <UsersModal
            modalMode={modalMode}
            setShowModal={setShowModal}
            selectedUser={selectedUser}
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            handleCreateUser={handleCreateUser}
            handleUpdateUser={handleUpdateUser}
            handleFileChange={handleFileChange}
            getRoleColor={getRoleColor}
            getVerificationStatusColor={getVerificationStatusColor}
            getVerificationIcon={getVerificationIcon}
            formatDate={formatDate}
            t={t}
          />
        )}

        {toast.visible && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={handleCloseToast}
          />
        )}
      </div>
    </div>
  );
};

const UsersManagementPage = () => (
  <RequireAuth allowedRoles={["admin"]}>
    <Users />
  </RequireAuth>
);

export default UsersManagementPage;
