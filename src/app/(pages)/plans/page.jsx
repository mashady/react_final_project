"use client";
import React, { useEffect, useState } from "react";
import PricingHeader from "./components/PricingHeader";
import HowItWorks from "./components/HowItWorks";
import PricingCard from "./components/PricingCard";
import axios from "axios";
import LoadingSpinner from "../properties/components/LoadingSpinner";
import { useTranslation } from "@/TranslationContext";

export default function PricingPage() {
  const { t } = useTranslation();
  const [plans, setPlans] = useState([]);
  const [currentPlanId, setCurrentPlanId] = useState(null);
  const [hasPlan, setHasPlan] = useState(false);
  const [hasUsedFreePlan, setHasUsedFreePlan] = useState(false);
  const [isFreePlanStatusFetched, setIsFreePlanStatusFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPlans = async () => {
    try {
      const plansRes = await axios.get("http://127.0.0.1:8000/api/plans");
      setPlans(plansRes.data);
    } catch (error) {
      console.warn("Error fetching public plans:", error);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Not logged in: skip checks but show plans
      fetchPlans();
      setIsFreePlanStatusFetched(true);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch all plans
        const plansRes = await axios.get("http://127.0.0.1:8000/api/plans", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPlans(plansRes.data);

        // Fetch user's current subscription
        const subRes = await axios.get("http://127.0.0.1:8000/api/plans/my-subscription", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (subRes.data && subRes.data.active) {
          setCurrentPlanId(subRes.data.plan_id);
          setHasPlan(true);
        }

        // Check if user already used the free plan
        try {
          await axios.get("http://127.0.0.1:8000/api/plans/allow-free-plan", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setHasUsedFreePlan(false); // allowed
        } catch (error) {
          if (error.response?.status === 403) {
            setHasUsedFreePlan(true); // already used
          }
        }

      } catch (error) {
        console.warn("Error loading plans or subscription:", error);
        setHasPlan(false);
      } finally {
        setIsFreePlanStatusFetched(true);
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

            // Free plan logic
            if (plan.id === 1 && hasUsedFreePlan) {
              isDisabled = true;
            }

            // Current or upgrade plan logic
            if (hasPlan) {
              if (plan.id === currentPlanId) {
                isDisabled = true;
              } else if (plan.id > currentPlanId) {
                isUpgrade = true;
              }
            }

            const features = plan.features
              ? plan.features.split("\n").filter(Boolean)
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
                hasUsedFreePlan={hasUsedFreePlan}
                isFreePlanStatusFetched={isFreePlanStatusFetched}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
