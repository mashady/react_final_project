"use client";

import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import LoadMoreBtn from "@/components/shared/LoadMoreBtn";
import PropertyCard from "@/components/shared/PropertyCard";
import DashboardEmptyMsg from "@/components/dashboard/DashboardEmptyMsg";
import React, { useEffect, useState, useRef, useMemo } from "react";
import api from "../../../../api/axiosConfig";
import LoadingSpinner from "../../properties/components/LoadingSpinner";
import RequireAuth from "@/components/shared/RequireAuth"; // ✅ import the guard
import { useIntersection } from "@/hooks/useIntersection";

const PAGE_SIZE = 3;

const MyPropertiesContent = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const hasNextPage = properties.length > visibleCount;
  const isLoadingMore = useRef(false);

  // Intersection observer for lazy loading
  const { ref: sentinelRef } = useIntersection({
    onIntersect: () => {
      if (hasNextPage && !isLoadingMore.current) {
        isLoadingMore.current = true;
        setTimeout(() => {
          setVisibleCount((prev) => prev + PAGE_SIZE);
          isLoadingMore.current = false;
        }, 400);
      }
    },
    rootMargin: "200px",
  });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await api.get("/myProperties");
        const data = response.data.data;
        const propertiesArray = Array.isArray(data) ? data : [data];
        setProperties(propertiesArray);
      } catch (err) {
        setError(err.message || "Failed to fetch your properties");
        console.error("Error fetching properties:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [properties.length]);

  const visibleProperties = useMemo(
    () => properties.slice(0, visibleCount),
    [properties, visibleCount]
  );

  const handleCardClick = (property) => {
    console.log("Property clicked:", property);
  };

  if (loading) {
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
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {visibleProperties.length > 0 ? (
        <>
          <DashboardPageHeader
            title="My Properties"
            description="This page displays all the properties you have listed. Manage your properties, view details, and update your listings here."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleProperties.map((property, index) => (
              <PropertyCard
                key={index}
                property={property}
                onClick={() => handleCardClick(property)}
                className="hover:transform"
                isDashboard={true}
                onDelete={(id) => {
                  setProperties((prev) => prev.filter((p) => p.id !== id));
                }}
              />
            ))}
          </div>
          {/* Lazy loading sentinel and loading indicator */}
          {hasNextPage && (
            <div ref={sentinelRef} className="flex justify-center mt-10">
              <div className="flex items-center space-x-2">
                <LoadingSpinner />
              </div>
            </div>
          )}
        </>
      ) : (
        <DashboardEmptyMsg
          msg="You haven't added any property yet."
          btn="Add Property"
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
