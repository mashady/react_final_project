"use client";
import PricingHeader from "./components/PricingHeader";
import HowItWorks from "./components/HowItWorks";
import PricingCard from "./components/PricingCard";

const pricingPlans = [
  {
    title: "Basic Package",
    price: "Free",
    features: ["5 properties included", "12 months duration", null, null],
  },
  {
    title: "Standard",
    price: "25",
    fullPrice: "150",
    features: [
      "8 properties included",
      "6 months duration",
      "24/7 Support",
      null,
    ],
  },
  {
    title: "Standard Plus",
    price: "35",
    fullPrice: "420",
    features: [
      "10 properties included",
      "12 months duration",
      "24/7 Support",
      null,
    ],
    isPopular: true,
  },
  {
    title: "Advanced",
    price: "50",
    fullPrice: "600",
    features: [
      "Unlimited properties included",
      "12 months duration",
      "24/7 Support",
      "Pro Features",
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PricingHeader />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <HowItWorks />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pricingPlans.map((plan, index) => (
            <PricingCard
              key={index}
              title={plan.title}
              price={plan.price}
              fullPrice={plan.fullPrice}
              features={plan.features}
              isPopular={plan.isPopular}
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
