"use client";
import React, { useState, useEffect } from "react";
import { Plus, X, Save, Edit, Eye, Trash2, Calendar, DollarSign, Target, Clock } from "lucide-react";
import axios from "axios";

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
      monthly: "bg-blue-100 text-blue-800",
      yearly: "bg-purple-100 text-purple-800",
      weekly: "bg-green-100 text-green-800",
      daily: "bg-orange-100 text-orange-800",
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-light text-slate-800 tracking-tight flex items-center gap-3">
                <Target className="w-8 h-8 text-blue-600" />
                Plans Management
              </h1>
              <p className="text-slate-600 mt-2 font-light">
                Manage subscription plans and pricing
              </p>
            </div>
            <div className="text-right">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 shadow-lg"
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

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Plan Name</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Duration</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Billing</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Ads Limit</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Features</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {plans.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      <Target className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                      <p className="text-lg font-medium">No plans found</p>
                      <p className="text-sm">Create your first subscription plan to get started</p>
                    </td>
                  </tr>
                ) : (
                  plans.map((plan) => (
                    <tr key={plan.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{plan.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-gray-900">
                          <DollarSign className="w-4 h-4 mr-1" />
                          {plan.price}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-1" />
                          {plan.duration} days
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getBillingIntervalBadge(plan.billing_interval)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-900 font-medium">{plan.ads_Limit}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-600 max-w-xs truncate">
                          {plan.features}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => setViewingPlan(plan)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Plan"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openModal(plan)}
                            className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Edit Plan"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(plan.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Plan"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Plan Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {editingPlan ? "Edit Plan" : "Create New Plan"}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Plan Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (days) *
                    </label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Billing Interval *
                    </label>
                    <select
                      value={formData.billing_interval}
                      onChange={(e) => setFormData({ ...formData, billing_interval: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                      <option value="weekly">Weekly</option>
                      <option value="daily">Daily</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ads Limit *
                    </label>
                    <input
                      type="number"
                      value={formData.ads_Limit}
                      onChange={(e) => setFormData({ ...formData, ads_Limit: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Features
                    </label>
                    <textarea
                      value={formData.features}
                      onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="List the plan features and benefits..."
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    {editingPlan ? "Update Plan" : "Create Plan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Plan Modal */}
        {viewingPlan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-semibold text-gray-900">Plan Details</h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Plan Name</h3>
                    <p className="text-lg font-semibold text-gray-900">{viewingPlan.name}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Price</h3>
                    <p className="text-lg font-semibold text-green-600 flex items-center">
                      <DollarSign className="w-5 h-5 mr-1" />
                      {viewingPlan.price}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Duration</h3>
                    <p className="text-lg text-gray-900 flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-blue-500" />
                      {viewingPlan.duration} days
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Billing Interval</h3>
                    <div className="mt-1">
                      {getBillingIntervalBadge(viewingPlan.billing_interval)}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Ads Limit</h3>
                    <p className="text-lg font-semibold text-blue-600">{viewingPlan.ads_Limit}</p>
                  </div>
                </div>

                {viewingPlan.features && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Features</h3>
                    <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                      {viewingPlan.features}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-end pt-6 border-t space-x-4">
                  <button
                    onClick={() => {
                      setViewingPlan(null);
                      openModal(viewingPlan);
                    }}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Edit className="w-5 h-5" />
                    Edit Plan
                  </button>
                  <button
                    onClick={closeModal}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {confirmDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
              <div className="p-6">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                  Delete Plan
                </h3>
                
                <p className="text-gray-600 text-center mb-6">
                  Are you sure you want to delete this plan? This action cannot be undone and will permanently remove the plan from the system.
                </p>

                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={() => setConfirmDelete(null)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDeletePlan}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Plan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanManagement;