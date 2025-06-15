"use client";

export default function CartTotals({ subtotal, total, proceedToCheckout }) {
  return (
    <div className="flex justify-start">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Cart totals</h2>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center py-3 border-b border-gray-200">
            <span className="text-gray-700 font-medium">Subtotal</span>
            <span className="font-medium">{subtotal.toFixed(2)} $</span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-gray-200">
            <span className="text-gray-900 font-bold">Total</span>
            <span className="font-bold">{total.toFixed(2)} $</span>
          </div>
        </div>

        <button
          onClick={proceedToCheckout}
          className="w-full px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-medium transition-colors"
        >
          Proceed to checkout
        </button>
      </div>
    </div>
  );
}
