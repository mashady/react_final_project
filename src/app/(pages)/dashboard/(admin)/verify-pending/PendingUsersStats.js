import React from "react";
import { Clock, User, FileText } from "lucide-react";
import { useTranslation } from "../../../../../TranslationContext";

const PendingUsersStats = ({ filteredUsers }) => {
  const { t, locale } = useTranslation();

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      {/* Total Pending Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-grey-100">
        <div
          className={`flex items-center justify-between ${
            locale === "ar" ? "flex-row-reverse" : ""
          }`}
        >
          <div>
            <p className="text-slate-600 text-sm font-medium">
              {t("totalPending")}
            </p>
            <p className="text-3xl font-light text-slate-800 mt-1">
              {filteredUsers.length}
            </p>
          </div>
          <div className="bg-yellow-100 p-3 rounded-lg">
            <Clock size={24} className="text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Students Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-grey-100">
        <div
          className={`flex items-center justify-between ${
            locale === "ar" ? "flex-row-reverse" : ""
          }`}
        >
          <div>
            <p className="text-slate-600 text-sm font-medium">
              {t("students")}
            </p>
            <p className="text-3xl font-light text-slate-800 mt-1">
              {filteredUsers.filter((u) => u.role === "student").length}
            </p>
          </div>
          <div className="bg-green-100 p-3 rounded-lg">
            <User size={24} className="text-green-600" />
          </div>
        </div>
      </div>

      {/* With Documents Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-grey-100">
        <div
          className={`flex items-center justify-between ${
            locale === "ar" ? "flex-row-reverse" : ""
          }`}
        >
          <div>
            <p className="text-slate-600 text-sm font-medium">
              {t("withDocuments")}
            </p>
            <p className="text-3xl font-light text-slate-800 mt-1">
              {filteredUsers.filter((u) => u.verification_document).length}
            </p>
          </div>
          <div className="bg-blue-100 p-3 rounded-lg">
            <FileText size={24} className="text-blue-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingUsersStats;
