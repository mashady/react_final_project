'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import axios from 'axios'

export default function PaymentSuccessPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const searchParams = useSearchParams()

  const sessionId = searchParams.get('session_id')
  const planId = searchParams.get('plan_id')

  const removeFromCart = async (planId) => {
    try {
      const response = await axios.post(
        'http://localhost:8000/api/plans/remove-from-cart',
        { plan_id: planId },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        }
      );
      console.log('Plan removed from cart:', response.data);
      return response.data;
     
    } catch (err) {
      console.error('Error removing from cart:', err);
      throw err.response?.data?.message || err.message || 'Failed to remove from cart';
    }
  };

  useEffect(() => {
    document.title = 'Payment Successful'

    const processPaymentSuccess = async () => {
      try {
        if (!sessionId || !planId) {
          throw new Error('Missing session ID or plan ID')
        }

        // Step 1: Verify payment with your backend
        // const paymentResponse = await axios.post(
        //   `http://localhost:8000/api/add-to-payment/${planId}`,
        //   {sessionId},
        //   {
        //     withCredentials: true,
        //     headers: {
        //       'Content-Type': 'application/json',
        //       'Accept': 'application/json',
        //       'Authorization': `Bearer ${localStorage.getItem('token')}`
        //     },
        //   }
        // )

        // Step 2: Remove from cart after successful payment
        await removeFromCart(planId);

        // Step 3: Subscribe user to the plan
        const subscribeResponse = await axios.post(
          'http://localhost:8000/api/plans/subscribe',
          { plan_id: planId },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
          }
        )

        if (subscribeResponse.status !== 200) {
          throw new Error('Subscription failed')
        }

        setSuccess(true)
      } catch (err) {
        console.error('Payment success processing error:', err)
        setError(err.response?.data?.message || err.message || 'Payment processing failed')
      } finally {
        setLoading(false)
      }
    }

    if (sessionId && planId) {
      processPaymentSuccess()
    } else {
      setError('Missing payment verification details')
      setLoading(false)
    }
  }, [sessionId, planId])

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-green-50 text-center px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-8 border border-green-200">
        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Activating your subscription...</p>
          </div>
        ) : error ? (
          <div>
            <svg
              className="mx-auto mb-4 text-red-500 w-16 h-16"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <h1 className="text-2xl font-semibold text-red-600 mb-2">Processing Error</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500 mb-6">
              Please contact support if the problem persists
            </p>
            <div className="flex flex-col space-y-2">
              <Link
                href="/plans"
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                View Plans
              </Link>
              <Link
                href="/support"
                className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
              >
                Contact Support
              </Link>
            </div>
          </div>
        ) : (
          <>
            <svg
              className="mx-auto mb-4 text-green-500 w-16 h-16"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <h1 className="text-2xl font-semibold text-green-600 mb-2">Subscription Activated!</h1>
            <p className="text-gray-600 mb-6">
              Your payment was successful and your subscription is now active.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                href="/account/subscriptions"
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                Manage Subscription
              </Link>
              <Link
                href="/"
                className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
              >
                Go to Dashboard
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}