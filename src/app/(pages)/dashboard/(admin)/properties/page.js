<<<<<<< HEAD
"use client";
import React, { useState, useEffect } from "react";
import { Plus, X, Save } from "lucide-react";
import PropertyCard from "@/components/shared/PropertyCard";
import PropertyList from "./PropertyList";
import PropertyModal from "./PropertyModal";
import PropertyViewModal from "./PropertyViewModal";
import axios from "axios";

const PropertyManagement = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [viewingProperty, setViewingProperty] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    type: "apartment",
    description: "",
    price: "",
    street: "",
    area: "",
    block: "",
    number_of_beds: 1,
    number_of_bathrooms: 1,
    space: "",
    media: [], // <-- ensure media is present for image upload
  });

  // Fetch properties from API
  const fetchProperties = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:8000/api/ads", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setProperties(response.data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingProperty
        ? `http://127.0.0.1:8000/api/ads/${editingProperty.id}`
        : "http://127.0.0.1:8000/api/ads";
      const method = editingProperty ? "put" : "post";
      const token = localStorage.getItem("token");
      // Use FormData for file uploads
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "media" && Array.isArray(value)) {
          value.forEach((file) => {
            if (file instanceof File) {
              form.append("media[]", file);
            }
          });
        } else {
          form.append(key, value);
        }
      });
      const response = await axios({
        url,
        method,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          // Let browser set Content-Type for FormData
        },
        data: form,
      });
      await fetchProperties();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property?"))
      return;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/ads/${id}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      await fetchProperties();
    } catch (err) {
      setError(err.message);
    }
  };

  // Open modal for editing/creating
  const openModal = (property = null) => {
    setEditingProperty(property);
    setFormData(
      property
        ? {
            title: property.title,
            type: property.type,
            description: property.description,
            price: property.price,
            street: property.street,
            area: property.area,
            block: property.block,
            number_of_beds: property.number_of_beds,
            number_of_bathrooms: property.number_of_bathrooms,
            space: property.space,
            media: [],
          }
        : {
            title: "",
            type: "apartment",
            description: "",
            price: "",
            street: "",
            area: "",
            block: "",
            number_of_beds: 1,
            number_of_bathrooms: 1,
            space: "",
            media: [],
          }
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProperty(null);
    setViewingProperty(null);
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: "bg-yellow-100 text-yellow-800",
      published: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          statusStyles[status] || statusStyles.pending
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-light text-slate-800 tracking-tight flex items-center gap-3">
                Property Management
              </h1>
              <p className="text-slate-600 mt-2 font-light">
                Manage all property listings in the system
              </p>
            </div>
            <div className="text-right">
              <button
                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 shadow-lg"
                onClick={() => openModal()}
              >
                <Plus className="w-5 h-5" /> Add Property
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
            {error}
          </div>
        )}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <PropertyList
            properties={properties}
            onEdit={openModal}
            onView={setViewingProperty}
            onDelete={handleDelete}
          />
        </div>
        <PropertyModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
          editingProperty={editingProperty}
        />
        <PropertyViewModal
          isOpen={!!viewingProperty}
          onClose={closeModal}
          property={viewingProperty}
          getStatusBadge={getStatusBadge}
        />
      </div>
    </div>
  );
};

export default PropertyManagement;
=======
>>>>>>> dd0da46772323ea4c4d3e56b4c74349150cb025c
