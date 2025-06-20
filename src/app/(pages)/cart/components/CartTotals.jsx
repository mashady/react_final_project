"use client";
import { ShoppingCart } from "lucide-react";

export default function CartTotals({
  subtotal,
  discount,
  total,
  proceedToCheckout,
  isLoading,
  appliedCoupon,
}) {
  return (
    <div className="flex justify-start">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Cart totals</h2>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center py-3 border-b border-gray-200">
            <span className="text-gray-700 font-medium">Subtotal</span>
            <span className="font-medium">
              ${subtotal[0].plan?.price.toFixed(2) ?? "0.00"}
            </span>
          </div>

          {/*
          {appliedCoupon && discount > 0 && (
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-green-600 font-medium">
                Discount ({appliedCoupon.code} -{" "}
                {appliedCoupon.discount_percent}%)
              </span>
              <span className="text-green-600 font-medium">
                -${discount.toFixed(2)}
              </span>
            </div>
          )}
          */}

          <div className="flex justify-between items-center py-3 border-b border-gray-200">
            <span className="text-gray-900 font-bold">Total</span>
            <span className="font-bold text-lg">
              ${subtotal[0].plan?.price.toFixed(2) ?? "0.00"}
            </span>
          </div>
        </div>

        <button
          onClick={proceedToCheckout}
          disabled={isLoading}
          className="w-full px-6 py-3 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-black font-medium transition-colors flex items-center justify-center gap-2"
        >
          <ShoppingCart size={20} />
          {isLoading ? "Processing..." : "Proceed to checkout"}
        </button>
      </div>
    </div>
  );
}
