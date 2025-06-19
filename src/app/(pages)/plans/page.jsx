"use client";
import React, { useEffect, useState } from "react";
import PricingHeader from "./components/PricingHeader";
import HowItWorks from "./components/HowItWorks";
import PricingCard from "./components/PricingCard";
import axios from "axios";

const plans = [
  {
    id: 1,
    title: "Free",
    price: 0,
    fullPrice: 0,
    features: ["2 properties per month", "one Time Offer ", "-", "-"],
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
    title: "Standard Plus",
    price: 50,
    fullPrice: 100,
    features: ["10 ads", "Featured listing", "Premium support"],
  },
  {
    id: 4,
    title: "Premium",
    price: 100,
    fullPrice: 150,
    features: ["Unlimited ads", "Featured listing", "Premium support"],
  },
];

export default function PricingPage() {
  const [currentPlanId, setCurrentPlanId] = useState(null);
  const [hasPlan, setHasPlan] = useState(false);
  const [hasUsedFreePlan, setHasUsedFreePlan] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchPlanStatus = async () => {
      try {
        
        const subRes = await axios.get("http://localhost:8000/api/plans/my-subscription", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (subRes.data && subRes.data.active) {
          setCurrentPlanId(subRes.data.plan_id);
          setHasPlan(true);
        }
      } catch (error) {
        console.warn("No current plan or error fetching subscription.");
        setHasPlan(false);
      }

      try {
        
        const freeRes = await axios.get("http://localhost:8000/api/plans/allow-free-plan", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (freeRes.data.allowed === false) {
          setHasUsedFreePlan(true); 
        }
      } catch (error) {
        
        setHasUsedFreePlan(true);
      }
    };

    fetchPlanStatus();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <PricingHeader />
      <div className="max-w-7xl mx-auto px-6 py-16">
        <HowItWorks />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => {
            let isDisabled = false;
            let isUpgrade = false;

           
            if (plan.id === 1 && hasUsedFreePlan) {
              isDisabled = true;
            }

            
            if (hasPlan) {
              if (plan.id === currentPlanId) {
                isDisabled = true;
              } else if (plan.id > currentPlanId) {
                isUpgrade = true;
              }
            }

            return (
              <PricingCard
                key={plan.id}
                title={plan.title}
                price={plan.price}
                fullPrice={plan.fullPrice}
                features={plan.features}
                planId={plan.id}
                isDisabled={isDisabled}
                isUpgrade={isUpgrade}
              />
            );
          })}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">*Billed as one payment</p>
        </div>
      </div>
    </div>
  );
}
