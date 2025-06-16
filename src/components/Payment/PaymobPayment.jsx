// components/StripeCheckout.tsx
'use client';

import { useState } from 'react';
import {
  loadStripe
} from '@stripe/stripe-js';
import {
  Elements,
  useStripe,
  useElements,
  CardElement
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_...'); // Your publishable key

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('http://localhost:8000/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 10 }) // $10
    });

    const { clientSecret } = await res.json();

    const result = await stripe?.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements?.getElement(CardElement) || null,
      },
    });

    if (result?.error) {
      alert(result.error.message);
    } else if (result?.paymentIntent?.status === 'succeeded') {
      alert('Payment succeeded!');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button disabled={!stripe || loading} className="mt-4 p-2 bg-blue-500 text-white rounded">
        {loading ? 'Processing...' : 'Pay $10'}
      </button>
    </form>
  );
};

export default function StripeCheckout() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
