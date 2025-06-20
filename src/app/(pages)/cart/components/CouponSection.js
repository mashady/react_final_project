"use client";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function CouponSection({
  couponCode,
  setCouponCode,
  applyCoupon,
  updateCart,
  isLoading,
  couponMessage,
  couponStatus,
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start mb-8">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Coupon code (try: SAVE10, SAVE20, WELCOME)"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            className="px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={applyCoupon}
            disabled={!couponCode.trim() || isLoading}
            className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-black font-medium transition-colors"
          >
            {isLoading ? "Applying..." : "Apply coupon"}
          </button>
        </div>
        {couponMessage && (
          <div
            className={`flex items-center gap-2 text-sm ${
              couponStatus === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {couponStatus === "success" ? (
              <CheckCircle size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            {couponMessage}
          </div>
        )}
      </div>
      <button
        onClick={updateCart}
        disabled={isLoading}
        className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-black font-medium transition-colors"
      >
        {isLoading ? "Updating..." : "Update cart"}
      </button>
    </div>
  );
}
