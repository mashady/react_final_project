"use client";
import PricingHeader from "./components/PricingHeader";
import HowItWorks from "./components/HowItWorks";
import PricingCard from "./components/PricingCard";

const plans = [
  {
    id: 1,
    title: "Free",
    price: 0,
    fullPrice: 0,
    features: ["5 properties per month", "12 months duration ",'-','-'],
  },
  {
    id: 2,
    title: "Standard",
    price: 25,
    fullPrice: 50,
    features: ["5 ads per month", "Priority support"],
  },
  {
    id: 3,
    title: "Premium",
    price: 50,
    fullPrice: 100,
    features: ["Unlimited ads", "Featured listing", "Premium support"],
  }, {
    id: 4,
    title: "Premium",
    price: 50,
    fullPrice: 100,
    features: ["Unlimited ads", "Featured listing", "Premium support"],
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white ">
      <PricingHeader />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <HowItWorks />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <PricingCard
              key={plan.id}
              title={plan.title}
              price={plan.price}
              fullPrice={plan.fullPrice}
              features={plan.features}
              isPopular={plan.isPopular}
              planId={plan.id}
              isDisabled={plan.isDisabled}
            />
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">*Billed as one payment</p>
        </div>
      </div>
    </div>
  );
}
