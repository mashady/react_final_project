"use client";
import React from "react";
import { Trash2 } from "lucide-react";
import { useTranslation } from "../../../../../TranslationContext";

export default function DeletePlanModal({ open, onCancel, onConfirm }) {
  const { t, locale } = useTranslation();

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-[#000000e0] bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md"
        dir={locale === "ar" ? "rtl" : "ltr"}
      >
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
            {t("deletePlanTitle")}
          </h3>
          <p className="text-gray-600 text-center mb-6">
            {t("deletePlanConfirmation")}
          </p>
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={onCancel}
              className="px-6 py-3 border cursor-pointer border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              {t("cancelButton")}
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-3 bg-red-600 cursor-pointer hover:bg-red-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
            >
              {t("deletePlanButton")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
