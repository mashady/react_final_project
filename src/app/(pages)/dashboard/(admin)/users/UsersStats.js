// UsersStats.js
import React from "react";
import { User, Shield, CheckCircle, Clock } from "lucide-react";
import { useTranslation } from "../../../../../TranslationContext"; 

export default function UsersStats({ filteredUsers }) {
  const { t, locale } = useTranslation();

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div
          className={`flex items-center justify-between ${
            locale === "ar" ? "flex-row-reverse" : ""
          }`}
        >
          <div>
            <p className="text-[#555] text-sm" style={{ fontWeight: 500 }}>
              {t("totalUsers")}
            </p>
            <p className="text-3xl font-light text-slate-800 mt-1">
              {filteredUsers.length}
            </p>
          </div>
          <div className="bg-slate-100 p-3 rounded-lg">
            <User size={24} className="text-slate-600" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div
          className={`flex items-center justify-between ${
            locale === "ar" ? "flex-row-reverse" : ""
          }`}
        >
          <div>
            <p className="text-[#555] text-sm" style={{ fontWeight: 500 }}>
              {t("owners")}
            </p>
            <p className="text-3xl font-light text-slate-800 mt-1">
              {filteredUsers.filter((u) => u.role === "owner").length}
            </p>
          </div>
          <div className="bg-purple-100 p-3 rounded-lg">
            <Shield size={24} className="text-purple-600" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div
          className={`flex items-center justify-between ${
            locale === "ar" ? "flex-row-reverse" : ""
          }`}
        >
          <div>
            <p className="text-[#555] text-sm" style={{ fontWeight: 500 }}>
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
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div
          className={`flex items-center justify-between ${
            locale === "ar" ? "flex-row-reverse" : ""
          }`}
        >
          <div>
            <p className="text-[#555] text-sm" style={{ fontWeight: 500 }}>
              {t("verified")}
            </p>
            <p className="text-3xl font-light text-slate-800 mt-1">
              {
                filteredUsers.filter(
                  (u) => u.verification_status === "verified"
                ).length
              }
            </p>
          </div>
          <div className="bg-green-100 p-3 rounded-lg">
            <CheckCircle size={24} className="text-green-600" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div
          className={`flex items-center justify-between ${
            locale === "ar" ? "flex-row-reverse" : ""
          }`}
        >
          <div>
            <p className="text-[#555] text-sm" style={{ fontWeight: 500 }}>
              {t("pending")}
            </p>
            <p className="text-3xl font-light text-slate-800 mt-1">
              {
                filteredUsers.filter((u) => u.verification_status === "pending")
                  .length
              }
            </p>
          </div>
          <div className="bg-yellow-100 p-3 rounded-lg">
            <Clock size={24} className="text-yellow-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
