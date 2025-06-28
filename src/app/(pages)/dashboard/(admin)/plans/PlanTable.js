import React from "react";
import { DollarSign, Clock, Eye, Edit, Trash2 } from "lucide-react";

export default function PlanTable({
  plans,
  onView,
  onEdit,
  onDelete,
  getBillingIntervalBadge,
}) {
  return (
    <div className="bg-white rounded shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Plan Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Price
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Duration
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Billing
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Ads Limit
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Features
              </th>
              <th className="px-6 py-4 text-center text-sm font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {plans.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-12 text-center text-gray-500"
                >
                  <span className="text-lg font-medium">No plans found</span>
                  <p className="text-sm">
                    Create your first subscription plan to get started
                  </p>
                </td>
              </tr>
            ) : (
              plans.map((plan) => (
                <tr
                  key={plan.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{plan.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-gray-900">
                      <DollarSign className="w-4 h-4 mr-1" />
                      {plan.price}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-1" />
                      {plan.duration} days
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getBillingIntervalBadge(plan.billing_interval)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-900 font-medium">
                      {plan.ads_Limit}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-600 max-w-xs truncate">
                      {plan.features}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => onView(plan)}
                        className="p-2 text-black cursor-pointer hover:bg-yellow-50 rounded-lg transition-colors"
                        title="View Plan"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(plan)}
                        className="p-2 text-blue-500 cursor-pointer hover:bg-amber-50 rounded-lg transition-colors"
                        title="Edit Plan"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(plan.id)}
                        className="p-2 text-red-600 cursor-pointer hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Plan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
