"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const PricingCard = ({
  title,
  price,
  fullPrice,
  features,
  isPopular,
  planId,
  isDisabled = false,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAddToCart = async () => {
    if (!planId) {
      setMessage("Invalid plan selected");
      return;
    }

    const token = window.localStorage?.getItem("token");
    if (!token) {
      router.push(
        `/login?returnTo=${encodeURIComponent(window.location.pathname)}`
      );
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/plans/add-to-cart",
        { plan_id: planId },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message || "Added to cart successfully!");

      // Auto-navigate to cart after successful addition
      setTimeout(() => {
        router.push("/cart");
      }, 1500);
    } catch (err) {
      console.error("Add to cart error:", err);
      if (err.response?.status === 401) {
        // Token expired or invalid
        window.localStorage.removeItem("token");
        router.push(
          `/login?returnTo=${encodeURIComponent(window.location.pathname)}`
        );
      } else {
        setMessage(err.response?.data?.message || "Error adding to cart");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-lg p-8 relative flex flex-col ${
        isPopular ? "border-2 border-yellow-400" : ""
      }`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-yellow-400 text-black px-8 py-2 rounded-full text-sm font-semibold">
            Most Popular
          </span>
        </div>
      )}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
        <div className="flex items-center justify-center gap-2">
          <span className="text-4xl font-bold">${price}</span>
          {fullPrice && (
            <span className="text-gray-500 line-through">${fullPrice}</span>
          )}
        </div>
      </div>
      <ul className="space-y-4 mb-8 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-green-500 mt-1 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span
              className="text-gray-600"
              dangerouslySetInnerHTML={{ __html: feature }}
            />
          </li>
        ))}
      </ul>
      <div>
        <button
          onClick={handleAddToCart}
          disabled={loading || isDisabled}
          className={`w-full py-3 px-6 rounded ${
            isPopular
              ? "bg-yellow-400 hover:bg-yellow-500 text-black"
              : "bg-black hover:bg-gray-800 text-white"
          } transition-colors ${
            (loading || isDisabled) && "opacity-50 cursor-not-allowed"
          }`}
        >
          {loading ? "Adding..." : "Add to Cart"}
        </button>
        {message && (
          <p
            className={`text-sm mt-2 text-center ${
              message.includes("Error") ? "text-red-500" : "text-green-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default PricingCard;
