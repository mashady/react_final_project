"use client";
import { useState, useMemo, useCallback, useEffect } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useIntersection } from "../../../hooks/useIntersection";
import { useDebounce } from "../../../hooks/useDebounce";
import PropertyHeader from "./components/PropertyHeader";
import PropertyFilters from "./components/PropertyFilters";
import PropertyGrid from "./components/PropertyGrid";
import EmptyState from "./components/EmptyState";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorMessage from "./components/ErrorMessage";

const propertyService = {
  async fetchProperties({ pageParam = 1, filters = {}, pageSize = 10 }) {
    const params = new URLSearchParams({
      page: pageParam.toString(),
      per_page: pageSize.toString(),
    });

    // Enhanced filter parameter mapping
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        if (key === "priceRange" && Array.isArray(value)) {
          params.append("min_price", value[0].toString());
          params.append("max_price", value[1].toString());
        } else if (key === "number_of_beds" || key === "number_of_bathrooms") {
          // Ensure numeric values are properly formatted
          const numValue = parseInt(value);
          if (!isNaN(numValue) && numValue > 0) {
            params.append(key, numValue.toString());
          }
        } else if (key === "space") {
          // Handle space/area filtering
          const numValue = parseInt(value);
          if (!isNaN(numValue) && numValue > 0) {
            params.append("min_space", numValue.toString());
          }
        } else {
          // Handle text filters with trimming
          const trimmedValue = value.toString().trim();
          if (trimmedValue.length > 0) {
            params.append(key, trimmedValue);
          }
        }
      }
    });

    console.log("API Request:", `http://127.0.0.1:8000/api/ads?${params}`);

    const response = await fetch(`http://127.0.0.1:8000/api/ads?${params}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", response.status, errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("API Response:", data);
    return data;
  },
};

const useProperties = (filters) => {
  // Use shorter debounce for better responsiveness
  const debouncedFilters = useDebounce(filters, 500);
  const queryClient = useQueryClient();

  const query = useInfiniteQuery({
    queryKey: ["properties", debouncedFilters],
    queryFn: ({ pageParam }) =>
      propertyService.fetchProperties({
        pageParam,
        filters: debouncedFilters,
        pageSize: 10, // Consistent page size
      }),
    getNextPageParam: (lastPage, allPages) => {
      // Enhanced pagination logic
      if (!lastPage || !lastPage.data || lastPage.data.length === 0) {
        return undefined;
      }

      const isLastPage = lastPage.data.length < 10;
      if (isLastPage) {
        return undefined;
      }

      return allPages.length + 1;
    },
    initialPageParam: 1,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      // Only retry on network errors, not on 4xx/5xx HTTP errors
      if (error.message.includes("HTTP error!")) {
        return false;
      }
      return failureCount < 2;
    },
  });

  // Log query state for debugging
  useEffect(() => {
    console.log("Query State:", {
      isLoading: query.isLoading,
      isError: query.isError,
      error: query.error,
      dataLength:
        query.data?.pages?.flatMap((page) => page.data || []).length || 0,
      hasNextPage: query.hasNextPage,
    });
  }, [
    query.isLoading,
    query.isError,
    query.error,
    query.data,
    query.hasNextPage,
  ]);

  return query;
};

const PropertyList = () => {
  // Enhanced initial filter state
  const [filters, setFilters] = useState({
    title: "",
    description: "",
    type: "",
    area: "",
    street: "",
    block: "",
    number_of_beds: "",
    number_of_bathrooms: "",
    space: "",
    priceRange: [100, 10000],
  });

  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useProperties(filters);

  // Flatten all pages into a single array with error handling
  const properties = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => {
      if (page && page.data && Array.isArray(page.data)) {
        return page.data;
      }
      return [];
    });
  }, [data]);

  // Get total count from the first page
  const totalCount = data?.pages?.[0]?.total || properties.length;

  // Intersection observer for infinite scroll
  const { ref: sentinelRef } = useIntersection({
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) {
        console.log("Loading next page...");
        fetchNextPage();
      }
    },
    rootMargin: "200px", // Increased margin for earlier loading
  });

  // Enhanced filter change handler
  const handleFilterChange = useCallback((key, value) => {
    console.log("Filter changed:", key, value);
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value };
      console.log("New filters:", newFilters);
      return newFilters;
    });
  }, []);

  // Enhanced price range handler
  const handlePriceRangeChange = useCallback((newRange) => {
    console.log("Price range changed:", newRange);
    setFilters((prev) => ({ ...prev, priceRange: newRange }));
  }, []);

  // Enhanced reset handler
  const handleReset = useCallback(() => {
    console.log("Resetting filters");
    const resetFilters = {
      title: "",
      description: "",
      type: "",
      area: "",
      street: "",
      block: "",
      number_of_beds: "",
      number_of_bathrooms: "",
      space: "",
      priceRange: [100, 1000000],
    };

    setFilters(resetFilters);

    // Invalidate and refetch
    queryClient.invalidateQueries({ queryKey: ["properties"] });
  }, [queryClient]);

  // Enhanced search handler
  const handleSearch = useCallback(() => {
    console.log("Manual search triggered with filters:", filters);
    queryClient.invalidateQueries({ queryKey: ["properties"] });
  }, [queryClient, filters]);

  // Memoized utility functions
  const formatPrice = useCallback((price) => {
    if (!price || isNaN(price)) return "$0";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(parseFloat(price));
  }, []);

  const formatPriceShort = useCallback((price) => {
    if (!price || isNaN(price)) return "0";
    const numPrice = parseFloat(price);
    if (numPrice >= 1000000) return `${(numPrice / 1000000).toFixed(1)}M`;
    if (numPrice >= 1000) return `${(numPrice / 1000).toFixed(0)}K`;
    return numPrice.toString();
  }, []);

  const getPropertyImage = useCallback((property) => {
    if (property.primary_image) {
      if (property.primary_image.startsWith("http")) {
        return property.primary_image;
      }
      return `http://127.0.0.1:8000/storage/${property.primary_image}`;
    }
    return "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=400&h=300&fit=crop";
  }, []);

  // Enhanced unique values extraction
  const { uniqueTypes, uniqueLocations } = useMemo(() => {
    const types = new Set();
    const locations = new Set();

    properties.forEach((property) => {
      if (property.type && property.type.trim()) {
        types.add(property.type.trim());
      }
      if (property.area && property.area.trim()) {
        locations.add(property.area.trim());
      }
      // Also check location field as backup
      if (property.location && property.location.trim()) {
        const locationParts = property.location.split(",");
        if (locationParts[0] && locationParts[0].trim()) {
          locations.add(locationParts[0].trim());
        }
      }
    });

    return {
      uniqueTypes: Array.from(types).sort(),
      uniqueLocations: Array.from(locations).sort(),
    };
  }, [properties]);

  // Debug logging
  useEffect(() => {
    console.log(
      `Properties loaded: ${properties.length}, Total: ${totalCount}, Has next page: ${hasNextPage}, Unique types: ${uniqueTypes.length}, Unique locations: ${uniqueLocations.length}`
    );
  }, [
    properties.length,
    totalCount,
    hasNextPage,
    uniqueTypes.length,
    uniqueLocations.length,
  ]);

  // Handle error state
  if (isError) {
    console.error("Property list error:", error);
    return (
      <div className="min-h-screen p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <ErrorMessage
            error={error?.message || "Failed to load properties"}
            onRetry={() => refetch()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <PropertyHeader
          totalProperties={totalCount}
          error={null}
          isLoading={isLoading}
        />

        <PropertyFilters
          filters={filters}
          handleFilterChange={handleFilterChange}
          handlePriceRangeChange={handlePriceRangeChange}
          handleReset={handleReset}
          handleSearch={handleSearch}
          getUniqueTypes={() => uniqueTypes}
          getUniqueLocations={() => uniqueLocations}
          formatPriceShort={formatPriceShort}
          isLoading={isLoading}
        />

        {isLoading && properties.length === 0 ? (
          <div className="flex justify-center items-center py-16">
            <LoadingSpinner />
          </div>
        ) : properties.length > 0 ? (
          <>
            <PropertyGrid
              properties={properties}
              getPropertyImage={getPropertyImage}
              formatPrice={formatPrice}
            />

            {/* Infinite scroll sentinel */}
            {hasNextPage && (
              <div
                ref={sentinelRef}
                className="h-20 flex items-center justify-center mt-8"
              >
                {isFetchingNextPage ? (
                  <div className="flex items-center space-x-2">
                    <LoadingSpinner />
                    <span className="text-gray-500">
                      Loading more properties...
                    </span>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="animate-pulse h-2 w-32 bg-gray-200 rounded mb-2"></div>
                    <span className="text-gray-400 text-sm">
                      Scroll for more properties
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* End message */}
            {!hasNextPage && properties.length > 0 && (
              <div className="text-center py-8 text-gray-500 border-t border-gray-200 mt-8 bg-white rounded-lg">
                <p className="text-lg font-medium">
                  You've seen all {totalCount} matching properties
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  {properties.length === totalCount
                    ? `Showing all ${totalCount} properties`
                    : `Loaded ${properties.length} of ${totalCount} properties`}
                </p>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            hasActiveFilters={Object.values(filters).some(
              (val) =>
                val !== "" &&
                val !== null &&
                val !== undefined &&
                (Array.isArray(val) ? val[0] > 100 || val[1] < 1000000 : true)
            )}
            onClearFilters={handleReset}
          />
        )}
      </div>
    </div>
  );
};

export default PropertyList;
