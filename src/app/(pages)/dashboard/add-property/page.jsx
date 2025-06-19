"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import PropertyForm from "@/components/add-property/PropertyForm";
import Link from "next/link";

const Page = () => {
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
    return (
      <div className="text-center py-10 text-gray-500">
        Checking subscription status...
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  if (!hasSubscription) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold text-red-600 mb-4">
          You don’t have an active subscription
        </h2>
        <p className="text-gray-600 mb-4">
          Please choose a plan to be able to add a property.
        </p>
        <Link
          href="/plans"
          className="inline-block px-6 py-2 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition"
        >
          View Plans
        </Link>
      </div>
    );
  }

  return (
    <div>
      <PropertyForm />
    </div>
  );
};

export default Page;
