"use client";
import React, { useState } from "react";
import { Star } from "lucide-react";
import Toast from "../../property/[id]/components/Toast";
import { useRouter } from "next/navigation";
const PricingCard = ({
  title,
  price,
  fullPrice,
  features,
  isPopular,
  planId,
  isDisabled = false,
  isUpgrade,
  duration = "/month*", // Add duration prop with default
}) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState({
    message: "",
    type: "",
    visible: false,
  });
  let router = useRouter();
  const showToast = (message, type) => {
    setToast({ message, type, visible: true });
  };

  const handleCloseToast = () => {
    setToast({ ...toast, visible: false });
  };
  const handleAddToCart = async () => {
    if (!planId) {
      showToast("Invalid plan selected", "error");

      // setMessage("Invalid plan selected");
      return;
    }

    const token = window.localStorage?.getItem("token");
    if (!token) {
      // router.push would be used here in your actual implementation
      router.push("/login");
      console.log("Redirect to login");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Your axios call would go here in the actual implementation
      const response = await fetch(
        "http://127.0.0.1:8000/api/plans/add-to-cart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ plan_id: planId }),
        }
      );

      const data = await response.json();
      setToast("Added to cart successfully!", "success");
      // setMessage(data.message || "Added to cart successfully!");

      // Auto-navigate to cart after successful addition
      router.push("/cart");
      // setTimeout(() => {
      //   console.log("Navigate to cart");
      // }, 1500);
    } catch (err) {
      console.error("Add to cart error:", err);
      setToast("Error adding to cart", "error");

      // setMessage("Error adding to cart");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`bg-[#fbfbfb] rounded shadow-sm border border-gray-200 p-8 relative flex flex-col h-full ${
        isPopular ? "bg-blue-50 border-blue-200" : ""
      }`}
    >
      {/* Popular badge */}
      {isPopular && (
        <div className="absolute -top-3 right-6">
          <div className="bg-white rounded-full p-2 shadow-sm border border-gray-200">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">{title}</h3>

        {/* Price */}
        <div className="mb-2">
          {price === "Free" ? (
            <span className="text-4xl font-bold text-gray-900">Free</span>
          ) : (
            <div className="flex items-center justify-center">
              <span className="text-4xl font-bold text-gray-900">${price}</span>
              <span className="text-gray-600 ml-1">{duration}</span>
            </div>
          )}
        </div>

        {/* Full price */}
        {fullPrice && (
          <div className="text-sm text-gray-600">
            full payment: ${fullPrice}
          </div>
        )}
      </div>

      {/* Features */}
      <div className="space-y-4 mb-8 flex-grow">
        {features.map((feature, index) => (
          <div key={index} className="text-center">
            {feature === "-" ? (
              <span className="text-gray-400">-</span>
            ) : (
              <span
                className="text-gray-700"
                dangerouslySetInnerHTML={{ __html: feature }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Button */}
      <div className="mt-auto">
        <button
          onClick={handleAddToCart}
          disabled={loading || isDisabled}
          className={`w-full py-3 px-6 rounded-none font-medium transition-colors cursor-pointer ${
            isDisabled
              ? "bg-gray-300 text-gray-600 cursor-not-allowed "
              : isUpgrade
              ? "bg-yellow-500 hover:bg-yellow-600 text-black"
              : "bg-yellow-500 hover:bg-yellow-600 text-black"
          } ${loading && "opacity-50 cursor-wait"}`}
        >
          {loading
            ? "Adding..."
            : isDisabled
            ? "Current Plan"
            : isUpgrade
            ? "Upgrade"
            : "Get Started"}
        </button>

        {/* {message && (
          <p
            className={`text-sm mt-2 text-center ${
              message.includes("Error") ? "text-red-500" : "text-green-500"
            }`}
          >
            {message}
          </p>
        )} */}
      </div>
      {toast.visible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={handleCloseToast}
        />
      )}
    </div>
  );
};

export default PricingCard;
