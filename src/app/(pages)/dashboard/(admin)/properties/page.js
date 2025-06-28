"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Plus, X, Save } from "lucide-react";
import PropertyCard from "@/components/shared/PropertyCard";
import PropertyList from "./PropertyList";
import axios from "axios";
import LoadingSpinner from "@/app/(pages)/properties/components/LoadingSpinner";
import { useTranslation } from "../../../../../TranslationContext";
import Toast from "@/app/(pages)/property/[id]/components/Toast";

const PropertyManagement = () => {
  const { t, locale } = useTranslation();
  const [toast, setToast] = useState({ message: "", type: "", visible: false });
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
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
    media: [],
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:8000/api/ads", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setProperties(response.data.data || []);
    } catch (err) {
      setError(err.message || t("fetchPropertiesError"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingProperty
        ? `http://127.0.0.1:8000/api/ads/${editingProperty.id}`
        : "http://127.0.0.1:8000/api/ads";
      const method = editingProperty ? "put" : "post";
      const token = localStorage.getItem("token");

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

      await axios({
        url,
        method,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        data: form,
      });

      await fetchProperties();
      closeModal();
      showToast(t("propertyActionSuccess"), "success");
    } catch (err) {
      setError(err.response?.data?.message || err.message || t("submitError"));
      showToast(
        err.response?.data?.message || err.message || t("submitError"),
        "error"
      );
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
      await axios.delete(`http://127.0.0.1:8000/api/ads/${propertyToDelete}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      await fetchProperties();
      showToast(t("propertyDeletedSuccess"), "success");
    } catch (err) {
      setError(err.response?.data?.message || err.message || t("deleteError"));
      showToast(
        err.response?.data?.message || err.message || t("deleteError"),
        "error"
      );
    } finally {
      setShowDeleteModal(false);
      setPropertyToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setPropertyToDelete(null);
  };

  const openModal = (property = null) => {
    setEditingProperty(property);
    setFormData(
      property
        ? {
            ...property,
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
  };

  const getStatusBadge = (status) => {
    const statusText = {
      pending: t("pendingStatus"),
      published: t("publishedStatus"),
      rejected: t("rejectedStatus"),
    };

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
        {statusText[status] || status}
      </span>
    );
  };

  const showToast = (message, type) => {
    setToast({ message, type, visible: true });
  };

  const handleCloseToast = () => {
    setToast({ ...toast, visible: false });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <span className="sr-only">{t("loadingProperties")}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen " dir={locale === "ar" ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white">
          <PropertyList
            properties={properties}
            onEdit={openModal}
            onDelete={handleDelete}
            getStatusBadge={getStatusBadge}
            t={t}
          />
        </div>

        <PropertyModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
          editingProperty={editingProperty}
          t={t}
        />

        <ConfirmDialog
          open={showDeleteModal}
          message={t("confirmDeletePropertyMessage")}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          t={t}
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

export default PropertyManagement;
