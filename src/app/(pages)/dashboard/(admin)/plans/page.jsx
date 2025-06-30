"use client";
import React, { useState, useEffect } from "react";
import { Plus, Target } from "lucide-react";
import axios from "axios";
import PlanTable from "./PlanTable";
import PlanModal from "./PlanModal";
import ViewPlanModal from "./ViewPlanModal";
import DeletePlanModal from "./DeletePlanModal";
import LoadingSpinner from "@/app/(pages)/properties/components/LoadingSpinner";
import { useTranslation } from "../../../../../TranslationContext";
import Toast from "../../../property/[id]/components/Toast";

const PlanManagement = () => {
  const { t, locale } = useTranslation();
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

  const [toast, setToast] = useState({
    message: "",
    type: "",
    visible: false,
  });

  const showToast = (message, type) => {
    setToast({ message, type, visible: true });
  };

  const handleCloseToast = () => {
    setToast({ ...toast, visible: false });
  };

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
      showToast(t("planActionSuccess"), "success");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      showToast(err.message, "error");
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    setConfirmDelete(id);
  };
  
  const confirmDeletePlan = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showToast(t("Authentication token not found."), "error");
        return;
      }
  
      await axios.delete(`http://127.0.0.1:8000/api/plans/${confirmDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      showToast(t("Plan deleted successfully."), "success");
      await fetchPlans();
    } catch (err) {
      if (err.response?.status === 400) {
        showToast(t("Cannot delete plan with active subscriptions."), "error");
      } else {
        setError(err.message);
      }
    } finally {
      setConfirmDelete(null);
      showToast(err.message, "error");
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          {/* <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div> */}
          <LoadingSpinner />
          <span className="sr-only">{t("loadingPlans")}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {toast.visible && (
          <Toast
              message={toast.message}
              type={toast.type}
              onClose={handleCloseToast}
          />
      )}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="text-3xl text-black tracking-tight flex items-center gap-3"
                style={{ fontWeight: 400 }}
              >
                {t("plansManagementTitle")}
              </h1>
              <p className="text-[#555] mt-2 font-light">
                {t("plansManagementDescription")}
              </p>
            </div>
            <div className="text-right">
              <button
                className="bg-yellow-500 cursor-pointer hover:bg-yellow-600 text-black px-6 py-3 transition-all duration-300 flex items-center gap-2"
                onClick={() => openModal()}
              >
                <Plus className="w-5 h-5" /> {t("addPlanButton")}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
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

        {toast.visible && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={handleCloseToast}
          />
        )}
      </div>
    </div>
  );
};

export default PlanManagement;
