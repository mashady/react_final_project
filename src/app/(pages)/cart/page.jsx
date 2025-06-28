"use client";
import { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import CartTable from "./components/CartTable";
import CouponSection from "./components/CouponSection";
import CartTotals from "./components/CartTotals";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../properties/components/LoadingSpinner";
import Header from "@/components/shared/Header";
import Toast from "@/app/(pages)/property/[id]/components/Toast";
import { setLoading } from "@/features/wishlist/wishlistSlice";
import { useTranslation } from "@/TranslationContext";
import RequireAuth from "@/components/shared/RequireAuth";

const CartPageContent = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [couponMessage, setCouponMessage] = useState("");
  const [couponStatus, setCouponStatus] = useState("");
  const [session, $session] = useState("");
  const [toastData, setToastData] = useState(null);

  const API_BASE = "http://127.0.0.1:8000/api/plans";

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    setIsLoading(true);
    try {
      const axios = (await import("axios")).default;
      const token = getToken();
      const response = await axios.get(`${API_BASE}/mycart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;

      if (Array.isArray(data)) {
        setCartItems(data);
        calculateTotals(data);
      } else if (data.message) {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error loading cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotals = (items) => {
    const calculatedSubtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setSubtotal(calculatedSubtotal);
    setTotal(calculatedSubtotal - discount);
  };

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1 || newQuantity > 10) return;

    setIsLoading(true);
    try {
      const axios = (await import("axios")).default;
      const token = getToken();
      const response = await axios.patch(
        `${API_BASE}/cart/update`,
        {
          plan_id: id,
          quantity: newQuantity,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      if (data.success) {
        const updatedItems = cartItems.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        );
        setCartItems(updatedItems);
        calculateTotals(updatedItems);
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
      const axios = (await import("axios")).default;
      const token = getToken();
      const response = await axios
        .post(
          `${API_BASE}/remove-from-cart`,
          { plan_id: id },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          console.log(response.data);
          loadCart();
        })
        .catch((error) => {
          console.error(error);
        });

      const data = response.data;
      if (data.success) {
        const updatedItems = cartItems.filter((item) => item.id !== id);
        setCartItems(updatedItems);
        calculateTotals(updatedItems);
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
      const axios = (await import("axios")).default;
      const token = getToken();
      const response = await axios.post(
        `${API_BASE}/cart/coupon`,
        { coupon_code: couponCode },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      if (data.success) {
        setAppliedCoupon({
          code: couponCode,
          discount_percent: data.discount_percent,
        });
        setDiscount(data.discount_amount);
        setTotal(subtotal - data.discount_amount);
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

  const proceedToCheckout = (planId, id) => {
    if (!planId) {
      console.error("No plan ID provided for checkout");
      return;
    }

    if (cartItems.length > 1) {
      setToastData({
        message: "You can't buy more than 1 plan at a time",
        type: "error",
      });
      return;
    }

    setIsLoading(true);

    if (planId === 1) {
      const $session = "freeplan" + id;
      router.push(`/payment-success?session_id=${$session}&plan_id=${planId}`);
    } else {
      router.push(`/payment/${planId}`);
    }
  };

  if (isLoading && cartItems.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={t("navbarCart")} />

      <div className="max-w-6xl mx-auto p-6 bg-white mt-6">
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t("cartEmpty")}
            </h2>
            <p className="text-gray-600 mb-8">{t("cartEmptyMsg")}</p>
            <button
              onClick={() => router.push("/plans")}
              className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-medium transition-colors"
            >
              {t("cartAddPlans")}
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

            {/* <CouponSection
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              applyCoupon={applyCoupon}
              updateCart={updateCart}
              isLoading={isLoading}
              couponMessage={couponMessage}
              couponStatus={couponStatus}
            /> */}

            <CartTotals
              subtotal={cartItems}
              discount={discount}
              total={total}
              proceedToCheckout={() =>
                proceedToCheckout(cartItems[0]?.plan_id, cartItems[0]?.id)
              }
              isLoading={isLoading}
              appliedCoupon={appliedCoupon}
            />
            {toastData && (
              <Toast
                message={toastData.message}
                type={toastData.type}
                onClose={() => setToastData(null)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

const CartPage = () => (
  <RequireAuth allowedRoles={["owner"]}>
    <CartPageContent />
  </RequireAuth>
);

export default CartPage;
