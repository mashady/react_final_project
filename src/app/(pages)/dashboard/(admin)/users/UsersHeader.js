// UsersHeader.js
import React from "react";
import { Plus } from "lucide-react";
import { useTranslation } from "../../../../../TranslationContext"; 
export default function UsersHeader({ onAddUser }) {
  const { t, locale } = useTranslation();

  return (
    <div className="bg-white" dir={locale === "ar" ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-4xl text-black tracking-tight"
              style={{ fontWeight: 500 }}
            >
              {t("usersManagementTitle")}
            </h1>
            <p className="text-[#333] mt-2 font-light">
              {t("usersManagementSubtitle")}
            </p>
          </div>
          <button
            onClick={onAddUser}
            className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Plus size={20} />
            {t("addNewUserButton")}
          </button>
        </div>
      </div>
    </div>
  );
}
