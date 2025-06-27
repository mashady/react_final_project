"use client";
import React, { useState } from "react";
import { Search, RefreshCcw, ArrowUpDown, ChevronDown, MapPin } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import Link from "next/link";

export default function PropertyFiltersWithSorting({
  filters = {
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
  },
  handleFilterChange = () => {},
  handlePriceRangeChange = () => {},
  handleSortChange = () => {},
  handleReset = () => {},
  handleSearch = () => {},
  getUniqueTypes = () => [],
  getUniqueLocations = () => [],
  formatPriceShort = (price) => price?.toString() || "0",
}) {
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const sortOptions = [
    {
      value: "created_at-desc",
      label: "Newest First",
      field: "created_at",
      direction: "desc",
    },
    {
      value: "created_at-asc",
      label: "Oldest First",
      field: "created_at",
      direction: "asc",
    },
    {
      value: "price-asc",
      label: "Price: Low to High",
      field: "price",
      direction: "asc",
    },
    {
      value: "price-desc",
      label: "Price: High to Low",
      field: "price",
      direction: "desc",
    },
    {
      value: "space-desc",
      label: "Space: Largest First",
      field: "space",
      direction: "desc",
    },
    {
      value: "space-asc",
      label: "Space: Smallest First",
      field: "space",
      direction: "asc",
    },
    {
      value: "number_of_beds-desc",
      label: "Most Bedrooms",
      field: "number_of_beds",
      direction: "desc",
    },
    {
      value: "number_of_beds-asc",
      label: "Least Bedrooms",
      field: "number_of_beds",
      direction: "asc",
    },
    {
      value: "number_of_bathrooms-desc",
      label: "Most Bathrooms",
      field: "number_of_bathrooms",
      direction: "desc",
    },
    {
      value: "number_of_bathrooms-asc",
      label: "Least Bathrooms",
      field: "number_of_bathrooms",
      direction: "asc",
    },
  ];

  const handleLocalChange = (key, value) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleLocalPriceRange = (range) => {
    setLocalFilters((prev) => ({ ...prev, priceRange: range }));
    if (handleFilterChange) handleFilterChange("priceRange", range);
    if (handlePriceRangeChange) handlePriceRangeChange(range);
  };

  const onSearch = () => {
    Object.entries(localFilters).forEach(([key, value]) => {
      handleFilterChange(key, value);
    });
    if (handlePriceRangeChange) handlePriceRangeChange(localFilters.priceRange);
    if (handleSearch) handleSearch();
  };

  const onReset = () => {
    setLocalFilters({
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
    handleReset();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  const handleSortSelect = (sortOption) => {
    if (handleSortChange) {
      handleSortChange(sortOption.field, sortOption.direction);
    }
    setShowSortDropdown(false);
  };

  const currentSortValue = `${localFilters.sortBy || "created_at"}-${
    localFilters.sortDir || "desc"
  }`;
  const currentSortLabel =
    sortOptions.find((option) => option.value === currentSortValue)?.label ||
    "Newest First";

  return (
    <div
      className="bg-[#fbfbfb] text-[#555] rounded p-6 md:p-6 mb-10"
      style={{ border: "1px solid #e8e8e8" }}
    >
      {/* Sort Section */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-700">Sort Properties</span>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="flex items-center justify-between w-full sm:w-64 px-4 py-2 text-sm border border-gray-300 bg-white text-gray-700 rounded hover:bg-gray-50 transition-colors"
          >
            <span>{currentSortLabel}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                showSortDropdown ? "rotate-180" : ""
              }`}
            />
          </button>

          {showSortDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-50 max-h-64 overflow-y-auto">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSortSelect(option)}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                    currentSortValue === option.value
                      ? "bg-yellow-50 text-yellow-800"
                      : "text-gray-700"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filter Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <input
          type="text"
          placeholder="Title"
          className="w-full h-[50px] pl-4 p-2 text-sm border border-gray-300 bg-white text-gray-700 rounded"
          value={localFilters.title || ""}
          onChange={(e) => handleLocalChange("title", e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <input
          type="text"
          placeholder="Description"
          className="w-full h-[50px] pl-4 p-2 text-sm border border-gray-300 bg-white text-gray-700 rounded"
          value={localFilters.description || ""}
          onChange={(e) => handleLocalChange("description", e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <select
          className="w-full h-[50px] pl-4 p-2 pr-8 text-sm border-1 focus:border-0 border-gray-300 bg-white text-gray-700 appearance-none cursor-pointer rounded"
          value={localFilters.type || ""}
          onChange={(e) => handleLocalChange("type", e.target.value)}
        >
          <option value="">All Types</option>
          <option value="apartment">Apartment</option>
          <option value="room">Room</option>
          <option value="bed">Bed</option>
          {getUniqueTypes &&
            getUniqueTypes()
              .filter((type) => {
                const lowerType = type.toLowerCase();
                return !["apartment", "room", "bed"].includes(lowerType);
              })
              .map((type) => (
                <option key={type} value={type.toLowerCase()}>
                  {type}
                </option>
              ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <input
          type="text"
          placeholder="Area"
          className="w-full h-[50px] pl-4 p-2 text-sm border border-gray-300 bg-white text-gray-700 rounded"
          value={localFilters.area || ""}
          onChange={(e) => handleLocalChange("area", e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <input
          type="text"
          placeholder="Street"
          className="w-full h-[50px] pl-4 p-2 text-sm border border-gray-300 bg-white text-gray-700 rounded"
          value={localFilters.street || ""}
          onChange={(e) => handleLocalChange("street", e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <input
          type="text"
          placeholder="Block"
          className="w-full h-[50px] pl-4 p-2 text-sm border border-gray-300 bg-white text-gray-700 rounded"
          value={localFilters.block || ""}
          onChange={(e) => handleLocalChange("block", e.target.value)}
          onKeyPress={handleKeyPress}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        <input
          type="number"
          placeholder="Number of bedrooms"
          className="w-full pl-4 p-2 text-sm border border-gray-300 bg-white placeholder:text-gray-700 h-[50px] rounded"
          value={localFilters.number_of_beds || ""}
          onChange={(e) => handleLocalChange("number_of_beds", e.target.value)}
          onKeyPress={handleKeyPress}
          min="0"
        />
        <input
          type="number"
          placeholder="Number of bathrooms"
          className="w-full pl-4 p-2 text-sm border border-gray-300 bg-white placeholder:text-gray-700 h-[50px] rounded"
          value={localFilters.number_of_bathrooms || ""}
          onChange={(e) =>
            handleLocalChange("number_of_bathrooms", e.target.value)
          }
          onKeyPress={handleKeyPress}
          min="0"
        />
        <input
          type="number"
          placeholder="Space (m²)"
          className="w-full pl-4 p-2 text-sm border border-gray-300 bg-white placeholder:text-gray-700 h-[50px] rounded"
          value={localFilters.space || ""}
          onChange={(e) => handleLocalChange("space", e.target.value)}
          onKeyPress={handleKeyPress}
          min="0"
        />
        <div className="md:col-span-1">
          <div className="px-1">
            <div className="flex justify-between text-xs text-gray-500 mb-3">
              <span>{formatPriceShort(localFilters.priceRange?.[0] || 0)}</span>
              <span>{formatPriceShort(localFilters.priceRange?.[1] || 0)}</span>
            </div>
            <Slider
              value={localFilters.priceRange}
              onValueChange={handleLocalPriceRange}
              max={10000}
              min={100}
              step={50}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="md:col-span-4 flex items-end justify-end gap-3">
          <Link href="/properties/map" className="flex items-center gap-2">
            <button
              onClick={onReset}
              className="h-[50px] w-[180px] px-4 cursor-pointer p-2 border border-gray-300 hover:bg-gray-50 transition-colors flex justify-center items-center gap-1 text-base font-semibold"
            >
              <MapPin className="w-5 h-5 text-gray-600" />
              Search on Map
            </button>
          </Link>
          <button
            onClick={onReset}
            className="h-[50px] w-[180px] px-4 cursor-pointer p-2 border border-gray-300 hover:bg-gray-50 transition-colors flex justify-center items-center gap-1 text-base font-semibold rounded"
          >
            <RefreshCcw className="w-5 h-5 text-gray-600" />
            Reset
          </button>
          <button
            onClick={onSearch}
            className="p-2 w-[350px] h-[50px] px-8 cursor-pointer bg-[#FFCC41] hover:bg-yellow-500 text-black text-base font-semibold flex items-center justify-center gap-2 transition-colors rounded"
          >
            <Search className="w-5 h-5" />
            Search Properties
          </button>
        </div>
      </div>

      {/* Click outside handler */}
      {showSortDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowSortDropdown(false)}
        />
      )}
    </div>
  );
}
