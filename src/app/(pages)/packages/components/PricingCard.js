"use client";
import React, { useState } from "react";
import axios from "axios";

const PricingCard = ({ title, price, fullPrice, features, isPopular, planId }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAddToCart = async () => {
    setLoading(true);
    setMessage("");
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const response = await axios.post(
        "http://127.0.0.1:8000/api/plans/add-to-cart",
        { plan_id: planId },
        {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );
      setMessage(response.data.message || "Added to cart!");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage("Error adding to cart.");
      }
    }
    setLoading(false);
  };

  return (
    <div
      className={`bg-white p-8 shadow-lg ${
        isPopular ? "border-2" : "border border-gray-200"
      } hover:shadow-xl transition-shadow relative h-[400px] flex flex-col `}
    >
      <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
        {title}
      </h3>
      <div className="text-center mb-8">
        <div className="text-4xl font-[500] text-gray-900 mb-2">
          {price === "Free" ? (
            price
          ) : (
            <>
              ${price}
              <span className="text-lg font-normal text-gray-600">/month*</span>
            </>
          )}
        </div>
        {fullPrice && (
          <div className="text-sm text-gray-600">
            full payment: ${fullPrice}
          </div>
        )}
      </div>
      <div className="space-y-4 flex-grow">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center text-gray-700">
            {feature ? (
              <span className=" font-medium">{feature}</span>
            ) : (
              <span className="text-gray-400">-</span>
            )}
          </div>
        ))}
      </div>
      <button
        className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 px-6  transition-colors mt-8"
        onClick={handleAddToCart}
        disabled={loading}
      >
        {loading ? "Adding..." : "Add to Cart"}
      </button>
      {message && <div className="mt-2 text-center text-sm">{message}</div>}
    </div>
  );
};

export default PricingCard;
