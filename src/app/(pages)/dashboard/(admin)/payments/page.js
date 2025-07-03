"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import api from "../../../../../api/axiosConfig";
import DashboardEmptyMsg from "@/components/dashboard/DashboardEmptyMsg";
import RequireAuth from "@/components/shared/RequireAuth";
import { useTranslation } from "@/TranslationContext";
import LoadingSpinner from "@/app/(pages)/properties/components/LoadingSpinner";

const validatePaymentData = (payment) => {
  if (!payment) return false;

  const requiredFields = [
    "id",
    "transaction_id",
    "total",
    "created_at",
    "status",
    "payment_method",
    "user_id",
  ];
  const hasAllFields = requiredFields.every(
    (field) => payment[field] !== undefined
  );

  if (!hasAllFields) return false;

  return (
    typeof payment.id === "number" &&
    typeof payment.transaction_id === "string" &&
    !isNaN(parseFloat(payment.total)) &&
    !isNaN(Date.parse(payment.created_at)) &&
    typeof payment.status === "string" &&
    typeof payment.payment_method === "string" &&
    typeof payment.user_id === "number"
  );
};

const getSafeData = (payment, locale) => {
  const safePlanName = payment.plan?.name || "N/A";
  const safeAmount = !isNaN(parseFloat(payment.total))
    ? parseFloat(payment.total)
    : 0;

  let safeDate;
  try {
    safeDate = new Date(payment.created_at).toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    safeDate = "Invalid date";
  }

  const safeStatus = ["completed", "pending", "failed"].includes(
    payment.status.toLowerCase()
  )
    ? payment.status.toLowerCase()
    : "unknown";

  return {
    id: payment.id,
    transactionId: payment.transaction_id || "N/A",
    date: safeDate,
    plan: safePlanName,
    amount: safeAmount,
    status: safeStatus,
    paymentMethod: (payment.payment_method || "unknown").toLowerCase(),
    details: payment.plan?.features || "No details available",
    user: payment.user || { name: "Unknown User" },
    currency: payment.currency || "EGP",
  };
};

const PaymentHistoryContent = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const { t, locale } = useTranslation();

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        setError(null);
        setValidationErrors([]);

        const response = await api.get("/all-payments");

        if (!response || response.status !== 200) {
          throw new Error(response?.statusText || "Failed to fetch payments");
        }

        const data = response.data;
        console.log("API Response:", data);

        if (!Array.isArray(data)) {
          throw new Error("Invalid data format: expected an array");
        }

        const validatedPayments = [];
        const validationWarnings = [];

        data.forEach((payment, index) => {
          if (!validatePaymentData(payment)) {
            validationWarnings.push(
              `Payment at index ${index} failed validation`
            );
            console.warn("Invalid payment data:", payment);
            return;
          }
          validatedPayments.push(getSafeData(payment, locale));
        });

        if (validationWarnings.length > 0) {
          setValidationErrors(validationWarnings);
          console.warn("Validation warnings:", validationWarnings);
        }

        if (validatedPayments.length === 0 && data.length > 0) {
          throw new Error("No valid payment records found");
        }

        setPayments(validatedPayments);
        setTotalPages(Math.ceil(validatedPayments.length / recordsPerPage));
      } catch (err) {
        console.error("Error fetching payments:", err);
        setError(err.message || "Failed to load payment history");
        setPayments([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [locale]);

  useEffect(() => {
    if (payments.length > 0) {
      const indexOfLastRecord = currentPage * recordsPerPage;
      const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
      setFilteredPayments(
        payments.slice(indexOfFirstRecord, indexOfLastRecord)
      );
    } else {
      setFilteredPayments([]);
    }
  }, [currentPage, payments]);

  const totalAmount = payments.reduce((sum, payment) => {
    return sum + payment.amount;
  }, 0);

  const formatCurrency = (amount, currency = "EGP") => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto">
      <DashboardPageHeader
        title={t("paymentHistoryHeader")}
        description={t("paymentHistoryDescription")}
      />

      {validationErrors.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Data validation issues detected
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc pl-5 space-y-1">
                  {validationErrors.slice(0, 3).map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                  {validationErrors.length > 3 && (
                    <li>...and {validationErrors.length - 3} more</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
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
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {payments.length === 0 && !loading && !error ? (
        <DashboardEmptyMsg
          msg={t("noPaymentsMessage")}
          btn={t("explorePlansButton")}
          link="/plans"
        />
      ) : (
        <>
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">
                  {t("totalTransactions")}
                </h3>
                <p className="text-2xl font-semibold text-gray-900">
                  {payments.length}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">
                  {t("completedPayments")}
                </h3>
                <p className="text-2xl font-semibold text-gray-900">
                  {payments.filter((p) => p.status === "completed").length}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">
                  {t("totalRevenue")}
                </h3>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatCurrency(totalAmount)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 overflow-hidden mb-4 rounded-lg shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("userHeader")}
                    </th>
                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("transactionIdHeader")}
                    </th> */}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("dateHeader")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("planHeader")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("amountHeader")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("statusHeader")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("paymentMethodHeader")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("detailsHeader")}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {payment.user?.name || "Unknown User"}
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {payment.transactionId.length > 8
                          ? `${payment.transactionId.substring(0, 8)}...`
                          : payment.transactionId}
                      </td> */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.plan}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {formatCurrency(payment.amount, payment.currency)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            payment.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : payment.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {t(payment.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {payment.paymentMethod}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {payment.details}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {payments.length > recordsPerPage && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-b-lg">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {t("previous")}
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {t("next")}
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div></div>
                <div>
                  <nav
                    className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                        currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                      }`}
                    >
                      <span className="sr-only">{t("previous")}</span>
                      {"<"}
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          aria-current={
                            currentPage === page ? "page" : undefined
                          }
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                            currentPage === page
                              ? "bg-yellow-500 text-black cursor-pointer"
                              : "text-gray-900 ring-1 ring-inset cursor-pointer ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                        currentPage === totalPages
                          ? "cursor-not-allowed opacity-50"
                          : ""
                      }`}
                    >
                      <span className="sr-only">{t("next")}</span>
                      {">"}
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const PaymentHistory = () => (
  <RequireAuth allowedRoles={["admin"]}>
    <PaymentHistoryContent />
  </RequireAuth>
);

export default PaymentHistory;
