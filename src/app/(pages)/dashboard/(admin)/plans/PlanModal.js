import React, { useState, useEffect } from "react";
import { X, Save } from "lucide-react";

const validate = (formData) => {
  const errors = {};
  if (!formData.name.trim()) errors.name = "Plan name is required";
  if (!formData.price || isNaN(formData.price) || Number(formData.price) < 0)
    errors.price = "Valid price is required";
  if (
    !formData.duration ||
    isNaN(formData.duration) ||
    Number(formData.duration) <= 0
  )
    errors.duration = "Duration must be a positive number";
  if (!formData.billing_interval)
    errors.billing_interval = "Billing interval is required";
  if (
    !formData.ads_Limit ||
    isNaN(formData.ads_Limit) ||
    Number(formData.ads_Limit) < 0
  )
    errors.ads_Limit = "Valid ads limit is required";
  return errors;
};

export default function PlanModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  editingPlan,
}) {
  const [errors, setErrors] = useState({});

  // Clear errors when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    onSubmit(e);
  };

  // Clear specific error when user starts typing/correcting
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    
    // Clear the error for this field if it exists
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-semibold text-gray-900">
            {editingPlan ? "Edit Plan" : "Create New Plan"}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6" noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plan Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price *
              </label>
              <input
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                  errors.price ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (days) *
              </label>
              <input
                type="number"
                min="1"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                  errors.duration ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.duration && (
                <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Billing Interval *
              </label>
              <select
                value={formData.billing_interval}
                onChange={(e) => handleInputChange('billing_interval', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                  errors.billing_interval ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select billing interval</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="weekly">Weekly</option>
                <option value="daily">Daily</option>
              </select>
              {errors.billing_interval && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.billing_interval}
                </p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ads Limit *
              </label>
              <input
                type="number"
                min="0"
                value={formData.ads_Limit}
                onChange={(e) => handleInputChange('ads_Limit', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                  errors.ads_Limit ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.ads_Limit && (
                <p className="mt-1 text-sm text-red-600">{errors.ads_Limit}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Features
              </label>
              <textarea
                value={formData.features}
                onChange={(e) => handleInputChange('features', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="List the plan features and benefits..."
              />
            </div>
          </div>
          <div className="flex items-center justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              {editingPlan ? "Update Plan" : "Create Plan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}