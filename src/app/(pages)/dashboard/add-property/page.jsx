"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import PropertyForm from "@/components/add-property/PropertyForm";
import Link from "next/link";
import LoadingSpinner from "../../properties/components/LoadingSpinner";
import DashboardEmptyMsg from "@/components/dashboard/DashboardEmptyMsg";
import RequireAuth from "@/components/shared/RequireAuth";

const AddPropertyContent = () => {
  const [loading, setLoading] = useState(true);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("User not authenticated");
        }

        const response = await axios.get(
          "http://localhost:8000/api/plans/my-subscription",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data && response.data.active) {
          setHasSubscription(true);
        } else {
          setHasSubscription(false);
        }
      } catch (err) {
        if (err?.response?.data?.message === "No active subscription found") {
          setHasSubscription(false);
        } else {
          setError(
            err?.response?.data?.message ||
              err.message ||
              "Something went wrong"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    checkSubscription();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  if (!hasSubscription) {
    return (
      <DashboardEmptyMsg
        msg="You don’t have an active subscription"
        btn="Explore Plans"
        link="/plans"
      />
    );
  }

  return <PropertyForm />;
};

const AddPropertyPage = () => (
  <RequireAuth allowedRoles={["owner", "admin"]}>
    <AddPropertyContent />
  </RequireAuth>
);

export default AddPropertyPage;
