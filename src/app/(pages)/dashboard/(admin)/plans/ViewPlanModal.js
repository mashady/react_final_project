import React from "react";
import { X, Edit, DollarSign, Clock } from "lucide-react";
import { useTranslation } from "../../../../../TranslationContext";

export default function ViewPlanModal({
  plan,
  onClose,
  onEdit,
  getBillingIntervalBadge,
}) {
  const { t, locale } = useTranslation();

  if (!plan) return null;

  return (
    <div
      className="fixed inset-0 bg-[#000000e0] bg-opacity-50 flex items-center justify-center z-50 p-4"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div
          className={`flex items-center justify-between p-6 border-b ${
            locale === "ar" ? "flex-row-reverse" : ""
          }`}
        >
          <h2 className="text-2xl font-semibold text-gray-900">
            {t("planDetailsTitle")}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label={t("closeButton")}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                {t("planNameLabel")}
              </h3>
              <p className="text-lg font-semibold text-gray-900">{plan.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                {t("priceLabel")}
              </h3>
              <p className="text-lg font-semibold text-green-600 flex items-center">
                {plan.price}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                {t("durationLabel")}
              </h3>
              <p className="text-lg text-gray-900 flex items-center">
                {plan.duration} {t("days")}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                {t("billingIntervalLabel")}
              </h3>
              <div className="mt-1">
                {getBillingIntervalBadge(plan.billing_interval)}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                {t("adsLimitLabel")}
              </h3>
              <p className="text-lg font-semibold text-black">
                {plan.ads_Limit}
              </p>
            </div>
          </div>
          {plan.features && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                {t("featuresLabel")}
              </h3>
              <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                {plan.features}
              </p>
            </div>
          )}
          <div
            className={`flex items-center justify-end pt-6 border-t ${
              locale === "ar" ? "space-x-reverse" : ""
            } space-x-4`}
          >
            <button
              onClick={() => onEdit(plan)}
              className="px-6 py-3 cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg transition-colors flex items-center gap-2"
            >
              {t("editPlanButton")}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border cursor-pointer border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t("closeButton")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
