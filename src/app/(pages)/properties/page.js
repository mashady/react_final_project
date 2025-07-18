"use client";
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import PropertyHeader from "./components/PropertyHeader";
import PropertyFilters from "./components/PropertyFilters";
import PropertyGrid from "./components/PropertyGrid";
import EmptyState from "./components/EmptyState";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorMessage from "./components/ErrorMessage";

const textUtils = {
  normalizeForSearch: (text) => {
    if (!text || typeof text !== "string") return "";
    return text.trim().toLowerCase();
  },

  formatForDisplay: (text) => {
    if (!text || typeof text !== "string") return "";
    return text
      .trim()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  },

  matchesSearch: (text, searchTerm) => {
    if (!text || !searchTerm) return false;
    return textUtils
      .normalizeForSearch(text)
      .includes(textUtils.normalizeForSearch(searchTerm));
  },

  deduplicateByText: (items, textKey = null) => {
    const seen = new Map();
    return items.filter((item) => {
      const text = textKey ? item[textKey] : item;
      const normalized = textUtils.normalizeForSearch(text);
      if (seen.has(normalized)) {
        return false;
      }
      seen.set(normalized, true);
      return true;
    });
  },
};

const propertyService = {
  async fetchProperties({ pageParam = 1, filters = {}, pageSize = 6 }) {
    // Changed to consistent 6 items per page
    const params = new URLSearchParams({
      page: pageParam.toString(),
      per_page: pageSize.toString(),
    });

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        if (key === "priceRange" && Array.isArray(value)) {
          if (value[0] > 100) {
            params.append("min_price", value[0].toString());
          }
          if (value[1] < 10000) {
            params.append("max_price", value[1].toString());
          }
        } else if (key === "sortBy") {
          params.append("sort_by", value);
        } else if (key === "sortDir") {
          params.append("sort_dir", value);
        } else if (key === "number_of_beds" || key === "number_of_bathrooms") {
          const numValue = parseInt(value);
          if (!isNaN(numValue) && numValue > 0) {
            params.append(key, numValue.toString());
          }
        } else if (key === "space") {
          const numValue = parseInt(value);
          if (!isNaN(numValue)) {
            params.append("min_space", numValue.toString());
          }
        } else {
          const trimmedValue = value.toString().trim();
          if (trimmedValue.length > 0) {
            params.append(key, trimmedValue);
          }
        }
      }
    });

    const response = await fetch(`http://127.0.0.1:8000/api/ads?${params}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },
};

const useIntersection = ({ onIntersect, rootMargin }) => {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onIntersect();
        }
      },
      { rootMargin }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [onIntersect, rootMargin]);

  return { ref };
};

const useProperties = (filters) => {
  return useInfiniteQuery({
    queryKey: ["properties", filters],
    queryFn: ({ pageParam }) =>
      propertyService.fetchProperties({
        pageParam,
        filters,
        pageSize: 6, // Consistent with API call
      }),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage?.data || lastPage.data.length === 0) return undefined;
      return lastPage.data.length < 6 ? undefined : allPages.length + 1; // Matches pageSize
    },
    initialPageParam: 1,
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      if (error.message.includes("HTTP error!")) return false;
      return failureCount < 2;
    },
  });
};

const PropertyList = () => {
  const [localFilters, setLocalFilters] = useState({
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
    sortBy: "created_at",
    sortDir: "desc",
  });

  const [activeFilters, setActiveFilters] = useState({ ...localFilters });

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
    status,
    isFetching,
  } = useProperties(activeFilters);

  // Debugging logs
  useEffect(() => {
    console.log({
      status,
      isFetching,
      isFetchingNextPage,
      hasNextPage,
      pages: data?.pages?.length,
      lastPageLength: data?.pages?.[data.pages?.length - 1]?.data?.length,
    });
  }, [status, isFetching, isFetchingNextPage, hasNextPage, data]);

  const properties = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page?.data || []);
  }, [data]);

  const totalCount = data?.pages?.[0]?.total || properties.length;

  const { ref: sentinelRef } = useIntersection({
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage && !isFetching) {
        console.log("Fetching next page...");
        fetchNextPage();
      }
    },
    rootMargin: "400px", // Increased from 200px
  });

  const handleFilterChange = useCallback((key, value) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handlePriceRangeChange = useCallback((newRange) => {
    setLocalFilters((prev) => ({ ...prev, priceRange: newRange }));
  }, []);

  const handleSortChange = useCallback((sortBy, sortDir) => {
    setLocalFilters((prev) => ({
      ...prev,
      sortBy,
      sortDir,
    }));
  }, []);

  const handleSearch = useCallback(() => {
    setActiveFilters({ ...localFilters });
    queryClient.invalidateQueries({ queryKey: ["properties"] });
  }, [localFilters, queryClient]);

  const handleReset = useCallback(() => {
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
      priceRange: [100, 10000],
      sortBy: "created_at",
      sortDir: "desc",
    };
    setLocalFilters(resetFilters);
    setActiveFilters(resetFilters);
    queryClient.invalidateQueries({ queryKey: ["properties"] });
  }, [queryClient]);

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
    if (property.media?.length > 0) {
      const primaryMedia =
        property.media.find((m) => m.is_primary) || property.media[0];
      if (primaryMedia.file_path) {
        if (primaryMedia.file_path.startsWith("http")) {
          return primaryMedia.file_path;
        }
        return `http://127.0.0.1:8000/storage/${primaryMedia.file_path}`;
      }
    }

    if (property.primary_image) {
      if (property.primary_image.startsWith("http")) {
        return property.primary_image;
      }
      return `http://127.0.0.1:8000/storage/${property.primary_image}`;
    }

    return "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=400&h=300&fit=crop";
  }, []);

  const { uniqueTypes, uniqueLocations } = useMemo(() => {
    const typeValues = [];
    const locationValues = [];

    properties.forEach((property) => {
      if (property.type?.trim()) typeValues.push(property.type.trim());
      if (property.area?.trim()) locationValues.push(property.area.trim());
      if (property.location?.trim()) {
        const locationParts = property.location.split(",");
        if (locationParts[0]?.trim()) {
          locationValues.push(locationParts[0].trim());
        }
      }
    });

    const uniqueTypes = textUtils
      .deduplicateByText(typeValues)
      .map((type) => ({
        value: type,
        display: textUtils.formatForDisplay(type),
        original: type,
      }))
      .sort((a, b) => a.display.localeCompare(b.display));

    const uniqueLocations = textUtils
      .deduplicateByText(locationValues)
      .map((location) => ({
        value: location,
        display: textUtils.formatForDisplay(location),
        original: location,
      }))
      .sort((a, b) => a.display.localeCompare(b.display));

    return {
      uniqueTypes: uniqueTypes.map((t) => t.display),
      uniqueLocations: uniqueLocations.map((l) => l.display),
      typeOptions: uniqueTypes,
      locationOptions: uniqueLocations,
    };
  }, [properties]);

  const hasActiveFilters = useMemo(() => {
    return Object.entries(activeFilters).some(([key, value]) => {
      if (key === "sortBy" || key === "sortDir") return false;
      if (key === "priceRange") return value[0] > 100 || value[1] < 10000;
      return value !== "" && value !== null && value !== undefined;
    });
  }, [activeFilters]);

  if (isError) {
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
          filters={localFilters}
          handleFilterChange={handleFilterChange}
          handlePriceRangeChange={handlePriceRangeChange}
          handleSortChange={handleSortChange}
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

            <div
              ref={sentinelRef}
              className="h-20 flex items-center justify-center mt-8"
            >
              {isFetchingNextPage ? (
                <div className="flex items-center space-x-2">
                  <LoadingSpinner />
                </div>
              ) : hasNextPage ? (
                <div className="text-center">
                  <div className="animate-pulse h-2 w-32 bg-gray-200 rounded mb-2"></div>
                  <span className="text-gray-400 text-sm">
                    Scroll for more properties
                  </span>
                </div>
              ) : (
                <div className="text-gray-400 text-sm">
                  No more properties to load
                </div>
              )}
            </div>
          </>
        ) : (
          <EmptyState
            hasActiveFilters={hasActiveFilters}
            onClearFilters={handleReset}
          />
        )}
      </div>
    </div>
  );
};

export default PropertyList;
