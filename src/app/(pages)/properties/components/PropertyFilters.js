"use client";
import React, { useState } from "react";
import { Search, RefreshCcw, MapPin } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import Link from "next/link";

export default function PropertyFilters({
  filters,
  handleFilterChange,
  handlePriceRangeChange,
  handleReset,
  handleSearch,
  getUniqueTypes,
  getUniqueLocations,
  formatPriceShort,
}) {
  const [localFilters, setLocalFilters] = useState(filters);

  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

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
    });
    handleReset();
  };

  return (
    <div
      className="bg-[#fbfbfb] text-[#555] rounded p-6 md:p-6 mb-10"
      style={{ border: "1px solid #e8e8e8" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <input
          type="text"
          placeholder="Title"
          className="w-full h-[50px] pl-4 p-2 text-sm border border-gray-300 bg-white text-gray-700 rounded"
          value={localFilters.title || ""}
          onChange={(e) => handleLocalChange("title", e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          className="w-full h-[50px] pl-4 p-2 text-sm border border-gray-300 bg-white text-gray-700 rounded"
          value={localFilters.description || ""}
          onChange={(e) => handleLocalChange("description", e.target.value)}
        />
        <select
          className="w-full h-[50px] pl-4 p-2 pr-8 text-sm border-1 focus:border-0 border-gray-300 bg-white text-gray-700 appearance-none cursor-pointer"
          value={localFilters.type}
          onChange={(e) => handleLocalChange("type", e.target.value)}
        >
          <option value="">Types</option>
          {["apartment", "room", "bed"].map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
          {getUniqueTypes &&
          getUniqueTypes().filter(
            (type) => !["apartment", "room", "bed"].includes(type)
          ).length === 0 ? null : (
            <option value="notfound" disabled>
              Not found
            </option>
          )}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <input
          type="text"
          placeholder="Area"
          className="w-full h-[50px] pl-4 p-2 text-sm border border-gray-300 bg-white text-gray-700 rounded"
          value={localFilters.area || ""}
          onChange={(e) => handleLocalChange("area", e.target.value)}
        />
        <input
          type="text"
          placeholder="Street"
          className="w-full h-[50px] pl-4 p-2 text-sm border border-gray-300 bg-white text-gray-700 rounded"
          value={localFilters.street || ""}
          onChange={(e) => handleLocalChange("street", e.target.value)}
        />
        <input
          type="text"
          placeholder="Block"
          className="w-full h-[50px] pl-4 p-2 text-sm border border-gray-300 bg-white text-gray-700 rounded"
          value={localFilters.block || ""}
          onChange={(e) => handleLocalChange("block", e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        <input
          type="number"
          placeholder="Number of bedrooms"
          className="w-full pl-4  p-2 text-sm border bg-white placeholder:text-gray-700 h-[50px]"
          value={localFilters.number_of_beds || ""}
          onChange={(e) => handleLocalChange("number_of_beds", e.target.value)}
        />
        <input
          type="number"
          placeholder="Number of bathrooms"
          className="w-full pl-4  p-2 text-sm border bg-white placeholder:text-gray-700 h-[50px]"
          value={localFilters.number_of_bathrooms || ""}
          onChange={(e) =>
            handleLocalChange("number_of_bathrooms", e.target.value)
          }
        />
        <input
          type="number"
          placeholder="Space (m²)"
          className="w-full pl-4  p-2 text-sm border bg-white placeholder:text-gray-700 h-[50px]"
          value={localFilters.space || ""}
          onChange={(e) => handleLocalChange("space", e.target.value)}
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
            className="h-[50px] w-[180px] px-4 cursor-pointer p-2 border border-gray-300 hover:bg-gray-50 transition-colors flex justify-center items-center gap-1 text-base font-semibold"
          >
            <RefreshCcw className="w-5 h-5 text-gray-600" />
            Reset
          </button>
          <button
            onClick={onSearch}
            className="p-2 w-[350px] h-[50px] px-8 cursor-pointer bg-[#FFCC41] hover:bg-yellow-500 text-black text-base font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Search className="w-5 h-5" />
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
