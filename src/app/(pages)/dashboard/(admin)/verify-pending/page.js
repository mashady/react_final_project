"use client";
import React, { useState, useEffect } from "react";
import { CheckCircle, Clock, Search } from "lucide-react";
import axios from "axios";
import PendingUsersTable from "./PendingUsersTable.js";
import PendingUsersModal from "./PendingUsersModal.js";
import PendingUsersStats from "./PendingUsersStats.js";
import PendingUsersPagination from "./PendingUsersPagination.js";
import LoadingSpinner from "@/app/(pages)/properties/components/LoadingSpinner.js";
import { useTranslation } from "../../../../../TranslationContext";
import Toast from "@/app/(pages)/property/[id]/components/Toast";
import RequireAuth from "@/components/shared/RequireAuth.js";

const PendingUsers = () => {
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
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState("view");
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  const API_BASE_URL = "http://localhost:8000/api";

  const fetchPendingUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/users`);
      if (response.data && response.data.data) {
        console.log(
          "All users from API:",
          response.data.data.map((u) => ({
            id: u.id,
            name: u.name,
            verification_status: u.verification_status,
          }))
        );
      }
      if (response.data.success) {
        const pendingUsers = response.data.data.filter((user) => {
          const status = (user.verification_status || "")
            .toString()
            .trim()
            .toLowerCase();
          return status === "pending";
        });
        setUsers(pendingUsers);
        setFilteredUsers(pendingUsers);
      } else {
        console.error("Failed to fetch users:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      const mockPendingUsers = Array.from({ length: 8 }, (_, i) => ({
        id: i + 1,
        name: `Pending User ${i + 1}`,
        email: `pending${i + 1}@example.com`,
        role: i % 3 === 0 ? "student" : i % 3 === 1 ? "admin" : "owner",
        verification_status: "pending",
        verification_document: i % 2 === 0 ? "/documents/sample.pdf" : null,
        email_verified_at: i % 2 === 0 ? "2024-01-15T10:00:00.000000Z" : null,
        created_at: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
        updated_at: "2024-01-15T10:00:00.000000Z",
        deleted_at: null,
      }));
      setUsers(mockPendingUsers);
      setFilteredUsers(mockPendingUsers);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (userId, newStatus) => {
    setProcessing(true);
    try {
      const formData = new FormData();
      formData.append("verification_status", newStatus);
      formData.append("_method", "PUT");
      const response = await axios.post(
        `${API_BASE_URL}/users/${userId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (response.data.success) {
        showToast(
          `${t("userVerificationStatusUpdated", { status: t(newStatus) })}`,
          "success"
        );
        await fetchPendingUsers();
        setShowModal(false);
      } else {
        setErrors({ general: [response.data.message] });
        showToast(response.data.message, "error");
      }
    } catch (error) {
      const msg = error.response?.data?.message || t("updateError");
      setErrors({ general: [msg] });
      showToast(msg, "error");
    } finally {
      setProcessing(false);
    }
  };

  const openModal = (mode, user = null) => {
    setModalMode(mode);
    setSelectedUser(user);
    setErrors({});
    setShowModal(true);
  };

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

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
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
      for (let i = start; i <= end; i++) pageNumbers.push(i);
    }
    return pageNumbers;
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

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

  const formatDate = (dateString) => {
    if (!dateString) return t("notAvailable");
    return new Date(dateString).toLocaleDateString(
      locale === "ar" ? "ar-EG" : "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now - past;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    if (diffDays > 0) return t("daysAgo", { count: diffDays });
    if (diffHours > 0) return t("hoursAgo", { count: diffHours });
    if (diffMinutes > 0) return t("minutesAgo", { count: diffMinutes });
    return t("justNow");
  };

  return (
    <div className="min-h-screen" dir={locale === "ar" ? "rtl" : "ltr"}>
      <div className="bg-white">
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
                {t("pendingVerificationsTitle")}
              </h1>
              <p className="text-[#555] mt-2">
                {t("pendingVerificationsSubtitle")}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <PendingUsersStats filteredUsers={filteredUsers} />
        <div className="bg-white rounded-xl p-6 shadow-sm border border-grey-100 mb-8">
          <div className="relative">
            <Search
              className={`absolute ${
                locale === "ar" ? "right-4" : "left-4"
              } top-1/2 transform -translate-y-1/2 text-slate-400`}
              size={20}
            />
            <input
              type="text"
              placeholder={t("searchPendingUsersPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full ${
                locale === "ar" ? "pr-12 pl-4" : "pl-12 pr-4"
              } py-3 border border-slate-300 rounded-lg focus:ring-grey-100 outline-none transition-all duration-300`}
            />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-grey-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <LoadingSpinner />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center">
              <h3 className="text-lg font-medium text-slate-800 mb-2">
                {t("noPendingVerifications")}
              </h3>
              <p className="text-slate-600">{t("allUsersVerifiedMessage")}</p>
            </div>
          ) : (
            <>
              <PendingUsersTable
                currentUsers={currentUsers}
                getRoleColor={getRoleColor}
                formatDate={formatDate}
                getTimeAgo={getTimeAgo}
                openModal={openModal}
                handleStatusUpdate={handleStatusUpdate}
                processing={processing}
              />
              {totalPages > 1 && (
                <PendingUsersPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  indexOfFirstUser={indexOfFirstUser}
                  indexOfLastUser={indexOfLastUser}
                  filteredUsers={filteredUsers}
                  paginate={paginate}
                  goToNextPage={goToNextPage}
                  goToPrevPage={goToPrevPage}
                  goToFirstPage={goToFirstPage}
                  goToLastPage={goToLastPage}
                  getPageNumbers={getPageNumbers}
                />
              )}
            </>
          )}
        </div>
      </div>
      <PendingUsersModal
        showModal={showModal}
        selectedUser={selectedUser}
        errors={errors}
        processing={processing}
        setShowModal={setShowModal}
        handleStatusUpdate={handleStatusUpdate}
        getRoleColor={getRoleColor}
        getTimeAgo={getTimeAgo}
        formatDate={formatDate}
      />
      {toast.visible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={handleCloseToast}
        />
      )}
    </div>
  );
};

const PendingManagementPage = () => (
  <RequireAuth allowedRoles={["admin"]}>
    <PendingUsers />
  </RequireAuth>
);

export default PendingManagementPage;
