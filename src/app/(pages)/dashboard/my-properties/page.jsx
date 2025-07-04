"use client";

import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import PropertyCard from "@/components/shared/PropertyCard";
import DashboardEmptyMsg from "@/components/dashboard/DashboardEmptyMsg";
import React, { useEffect, useState, useRef } from "react";
import api from "../../../../api/axiosConfig";
import LoadingSpinner from "../../properties/components/LoadingSpinner";
import RequireAuth from "@/components/shared/RequireAuth";
import { useIntersection } from "@/hooks/useIntersection";
import { useTranslation } from "../../../../TranslationContext";

const PAGE_SIZE = 3;

const MyPropertiesContent = () => {
  const [properties, setProperties] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const isFetching = useRef(false);
  const { t } = useTranslation();

  const fetchProperties = async (pageNumber) => {
    if (isFetching.current) return;

    isFetching.current = true;
    try {
      const response = await api.get("/myProperties", {
        params: { page: pageNumber, per_page: PAGE_SIZE },
      });

      const newProperties = response.data.data;
      const meta = response.data.meta;

      setProperties((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const uniqueNew = newProperties.filter((p) => !existingIds.has(p.id));
        return [...prev, ...uniqueNew];
      });

      setHasMore(meta.current_page < meta.last_page);
      setPage(meta.current_page + 1);
    } catch (err) {
      setError(err.message || t("failedToFetchProperties"));
      console.error("Error fetching properties:", err);
    } finally {
      isFetching.current = false;
      setInitialLoading(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties(1);
  }, []);

  const { ref: sentinelRef } = useIntersection({
    onIntersect: () => {
      if (hasMore && !loading) {
        setLoading(true);
        fetchProperties(page);
      }
    },
    rootMargin: "200px",
  });

  const handleCardClick = (property) => {
    console.log("Property clicked:", property);
  };

  if (initialLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
        >
          {t("retryButton")}
        </button>
      </div>
    );
  }

  return (
    <div>
      {properties.length > 0 ? (
        <>
          <DashboardPageHeader
            title={t("dashboardMyPropertiesHeader")}
            description={t("dashboardMyPropertiesDescription")}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property, index) => (
              <PropertyCard
                key={property.id}
                property={property}
                onClick={() => handleCardClick(property)}
                isDashboard={true}
                onDelete={(id) =>
                  setProperties((prev) => prev.filter((p) => p.id !== id))
                }
              />
            ))}
          </div>

          {hasMore && (
            <div ref={sentinelRef} className="flex justify-center mt-10">
              <div className="flex items-center space-x-2">
                <LoadingSpinner />
                <span className="text-gray-500">{t("loadingMore")}</span>
              </div>
            </div>
          )}
        </>
      ) : (
        <DashboardEmptyMsg
          msg={t("noPropertiesAdded")}
          btn={t("addPropertyButton")}
          link="/dashboard/add-property"
        />
      )}
    </div>
  );
};

const MyPropertiesPage = () => (
  <RequireAuth allowedRoles={["owner"]}>
    <MyPropertiesContent />
  </RequireAuth>
);

export default MyPropertiesPage;
