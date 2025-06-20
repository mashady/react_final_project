"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import LoadingSpinner from "../../properties/components/LoadingSpinner";

const stripePromise = loadStripe(
  "pk_test_51Oa1apC2Y3Ne3oUhz8quAdzU0O1aAgoTSP0wwiEMbUqZDd0knNgOnMSyU3Us4s05QjCdwvqmxA2EDGAT3Mj9a3kj00BKiR5q83"
); // replace with your real key

export default function CheckoutPage({ params }) {
  const { planId } = params;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!planId) return;

    const createCheckoutSession = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/create-checkout-session",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ plan_id: planId }),
          }
        );

        if (!response.ok) throw new Error("Failed to create session");

        const { sessionId } = await response.json();
        const stripe = await stripePromise;

        if (!stripe) throw new Error("Stripe failed to load");

        await stripe.redirectToCheckout({ sessionId });
      } catch (err) {
        console.error(err);
        setError("Payment failed to initialize. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    createCheckoutSession();
  }, [planId]);

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center">Complete Your Payment</h2>

      {loading && <LoadingSpinner />}

      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
}
