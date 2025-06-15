"use client";

export default function CouponSection({
  couponCode,
  setCouponCode,
  applyCoupon,
  updateCart,
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start mb-8">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Coupon code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          className="px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
        />
        <button
          onClick={applyCoupon}
          className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-medium transition-colors"
        >
          Apply coupon
        </button>
      </div>
      <button
        onClick={updateCart}
        className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-medium transition-colors"
      >
        Update cart
      </button>
    </div>
  );
}
