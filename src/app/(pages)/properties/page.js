"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import PropertyHeader from "./components/PropertyHeader";
import PropertyFilters from "./components/PropertyFilters";
import PropertyGrid from "./components/PropertyGrid";
import EmptyState from "./components/EmptyState";
import LoadingSpinner from "./components/LoadingSpinner";
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
      if (!data.data || data.data.length === 0) {
        setHasMore(false);
        return;
      }
      setProperties((prevProperties) => {
        if (pageNum === 1) {
          return data.data;
        }
        // Merge and remove duplicates by id
        const merged = [...prevProperties, ...data.data];
        const unique = Array.from(new Map(merged.map(item => [item.id, item])).values());
        return unique;
      });
    } catch (error) {
      setError(error.message || "Failed to load properties");
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
<<<<<<< HEAD
      .map((p) => (p && p.location ? p.location.split(",")[0] : null))
      .filter((loc) => loc !== null && loc !== undefined && loc !== "");
=======
      .filter((p) => p.location) // Filter out properties with no location
      .map((p) => p.location.split(",")[0]);
>>>>>>> 7d213106f70e916562e324ca0574959227e1d282
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

  const observer = useRef();
  const sentinelRef = useCallback(
    (node) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new window.IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => {
            const nextPage = prevPage + 1;
            fetchProperties(nextPage);
            return nextPage;
          });
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

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

<<<<<<< HEAD
            <div className="relative">
              <select
                className="w-full p-2 pr-8 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-700 appearance-none cursor-pointer"
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
              >
                <option value="">All Locations</option>
                {getUniqueLocations().map((location, index) => (
                  <option key={index} value={location}>
                    {location}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
=======
        {error && !loading && <ErrorMessage error={error} />}
>>>>>>> 7d213106f70e916562e324ca0574959227e1d282

        {!loading && (
          <>
<<<<<<< HEAD
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredProperties.map((property) => (
                <Card
                  key={property.id}
                  className="cursor-pointer hover:shadow-md transition-all overflow-hidden border-none shadow-sm"
                >
                  {/* Property Image */}
                  <div className="relative h-48 bg-gray-200">
                    <img
                      src={getPropertyImage(property)}
                      alt={property.title}
                      className="w-full h-full object-cover rounded-t-lg"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=400&h=300&fit=crop";
                      }}
                    />
                  </div>

                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-gray-500 mb-1">
                      {property.type.toUpperCase()} -{" "}
                      {property.location ? property.location.split(",")[0] : ""}
                    </div>

                    {/* Title */}
                    <CardTitle className="text-lg font-bold mb-2">
                      {property.title}
                    </CardTitle>

                    {/* Description */}
                    <CardDescription className="text-gray-600 mb-4">
                      {property.description}
                    </CardDescription>

                    {/* Price */}
                    <div className="text-xl font-bold text-gray-900">
                      {formatPrice(property.price)}
                    </div>

                    {/* Area */}
                    {property.space && (
                      <div className="text-sm text-gray-500 mt-2">
                        {property.space}m²
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {filteredProperties.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Home className="w-16 h-16 mx-auto mb-4" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No properties found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your filters or search criteria
                </p>
              </div>
=======
            {filteredProperties.length > 0 ? (
              <PropertyGrid
                properties={filteredProperties}
                getPropertyImage={getPropertyImage}
                formatPrice={formatPrice}
              />
            ) : (
              <EmptyState />
>>>>>>> 7d213106f70e916562e324ca0574959227e1d282
            )}

            {filteredProperties.length > 0 && hasMore && (
              <div ref={sentinelRef} style={{ height: 40 }} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PropertyList;
