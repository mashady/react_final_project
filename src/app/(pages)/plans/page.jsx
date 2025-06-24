"use client";
import React, { useEffect, useState } from "react";
import PricingHeader from "./components/PricingHeader";
import HowItWorks from "./components/HowItWorks";
import PricingCard from "./components/PricingCard";
import axios from "axios";
import LoadingSpinner from "../properties/components/LoadingSpinner";

export default function PricingPage() {
  const [plans, setPlans] = useState([]);
  const [currentPlanId, setCurrentPlanId] = useState(null);
  const [hasPlan, setHasPlan] = useState(false);
  const [hasUsedFreePlan, setHasUsedFreePlan] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch available plans
        const plansRes = await axios.get("http://127.0.0.1:8000/api/plans", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPlans(plansRes.data);

        // Fetch current subscription
        const subRes = await axios.get("http://127.0.0.1:8000/api/plans/my-subscription", {
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
        // Check if user can use free plan
        const freeRes = await axios.get("http://127.0.0.1:8000/api/plans/allow-free-plan", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (freeRes.data.allowed === false) {
          setHasUsedFreePlan(true);
        }
      } catch (error) {
        setHasUsedFreePlan(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <PricingHeader />
      <div className="max-w-[1500px] mx-auto px-6 py-16">
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

            const features = plan.features
              ? plan.features.split("\n").filter(Boolean) // if server sends multiline string
              : [`Up to ${plan.ads_Limit} ads`];

            return (
              <PricingCard
                key={plan.id}
                title={plan.name}
                price={plan.price}
                fullPrice={plan.fullPrice || plan.price * 2} 
                features={features}
                planId={plan.id}
                isDisabled={isDisabled}
                isUpgrade={isUpgrade}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
