import React from "react";
import { useTranslation } from "../../../../../TranslationContext";

export default function ConfirmDialog({ open, message, onConfirm, onCancel }) {
  const { t, locale } = useTranslation();

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          {t("confirmDeleteTitle")}
        </h2>
        <p className="mb-6 text-gray-600">{message}</p>
        <div
          className={`flex justify-end gap-3 ${
            locale === "ar" ? "flex-row-reverse" : ""
          }`}
        >
          <button
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
            onClick={onCancel}
          >
            {t("cancelButton")}
          </button>
          <button
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-colors"
            onClick={onConfirm}
          >
            {t("deleteButton")}
          </button>
        </div>
      </div>
    </div>
  );
}
