"use client";
import React, { useState, useEffect } from "react";
import { Plus, Target } from "lucide-react";
import axios from "axios";
import PlanTable from "./PlanTable";
import PlanModal from "./PlanModal";
import ViewPlanModal from "./ViewPlanModal";
import DeletePlanModal from "./DeletePlanModal";

const PlanManagement = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [viewingPlan, setViewingPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    duration: "",
    billing_interval: "monthly",
    features: "",
    ads_Limit: "",
  });
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Fetch plans from API
  const fetchPlans = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:8000/api/plans", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setPlans(response.data.data || response.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingPlan
        ? `http://127.0.0.1:8000/api/plans/${editingPlan.id}`
        : "http://127.0.0.1:8000/api/plans";
      const method = editingPlan ? "put" : "post";
      const token = localStorage.getItem("token");

      const response = await axios({
        url,
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: {
          ...formData,
          price: parseFloat(formData.price),
          duration: parseInt(formData.duration),
          ads_Limit: parseInt(formData.ads_Limit),
        },
      });

      await fetchPlans();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    setConfirmDelete(id);
  };

  const confirmDeletePlan = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://127.0.0.1:8000/api/plans/${confirmDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchPlans();
      setConfirmDelete(null);
    } catch (err) {
      setError(err.message);
      setConfirmDelete(null);
    }
  };

  // Open modal for editing/creating
  const openModal = (plan = null) => {
    setEditingPlan(plan);
    setFormData(
      plan
        ? {
            name: plan.name,
            price: plan.price.toString(),
            duration: plan.duration.toString(),
            billing_interval: plan.billing_interval,
            features: plan.features,
            ads_Limit: plan.ads_Limit.toString(),
          }
        : {
            name: "",
            price: "",
            duration: "",
            billing_interval: "monthly",
            features: "",
            ads_Limit: "",
          }
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPlan(null);
    setViewingPlan(null);
    setConfirmDelete(null);
  };

  const getBillingIntervalBadge = (interval) => {
    const intervalStyles = {
      monthly: "bg-yellow-100 text-yellow-800",
      yearly: "bg-yellow-100 text-yellow-800",
      weekly: "bg-green-100 text-yellow-800",
      daily: "bg-yellow-100 text-yellow-800",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          intervalStyles[interval] || intervalStyles.monthly
        }`}
      >
        {interval.charAt(0).toUpperCase() + interval.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-indigo-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-light text-slate-800 tracking-tight flex items-center gap-3">
                <Target className="w-8 h-8 text-yellow-600" />
                Plans Management
              </h1>
              <p className="text-slate-600 mt-2 font-light">
                Manage subscription plans and pricing
              </p>
            </div>
            <div className="text-right">
              <button
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 shadow-lg"
                onClick={() => openModal()}
              >
                <Plus className="w-5 h-5" /> Add Plan
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 border border-red-200">
            {error}
          </div>
        )}

        <PlanTable
          plans={plans}
          onView={(plan) => setViewingPlan(plan)}
          onEdit={(plan) => openModal(plan)}
          onDelete={(id) => handleDelete(id)}
          getBillingIntervalBadge={getBillingIntervalBadge}
        />

        <PlanModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
          editingPlan={editingPlan}
        />

        <ViewPlanModal
          plan={viewingPlan}
          onClose={closeModal}
          onEdit={(plan) => {
            setViewingPlan(null);
            openModal(plan);
          }}
          getBillingIntervalBadge={getBillingIntervalBadge}
        />

        <DeletePlanModal
          open={!!confirmDelete}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={confirmDeletePlan}
        />
      </div>
    </div>
  );
};

export default PlanManagement;
