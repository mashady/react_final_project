"use client";
import React, { useState, useEffect } from "react";
import { Plus, X, Save } from "lucide-react";
import PropertyCard from "@/components/shared/PropertyCard";
import PropertyList from "./PropertyList";
import PropertyModal from "./PropertyModal";
import PropertyViewModal from "./PropertyViewModal";
import axios from "axios";
import LoadingSpinner from "@/app/(pages)/properties/components/LoadingSpinner";
import ConfirmDialog from "./ConfirmDialog";

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);

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

  const handleDelete = (id) => {
    setPropertyToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!propertyToDelete) return;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/ads/${propertyToDelete}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      if (response.status === 200 || response.status === 204) {
        await fetchProperties();
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setShowDeleteModal(false);
      setPropertyToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setPropertyToDelete(null);
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
    if (viewingProperty) {
      setViewingProperty(null);
    }
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
            {error}
          </div>
        )}
        <div className="bg-white overflow-hidden">
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
        <ConfirmDialog
          open={showDeleteModal}
          message="Are you sure you want to delete this property? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      </div>
    </div>
  );
};

export default PropertyManagement;
