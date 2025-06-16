"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
const MyPackages = () => {
  const packages = [
    {
      id: 1,
      package: "Basic Package",
      expirationDate: "14/06/2026",
      itemsIncluded: 5,
      itemsRemaining: 5,
      status: "Active",
      orderId: "#3548",
      price: "0.00 $",
      orderStatus: "completed",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <DashboardPageHeader
        title="My Packages"
        description="This is a list of all your packages."
      />

      <div className="bg-white border border-gray-200 overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                  Package
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                  Expiration Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                  Items Included
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                  Items Remaining
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                  Order Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {packages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {pkg.package}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {pkg.expirationDate}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {pkg.itemsIncluded}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {pkg.itemsRemaining}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full`}
                    >
                      {pkg.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {pkg.orderId}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    {pkg.price}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-medium `}>
                      {pkg.orderStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-start">
        <Button className="text-black bg-yellow-500 hover:bg-yellow-600 cursor-pointer rounded-none">
          But Package
        </Button>
      </div>
    </div>
  );
};

export default MyPackages;
