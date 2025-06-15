"use client";
import { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import CartTable from "./components/CartTable";
import CouponSection from "./components/CouponSection";
import CartTotals from "./components/CartTotals";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [couponMessage, setCouponMessage] = useState("");
  const [couponStatus, setCouponStatus] = useState("");

  // API base URL - adjust according to your Laravel setup
  const API_BASE = "http://127.0.0.1:8000/api/plans";

  // Load cart data on component mount
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/plans/mycart`);
      const data = await response.json();

      if (data.success) {
        setCartItems(data.cart_items);
        setSubtotal(data.subtotal);
        setTotal(data.total);
      }
    } catch (error) {
      console.error("Error loading cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1 || newQuantity > 10) return;

    setIsLoading(true);
    try {
      const csrfToken =
        document
          .querySelector('meta[name="csrf-token"]')
          ?.getAttribute("content") || "";
      const response = await fetch(`${API_BASE}/cart/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken,
        },
        body: JSON.stringify({
          plan_id: id,
          quantity: newQuantity,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setCartItems((items) =>
          items.map((item) =>
            item.id === id ? { ...item, quantity: newQuantity } : item
          )
        );
        setSubtotal(data.subtotal);
        setTotal(data.total);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (id) => {
    setIsLoading(true);
    try {
      const csrfToken =
        document
          .querySelector('meta[name="csrf-token"]')
          ?.getAttribute("content") || "";
      const response = await fetch(`${API_BASE}/cart/remove`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken,
        },
        body: JSON.stringify({ plan_id: id }),
      });

      const data = await response.json();
      if (data.success) {
        setCartItems((items) => items.filter((item) => item.id !== id));
        setSubtotal(data.subtotal);
        setTotal(data.total);
      }
    } catch (error) {
      console.error("Error removing item:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;

    setIsLoading(true);
    setCouponMessage("");

    try {
      const csrfToken =
        document
          .querySelector('meta[name="csrf-token"]')
          ?.getAttribute("content") || "";
      const response = await fetch(`${API_BASE}/cart/coupon`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken,
        },
        body: JSON.stringify({ coupon_code: couponCode }),
      });

      const data = await response.json();

      if (data.success) {
        setAppliedCoupon({
          code: couponCode,
          discount_percent: data.discount_percent,
        });
        setDiscount(data.discount_amount);
        setTotal(data.total);
        setCouponMessage(data.message);
        setCouponStatus("success");
      } else {
        setCouponMessage(data.message);
        setCouponStatus("error");
        setAppliedCoupon(null);
        setDiscount(0);
        setTotal(subtotal);
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      setCouponMessage("Error applying coupon. Please try again.");
      setCouponStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  const updateCart = async () => {
    await loadCart();
  };

  const proceedToCheckout = () => {
    if (total === 0) {
      alert("Your cart total is $0.00. Proceeding to free checkout...");
      // Redirect to checkout or handle free checkout
      window.location.href = "/checkout";
    } else {
      // Redirect to payment checkout
      window.location.href = "/checkout";
    }
  };

  if (isLoading && cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-yellow-400 py-16 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-[600] text-black">Cart</h1>
          <div className="text-black">
            <span>Home</span>
            <span className="mx-2">/</span>
            <span>Cart</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 bg-white min-h-screen">
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8">Add some plans to get started!</p>
            <button
              onClick={() => (window.location.href = "/plans")}
              className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-medium transition-colors"
            >
              Browse Plans
            </button>
          </div>
        ) : (
          <>
            <CartTable
              items={cartItems}
              updateQuantity={updateQuantity}
              removeItem={removeItem}
              isLoading={isLoading}
            />

            <CouponSection
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              applyCoupon={applyCoupon}
              updateCart={updateCart}
              isLoading={isLoading}
              couponMessage={couponMessage}
              couponStatus={couponStatus}
            />

            <CartTotals
              subtotal={subtotal}
              discount={discount}
              total={total}
              proceedToCheckout={proceedToCheckout}
              isLoading={isLoading}
              appliedCoupon={appliedCoupon}
            />
          </>
        )}
      </div>
    </div>
  );
}
