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
  async fetchProperties({ pageParam = 1, filters = {}, pageSize = 5 }) {
    const params = new URLSearchParams({
      page: pageParam.toString(),
      per_page: pageSize.toString(),
    });

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        if (key === "priceRange" && Array.isArray(value)) {
          if (value[0] > 100) params.append("min_price", value[0].toString());
          if (value[1] < 1000000)
            params.append("max_price", value[1].toString());
        } else {
          params.append(key, value.toString());
        }
      }
    });

    const response = await fetch(`http://127.0.0.1:8000/api/ads?${params}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },
};

const useProperties = (filters) => {
  const debouncedFilters = useDebounce(filters, 300);
  const queryClient = useQueryClient();

  const query = useInfiniteQuery({
    queryKey: ["properties", debouncedFilters],
    queryFn: ({ pageParam }) =>
      propertyService.fetchProperties({
        pageParam,
        filters: debouncedFilters,
        pageSize: pageParam === 1 ? 5 : 10, // First page: 5 items, subsequent pages: 10 items
      }),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.data || lastPage.data.length === 0) return undefined;

      const expectedPageSize = allPages.length === 1 ? 5 : 10;
      if (lastPage.data.length < expectedPageSize) return undefined;

      return allPages.length + 1;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (updated from cacheTime)
    refetchOnWindowFocus: false,
    retry: 2,
  });

  useEffect(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      const nextPage = query.data?.pages?.length
        ? query.data.pages.length + 1
        : 1;
      queryClient.prefetchInfiniteQuery({
        queryKey: ["properties", debouncedFilters],
        queryFn: () =>
          propertyService.fetchProperties({
            pageParam: nextPage,
            filters: debouncedFilters,
            pageSize: nextPage === 1 ? 5 : 10,
          }),
        pages: 1,
      });
    }
  }, [
    query.data?.pages?.length,
    query.hasNextPage,
    query.isFetchingNextPage,
    debouncedFilters,
    queryClient,
  ]);

  return query;
};

const useVirtualScrolling = (
  items,
  itemHeight = 300,
  containerHeight = 800
) => {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 2,
      items.length
    );

    return {
      startIndex: Math.max(0, startIndex - 1),
      endIndex,
      visibleItems: items.slice(startIndex, endIndex),
      totalHeight: items.length * itemHeight,
      offsetY: startIndex * itemHeight,
    };
  }, [items, itemHeight, containerHeight, scrollTop]);

  return { visibleItems, setScrollTop };
};

const PropertyList = () => {
  const [filters, setFilters] = useState({
    type: "",
    category: "",
    location: "",
    bedrooms: "",
    bathrooms: "",
    priceRange: [0, 10000],
    minArea: "",
    maxArea: "",
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

  // Flatten all pages into a single array
  const properties = useMemo(() => {
    return data?.pages?.flatMap((page) => page.data) || [];
  }, [data]);

  // Get total count from the first page
  const totalCount = data?.pages?.[0]?.total || properties.length;

  // Intersection observer for infinite scroll
  const { ref: sentinelRef } = useIntersection({
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    rootMargin: "100px", // Trigger loading when sentinel is 100px away from viewport
  });

  // Virtual scrolling (optional - for very large lists)
  const { visibleItems } = useVirtualScrolling(properties);

  // Optimized handlers
  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handlePriceRangeChange = useCallback((newRange) => {
    setFilters((prev) => ({ ...prev, priceRange: newRange }));
  }, []);

  const handleReset = useCallback(() => {
    setFilters({
      type: "",
      category: "",
      location: "",
      bedrooms: "",
      bathrooms: "",
      priceRange: [100, 1000000],
      minArea: "",
      maxArea: "",
    });
    queryClient.invalidateQueries({ queryKey: ["properties"] });
  }, [queryClient]);

  const handleSearch = useCallback(() => {
    refetch();
  }, [refetch]);

  // Memoized utility functions
  const formatPrice = useCallback((price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(parseFloat(price));
  }, []);

  const formatPriceShort = useCallback((price) => {
    if (price >= 1000000) return `${(price / 1000000).toFixed(1)}M`;
    if (price >= 1000) return `${(price / 1000).toFixed(0)}K`;
    return price.toString();
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

  // Memoized unique values
  const { uniqueTypes, uniqueLocations } = useMemo(() => {
    const types = new Set();
    const locations = new Set();

    properties.forEach((property) => {
      if (property.type) types.add(property.type);
      if (property.location) {
        locations.add(property.location.split(",")[0]);
      }
    });

    return {
      uniqueTypes: Array.from(types),
      uniqueLocations: Array.from(locations),
    };
  }, [properties]);

  // Debug log to see how many properties are loaded
  useEffect(() => {
    console.log(
      `Properties loaded: ${properties.length}, Has next page: ${hasNextPage}`
    );
  }, [properties.length, hasNextPage]);

  // if (isLoading) return <LoadingSpinner />;
  if (isError)
    return (
      <ErrorMessage error={error?.message || "Failed to load properties"} />
    );

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <PropertyHeader totalProperties={totalCount} error={null} />

        <PropertyFilters
          filters={filters}
          handleFilterChange={handleFilterChange}
          handlePriceRangeChange={handlePriceRangeChange}
          handleReset={handleReset}
          handleSearch={handleSearch}
          getUniqueTypes={() => uniqueTypes}
          getUniqueLocations={() => uniqueLocations}
          formatPriceShort={formatPriceShort}
        />

        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <LoadingSpinner />
          </div>
        ) : properties.length > 0 ? (
          <>
            <PropertyGrid
              properties={properties} // Use visibleItems.visibleItems for virtual scrolling
              getPropertyImage={getPropertyImage}
              formatPrice={formatPrice}
            />

            {/* Infinite scroll sentinel - only show if there are more pages */}
            {hasNextPage && (
              <div
                ref={sentinelRef}
                className="h-20 flex items-center justify-center mt-8"
              >
                {isFetchingNextPage ? (
                  <div className="flex items-center space-x-2">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="animate-pulse h-2 w-32 bg-gray-200 rounded mb-2"></div>
                    <span className="text-gray-400 text-sm">
                      Scroll for more
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* End message when all properties are loaded */}
            {!hasNextPage && properties.length > 5 && (
              <div className="text-center py-8 text-gray-500 border-t border-gray-200 mt-8">
                <p className="text-lg font-medium">
                  You've seen all {totalCount} properties
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Started with 5, loaded {properties.length} total
                </p>
              </div>
            )}
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

export default PropertyList;
