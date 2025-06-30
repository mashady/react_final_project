"use client";
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { Plus, X, Save } from "lucide-react";
import PropertyCard from "@/components/shared/PropertyCard";
import PropertyList from "./PropertyList";
import axios from "axios";
import LoadingSpinner from "@/app/(pages)/properties/components/LoadingSpinner";
import { useTranslation } from "../../../../../TranslationContext";
import Toast from "@/app/(pages)/property/[id]/components/Toast";
import { useIntersection } from "@/hooks/useIntersection";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import RequireAuth from "@/components/shared/RequireAuth";

const PAGE_SIZE = 3;

const fetchProperties = async ({ pageParam = 1 }) => {
  const token = localStorage.getItem("token");
  const params = new URLSearchParams({
    page: pageParam.toString(),
    per_page: PAGE_SIZE.toString(),
  });
  const response = await axios.get(`http://127.0.0.1:8000/api/ads?${params}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
};

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
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const queryClient = useQueryClient();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error: queryError,
    refetch,
    status,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["admin-properties"],
    queryFn: ({ pageParam }) => fetchProperties({ pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage?.data || lastPage.data.length === 0) return undefined;
      return lastPage.data.length < PAGE_SIZE ? undefined : allPages.length + 1;
    },
    initialPageParam: 1,
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      if (error.message && error.message.includes("HTTP error!")) return false;
      return failureCount < 2;
    },
  });

  const propertiesData = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page?.data || []);
  }, [data]);

  const { ref: sentinelRef } = useIntersection({
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage && !isFetching) {
        fetchNextPage();
      }
    },
    rootMargin: "200px",
  });

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [propertiesData.length]);

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

      await refetch();
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
      await refetch();
      showToast(
        t("propertyDeletedSuccess") + " The property was deleted successfully!",
        "success"
      );
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

  if (isLoading) {
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
            properties={propertiesData}
            onEdit={openModal}
            onDelete={handleDelete}
            getStatusBadge={getStatusBadge}
            t={t}
          />
          {/* Lazy loading sentinel and loading indicator */}
          {hasNextPage && (
            <div ref={sentinelRef} className="flex justify-center mt-10">
              <div className="flex items-center space-x-2">
                <LoadingSpinner />
                <span className="text-gray-500">{t("loadingMore")}</span>
              </div>
            </div>
          )}
        </div>
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

const PropertyManagementPage = () => (
  <RequireAuth allowedRoles={["admin"]}>
    <PropertyManagement />
  </RequireAuth>
);

export default PropertyManagementPage;
