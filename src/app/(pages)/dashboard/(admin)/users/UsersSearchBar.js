// UsersSearchBar.js
import React from "react";
import { Search } from "lucide-react";
import { useTranslation } from "../../../../../TranslationContext"; 

export default function UsersSearchBar({ searchTerm, setSearchTerm }) {
  const { t, locale } = useTranslation();

  return (
    <div
      className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <div className="relative">
        <Search
          className={`absolute ${
            locale === "ar" ? "right-4" : "left-4"
          } top-1/2 transform -translate-y-1/2 text-slate-400`}
          size={20}
        />
        <input
          type="text"
          placeholder={t("searchUsersPlaceholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full ${
            locale === "ar" ? "pr-12 pl-4" : "pl-12 pr-4"
          } py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all duration-300`}
        />
      </div>
    </div>
  );
}
