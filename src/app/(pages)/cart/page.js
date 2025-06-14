"use client";
import { useState } from "react";
import CartTable from "./components/CartTable";
import CouponSection from "./components/CouponSection";
import CartTotals from "./components/CartTotals";

export default function ShoppingCart() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Basic Package",
      price: 0.0,
      quantity: 1,
    },
  ]);

  const [couponCode, setCouponCode] = useState("");

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subtotal;

  const applyCoupon = () => {
    console.log("Applying coupon:", couponCode);
  };

  const updateCart = () => {
    console.log("Cart updated");
  };

  const proceedToCheckout = () => {
    console.log("Proceeding to checkout");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <CartTable
        items={cartItems}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
      />

      <CouponSection
        couponCode={couponCode}
        setCouponCode={setCouponCode}
        applyCoupon={applyCoupon}
        updateCart={updateCart}
      />

      <CartTotals
        subtotal={subtotal}
        total={total}
        proceedToCheckout={proceedToCheckout}
      />
    </div>
  );
}
