"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Home,
  Square,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Bed,
  Bath,
  Car,
  Heart,
  Share2,
} from "lucide-react";
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
    status: "",
  });

  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });

  // Fetch properties from API
  const fetchProperties = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/ads?page=${page}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setProperties(data.data);
      setPagination({
        current_page: data.meta.current_page,
        last_page: data.meta.last_page,
        per_page: data.meta.per_page,
        total: data.meta.total,
      });
    } catch (error) {
      console.error("Error fetching properties:", error);
      setError(error.message);

      // Fallback to mock data if API fails
      const mockData = [
        {
          id: 1,
          title: "Gardenia House",
          type: "villas",
          description:
            "Lorem ipsum dolor sit amet, wisi nemore fastidii at vis, eos equidem admodum",
          price: "265000",
          location: "Brooklyn, NY",
          space: "160",
          status: "published",
          primary_image:
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
        },
        {
          id: 2,
          title: "Wooden Bungalow",
          type: "villas",
          description:
            "Lorem ipsum dolor sit amet, wisi nemore fastidii at vis, eos equidem admodum",
          price: "89000",
          location: "The Bronx, NY",
          space: "120",
          status: "published",
          primary_image:
            "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=300&fit=crop",
        },
        {
          id: 3,
          title: "Balcony Apartment",
          type: "apartments",
          description:
            "Lorem ipsum dolor sit amet, wisi nemore fastidii at vis, eos equidem admodum",
          price: "1200",
          location: "The Bronx, NY",
          space: "75",
          status: "published",
          primary_image:
            "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=300&fit=crop",
        },
      ];

      setProperties(mockData);
      setPagination({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: mockData.length,
      });
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
        (property) => property.type.toLowerCase() === filters.type.toLowerCase()
      );
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter((property) =>
        property.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(
        (property) =>
          property.status.toLowerCase() === filters.status.toLowerCase()
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
      const price = parseFloat(property.price);
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Area filters
    if (filters.minArea) {
      filtered = filtered.filter(
        (property) => parseFloat(property.space) >= parseFloat(filters.minArea)
      );
    }

    if (filters.maxArea) {
      filtered = filtered.filter(
        (property) => parseFloat(property.space) <= parseFloat(filters.maxArea)
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
    applyFilters();
  };

  const handlePageChange = (page) => {
    fetchProperties(page);
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
      status: "",
    });
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

  // Get unique locations from properties
  const getUniqueLocations = () => {
    const locations = properties
      .map((p) => (p && p.location ? p.location.split(",")[0] : null))
      .filter((loc) => loc !== null && loc !== undefined && loc !== "");
    return [...new Set(locations)];
  };

  // Get unique types from properties
  const getUniqueTypes = () => {
    const types = properties.map((p) => p.type);
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

  // Apply filters whenever filters change
  useEffect(() => {
    if (properties.length > 0) {
      applyFilters();
    }
  }, [properties, filters]);

  // Set initial filtered properties
  useEffect(() => {
    setFilteredProperties(properties);
  }, [properties]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Property Listings
          </h1>
          <p className="text-gray-600 mt-2">
            Found {filteredProperties.length} properties
            {error && (
              <span className="text-red-500 ml-2">
                (Using demo data - API connection failed)
              </span>
            )}
          </p>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
          {/* Top Row Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div className="relative">
              <select
                className="w-full p-2 pr-8 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-700 appearance-none cursor-pointer"
                value={filters.type}
                onChange={(e) => handleFilterChange("type", e.target.value)}
              >
                <option value="">All Types</option>
                {getUniqueTypes().map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
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

            <div className="relative">
              <select
                className="w-full p-2 pr-8 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-700 appearance-none cursor-pointer"
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                <option value="">All Status</option>
                <option value="published">Published</option>
                <option value="pending">Pending</option>
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

          {/* Second Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Min Bedrooms
              </label>
              <input
                type="number"
                placeholder="Any"
                className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                value={filters.bedrooms}
                onChange={(e) => handleFilterChange("bedrooms", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Min Bathrooms
              </label>
              <input
                type="number"
                placeholder="Any"
                className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                value={filters.bathrooms}
                onChange={(e) =>
                  handleFilterChange("bathrooms", e.target.value)
                }
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Price range (USD)
              </label>
              <div className="px-1">
                <div className="flex justify-between text-xs text-gray-500 mb-3">
                  <span>{formatPriceShort(filters.priceRange[0])}</span>
                  <span>{formatPriceShort(filters.priceRange[1])}</span>
                </div>
                <Slider
                  value={filters.priceRange}
                  onValueChange={handlePriceRangeChange}
                  max={1000000}
                  min={100}
                  step={1000}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Third Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Min area (m²)
              </label>
              <input
                type="number"
                placeholder="Any"
                className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                value={filters.minArea}
                onChange={(e) => handleFilterChange("minArea", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Max area (m²)
              </label>
              <input
                type="number"
                placeholder="Any"
                className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                value={filters.maxArea}
                onChange={(e) => handleFilterChange("maxArea", e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleReset}
                className="w-full p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex justify-center items-center gap-1 text-sm"
              >
                <SlidersHorizontal className="w-4 h-4 text-gray-600" />
                Reset
              </button>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleSearch}
                className="w-full p-2 bg-[#FFCC41] hover:bg-yellow-500 text-gray-900 text-sm font-medium rounded-lg flex items-center justify-center gap-1 transition-colors"
              >
                <Search className="w-3 h-3" />
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="text-red-600 text-sm">
                <strong>API Connection Error:</strong> {error}
              </div>
            </div>
            <div className="text-red-500 text-xs mt-1">
              Showing demo data. Please check if the API server is running at
              http://127.0.0.1:8000
            </div>
          </div>
        )}

        {/* Properties Grid */}
        {!loading && (
          <>
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
            )}

            {/* Pagination */}
            {pagination.last_page > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <button
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                  disabled={pagination.current_page === 1}
                  className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="px-4 py-2 text-sm text-gray-600">
                  Page {pagination.current_page} of {pagination.last_page}
                </span>

                <button
                  onClick={() => handlePageChange(pagination.current_page + 1)}
                  disabled={pagination.current_page === pagination.last_page}
                  className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PropertyList;
