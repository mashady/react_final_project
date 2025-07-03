import React, { useState } from "react";
import {
  Eye,
  CheckCircle,
  XCircle,
  FileText,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { useTranslation } from "../../../../../TranslationContext";

const PendingUsersTable = ({
  currentUsers,
  getRoleColor,
  formatDate,
  getTimeAgo,
  openModal,
  handleStatusUpdate,
  processing,
}) => {
  const { t, locale } = useTranslation();
  const [confirmUserId, setConfirmUserId] = useState(null);

  const handleUnverifyClick = (userId) => {
    setConfirmUserId(userId);
  };

  const confirmUnverify = () => {
    if (confirmUserId) {
      handleStatusUpdate(confirmUserId, "unverified");
      setConfirmUserId(null);
    }
  };

  const cancelUnverify = () => {
    setConfirmUserId(null);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full" dir={locale === "ar" ? "rtl" : "ltr"}>
          <thead className="bg-white border-b border-grey-100">
            <tr>
              <th
                className={`text-${
                  locale === "ar" ? "right" : "left"
                } py-4 px-6 text-sm font-medium text-slate-600`}
              >
                {t("userColumn")}
              </th>
              <th
                className={`text-${
                  locale === "ar" ? "right" : "left"
                } py-4 px-6 text-sm font-medium text-slate-600`}
              >
                {t("roleColumn")}
              </th>
              <th
                className={`text-${
                  locale === "ar" ? "right" : "left"
                } py-4 px-6 text-sm font-medium text-slate-600`}
              >
                {t("documentColumn")}
              </th>
              <th
                className={`text-${
                  locale === "ar" ? "right" : "left"
                } py-4 px-6 text-sm font-medium text-slate-600`}
              >
                {t("emailStatusColumn")}
              </th>
              <th
                className={`text-${
                  locale === "ar" ? "right" : "left"
                } py-4 px-6 text-sm font-medium text-slate-600`}
              >
                {t("pendingSinceColumn")}
              </th>
              <th
                className={`text-${
                  locale === "ar" ? "right" : "left"
                } py-4 px-6 text-sm font-medium text-slate-600`}
              >
                {t("actionsColumn")}
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
                  className={`hover:bg-white-50 transition-colors duration-200 ${
                    isUrgent ? "bg-red-50 border-l-4 border-red-400" : ""
                  }`}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
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
                      {t(user.role)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {user.verification_document ? (
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-blue-600" />
                        <span className="text-sm text-blue-600">
                          {t("available")}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <XCircle size={16} className="text-red-500" />
                        <span className="text-sm text-red-600">
                          {t("missing")}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      {user.email_verified_at ? (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center gap-1">
                          <CheckCircle size={12} />
                          {t("verified")}
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 flex items-center gap-1">
                          <XCircle size={12} />
                          {t("unverified")}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-slate-600">
                      <div className="text-xs text-slate-500 mt-1">
                        {formatDate(user.created_at)}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div
                      className={`flex items-center gap-2 ${
                        locale === "ar" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <button
                        onClick={() => openModal("view", user)}
                        className="p-2 text-slate-600 cursor-pointer hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                        title={t("viewDetailsTooltip")}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(user.id, "verified")}
                        className="p-2 text-green-600 cursor-pointer hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors duration-200"
                        disabled={processing}
                        title={t("approveTooltip")}
                      >
                        <CheckCircle size={16} />
                      </button>
                      <button
                        onClick={() => handleUnverifyClick(user.id)}
                        className="p-2 text-red-600 cursor-pointer hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        disabled={processing}
                        title={t("rejectTooltip")}
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
      {confirmUserId && (
        <div className="fixed inset-0 bg-[#000000e0] bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6"
            dir={locale === "ar" ? "rtl" : "ltr"}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              {t("confirmUnverifyTitle")}
            </h3>
            <p className="text-gray-700 text-center mb-6">
              {t("confirmUnverifyMessage")}
            </p>
            <div
              className={`flex justify-center gap-4 ${
                locale === "ar" ? "flex-row-reverse" : ""
              }`}
            >
              <button
                onClick={cancelUnverify}
                className="px-6 py-2 border cursor-pointer border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {t("cancelButton")}
              </button>
              <button
                onClick={confirmUnverify}
                className="px-6 py-2 bg-red-600 cursor-pointer hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                {t("unverifyButton")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PendingUsersTable;
