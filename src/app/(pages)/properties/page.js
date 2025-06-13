"use client";
import { useState, useEffect } from "react";
import PropertyHeader from "./components/PropertyHeader";
import PropertyFilters from "./components/PropertyFilters";
import PropertyGrid from "./components/PropertyGrid";
import EmptyState from "./components/EmptyState";
import LoadingSpinner from "./components/LoadingSpinner";
import LoadMoreButton from "./components/LoadMoreButton";
import ErrorMessage from "./components/ErrorMessage";
import { Slider } from "@/components/ui/slider";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardContent,
  CardDescription,
  CardAction,
} from "@/components/ui/card";

const PropertyList = () => {
  const [filters, setFilters] = useState({
    type: "",
    category: "",
    location: "",
    bedrooms: "",
    bathrooms: "",
    priceRange: [100, 1000000],
    minArea: "",
    maxArea: "",
  });

  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch properties from API
  const fetchProperties = async (pageNum = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/ads?page=${pageNum}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Check if we have more data to load
      if (data.data.length === 0) {
        setHasMore(false);
        return;
      }

      setProperties((prevProperties) => {
        if (pageNum === 1) {
          return data.data;
        }
        // Merge new data with existing data
        return [...prevProperties, ...data.data];
      });
    } catch (error) {
      console.error("Error fetching properties:", error);
      setError(error.message);
      setProperties([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters to properties
  const applyFilters = () => {
    let filtered = [...properties];

    // Type filter
    if (filters.type) {
      filtered = filtered.filter(
        (property) =>
          property.type?.toLowerCase() === filters.type.toLowerCase()
      );
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter((property) =>
        property.location
          ?.toLowerCase()
          .includes(filters.location.toLowerCase())
      );
    }

    // Bedrooms filter
    if (filters.bedrooms) {
      filtered = filtered.filter((property) => {
        const bedrooms = property.bedrooms || 0;
        return bedrooms >= parseInt(filters.bedrooms);
      });
    }

    // Bathrooms filter
    if (filters.bathrooms) {
      filtered = filtered.filter((property) => {
        const bathrooms = property.bathrooms || 0;
        return bathrooms >= parseInt(filters.bathrooms);
      });
    }

    // Price range filter
    filtered = filtered.filter((property) => {
      const price = parseFloat(property.price || 0);
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Area filters
    if (filters.minArea) {
      filtered = filtered.filter(
        (property) =>
          parseFloat(property.space || 0) >= parseFloat(filters.minArea)
      );
    }

    if (filters.maxArea) {
      filtered = filtered.filter(
        (property) =>
          parseFloat(property.space || 0) <= parseFloat(filters.maxArea)
      );
    }

    setFilteredProperties(filtered);
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handlePriceRangeChange = (newRange) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: newRange,
    }));
  };
  const handleSearch = () => {
    setPage(1); // Reset to page 1 when searching
    fetchProperties(1);
  };

  const handleReset = () => {
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
    setPage(1);
    fetchProperties(1);
  };

  // Format price to match the image ($265,000)
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(parseFloat(price));
  };

  const formatPriceShort = (price) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `${(price / 1000).toFixed(0)}K`;
    }
    return price.toString();
  };

  const getUniqueLocations = () => {
    const locations = properties
      .filter((p) => p.location) // Filter out properties with no location
      .map((p) => p.location.split(",")[0]);
    return [...new Set(locations)];
  };

  // Get unique types from properties
  const getUniqueTypes = () => {
    const types = properties
      .filter((p) => p.type) // Filter out properties with no type
      .map((p) => p.type);
    return [...new Set(types)];
  };

  // Get property image with fallback
  const getPropertyImage = (property) => {
    if (property.primary_image) {
      if (property.primary_image.startsWith("http")) {
        return property.primary_image;
      }
      return `http://127.0.0.1:8000/storage/${property.primary_image}`;
    }
    return "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=400&h=300&fit=crop";
  };

  // Initialize component
  useEffect(() => {
    fetchProperties();
  }, []);

  // Apply filters when properties or filters change
  useEffect(() => {
    applyFilters();
  }, [properties, filters]);

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <PropertyHeader
          totalProperties={filteredProperties.length}
          error={error}
        />

        <PropertyFilters
          filters={filters}
          handleFilterChange={handleFilterChange}
          handlePriceRangeChange={handlePriceRangeChange}
          handleReset={handleReset}
          handleSearch={handleSearch}
          getUniqueTypes={getUniqueTypes}
          getUniqueLocations={getUniqueLocations}
          formatPriceShort={formatPriceShort}
        />

        {loading && !properties.length && <LoadingSpinner />}

        {error && !loading && <ErrorMessage error={error} />}

        {!loading && (
          <>
            {filteredProperties.length > 0 ? (
              <PropertyGrid
                properties={filteredProperties}
                getPropertyImage={getPropertyImage}
                formatPrice={formatPrice}
              />
            ) : (
              <EmptyState />
            )}

            {filteredProperties.length > 0 && hasMore && (
              <LoadMoreButton
                onClick={() => {
                  const nextPage = page + 1;
                  setPage(nextPage);
                  fetchProperties(nextPage);
                }}
                loading={loading}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PropertyList;
