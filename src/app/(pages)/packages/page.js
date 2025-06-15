"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import PricingHeader from "./components/PricingHeader";
import HowItWorks from "./components/HowItWorks";
import PricingCard from "./components/PricingCard";

export default function PricingPage() {
  const [pricingPlans, setPricingPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status
    const token =
      typeof window !== "undefined"
        ? window.localStorage?.getItem("token")
        : null;
    setIsAuthenticated(!!token);

    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    setError(null);

    try {
      const token =
        typeof window !== "undefined"
          ? window.localStorage?.getItem("token")
          : null;

      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      const response = await axios.get("/api/plans", {
        headers,
      });

      // Transform the API data to match the component structure
      const transformedPlans = response.data.map((plan, index) => {
        // Parse features if it's a JSON string
        let features = [];
        if (plan.features) {
          try {
            features = JSON.parse(plan.features);
          } catch (e) {
            // If features is not valid JSON, split by comma or use as single feature
            features = plan.features.split(",").map((f) => f.trim());
          }
        }

        // Calculate full price based on billing interval and duration
        const monthlyPrice = plan.price / 100; // Convert cents to dollars
        const fullPrice =
          plan.billing_interval === "monthly"
            ? (monthlyPrice * (plan.duration / 30)).toFixed(0)
            : plan.price / 100;

        // Determine if this plan should be marked as popular
        const isPopular =
          index === 1 ||
          plan.name.toLowerCase().includes("standard plus") ||
          plan.name.toLowerCase().includes("popular");

        return {
          id: plan.id,
          title: plan.name,
          price: monthlyPrice === 0 ? "Free" : monthlyPrice.toFixed(0),
          fullPrice: monthlyPrice === 0 ? null : fullPrice,
          features: [
            `${
              plan.ads_Limit === 0 ? "Unlimited" : plan.ads_Limit
            } properties included`,
            `${plan.duration} days duration`,
            ...features,
          ],
          isPopular,
          planId: plan.id,
          billingInterval: plan.billing_interval,
          duration: plan.duration,
          adsLimit: plan.ads_Limit,
        };
      });

      setPricingPlans(transformedPlans);
    } catch (err) {
      console.error("Error fetching plans:", err);

      if (err.response?.status === 401) {
        setError(
          "Please login to view pricing plans, or contact support for pricing information."
        );
      } else {
        setError(
          err.response?.data?.message ||
            "Failed to load pricing plans. Please try again later."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Fallback plans if API fails or requires auth
  const fallbackPlans = [
    {
      id: "fallback-1",
      title: "Basic Package",
      price: "Free",
      features: ["5 properties included", "12 months duration"],
      isPopular: false,
      planId: null,
    },
    {
      id: "fallback-2",
      title: "Standard",
      price: "25",
      fullPrice: "150",
      features: ["8 properties included", "6 months duration", "24/7 Support"],
      isPopular: false,
      planId: null,
    },
    {
      id: "fallback-3",
      title: "Standard Plus",
      price: "35",
      fullPrice: "420",
      features: [
        "10 properties included",
        "12 months duration",
        "24/7 Support",
      ],
      isPopular: true,
      planId: null,
    },
    {
      id: "fallback-4",
      title: "Advanced",
      price: "50",
      fullPrice: "600",
      features: [
        "Unlimited properties included",
        "12 months duration",
        "24/7 Support",
        "Pro Features",
      ],
      isPopular: false,
      planId: null,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PricingHeader />
        <div className="max-w-7xl mx-auto px-6 py-16">
          <HowItWorks />
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400"></div>
          </div>
        </div>
      </div>
    );
  }

  const plansToShow = pricingPlans.length > 0 ? pricingPlans : fallbackPlans;
  const showFallbackMessage = pricingPlans.length === 0 && error;

  return (
    <div className="min-h-screen bg-gray-50">
      <PricingHeader />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <HowItWorks />

        {showFallbackMessage && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-yellow-600 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-yellow-800 text-sm">
                {!isAuthenticated
                  ? "Please login to access current pricing and add plans to cart."
                  : "Unable to load current pricing. Showing standard plans below."}
              </p>
            </div>
            {!isAuthenticated && (
              <div className="mt-3">
                <button
                  onClick={() => (window.location.href = "/login")}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                >
                  Login
                </button>
              </div>
            )}
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plansToShow.map((plan) => (
            <PricingCard
              key={plan.id}
              title={plan.title}
              price={plan.price}
              fullPrice={plan.fullPrice}
              features={plan.features}
              isPopular={plan.isPopular}
              planId={plan.planId}
              isDisabled={!plan.planId}
            />
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">*Billed as one payment</p>
          {error && (
            <div className="mt-4">
              <button
                onClick={fetchPlans}
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-2 px-4 rounded transition-colors"
              >
                Retry Loading Plans
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
