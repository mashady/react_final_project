"use client";
import { useTranslation } from "@/TranslationContext";
import { X } from "lucide-react";

export default function CartTable({ items, removeItem, isLoading }) {
  const { t } = useTranslation();
  return (
    <div className="overflow-x-auto mb-8">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-4 px-4 font-medium text-gray-700">
              {t("cartTableItemProduct")}
            </th>
            <th className="text-left py-4 px-4 font-medium text-gray-700">
              {t("cartTableItemPrice")}
            </th>
            <th className="text-left py-4 px-4 font-medium text-gray-700">
              {t("cartTableItemBilling")}
            </th>
            <th className="text-left py-4 px-4 font-medium text-gray-700">
              {t("cartTableItemSubtotal")}
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-gray-100">
              <td className="py-6 px-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => removeItem(item.plan.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    disabled={isLoading}
                  >
                    <X size={20} />
                  </button>
                  <div>
                    <span className="font-medium text-gray-900 block">
                      {item.plan?.name ?? "-"}
                    </span>
                    {item.plan?.features && (
                      <span className="text-sm text-gray-500">
                        {item.plan?.ads_Limit
                          ? `${item.plan.ads_Limit} ads limit`
                          : "Unlimited ads"}
                      </span>
                    )}
                  </div>
                </div>
              </td>
              <td className="py-6 px-4 font-medium">
                $
                {item.plan?.price !== undefined
                  ? item.plan.price.toFixed(2)
                  : "0.00"}
              </td>
              <td className="py-6 px-4 text-sm text-gray-600">
                {item.plan?.billing_interval ?? "-"} (
                {item.plan?.duration ?? "-"} {t("cartTableItemDays")})
              </td>
              <td className="py-6 px-4 font-medium">
                {item.plan?.price ? `$${item.plan.price.toFixed(2)}` : "0.00"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
