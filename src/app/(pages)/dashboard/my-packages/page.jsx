"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import api from "../../../../api/axiosConfig";
import Link from "next/link";
import LoadingSpinner from "../../properties/components/LoadingSpinner";
import DashboardEmptyMsg from "@/components/dashboard/DashboardEmptyMsg";
import RequireAuth from "@/components/shared/RequireAuth"; // ✅ import

const MyPackagesContent = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasNoPlan, setHasNoPlan] = useState(false);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await api.get("/plans/my-subscription");

        if (response.status !== 200) {
          throw new Error(`Failed to fetch plan: ${response.statusText}`);
        }

        const data = response.data;

        if (!data || !data.plan) {
          setHasNoPlan(true);
          setPackages([]);
          setError(null);
          return;
        }

        const transformedPackage = {
          id: 1,
          package: data.plan?.name
            ? `${data?.plan?.name} Package`
            : "Basic Package",
          expirationDate: data.ends_at
            ? new Date(data.ends_at).toLocaleDateString("en-GB")
            : "N/A",
          itemsIncluded: data.plan?.ads_Limit ?? 0,
          itemsRemaining:
            data.ads_remain !== undefined && data.plan?.ads_Limit !== undefined
              ? data.plan.ads_Limit - data.ads_remain
              : data.plan?.name === "Free"
              ? 5
              : data.plan?.name === "Pro"
              ? 20
              : 50,
          status: data.active ? "Active" : "Expired",
          price:
            data?.plan?.price !== undefined
              ? `${Number(data.plan.price).toFixed(2)} $`
              : "0.00 $",
          orderStatus: "completed",
        };

        setPackages([transformedPackage]);
        setHasNoPlan(false);
        setError(null);
      } catch (err) {
        console.error("Error fetching plan:", err);
        setError(err.message || "Failed to load package information");

        if (!err.response || err.response.status !== 404) {
          setPackages([
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
          ]);
        } else {
          setHasNoPlan(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, []);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <DashboardPageHeader
          title="My Packages"
          description="This is a list of all your packages."
        />
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error}. Showing default package information.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {hasNoPlan ? (
        <DashboardEmptyMsg
          msg="You haven't added any plan yet."
          btn="Explore plans"
          link="/plans"
        />
      ) : (
        <>
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
                      Price
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
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            pkg.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {pkg.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {pkg.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-start">
            <Link href="/plans">
              <Button className="text-black bg-yellow-500 hover:bg-yellow-600 cursor-pointer rounded-none">
                Upgrade Package
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

const MyPackages = () => (
  <RequireAuth allowedRoles={["owner"]}>
    <MyPackagesContent />
  </RequireAuth>
);

export default MyPackages;
