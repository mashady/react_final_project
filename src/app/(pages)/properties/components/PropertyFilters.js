"use client";
import { Search, RefreshCcw } from "lucide-react";
import { Slider } from "@/components/ui/slider";

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
  return (
    <div
      className="bg-[#fbfbfb] text-[#555] rounded p-6 md:p-6 mb-10"
      style={{
        border: "1px solid #e8e8e8",
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <div className="relative">
          <select
            className="w-full h-[50px] pl-4 p-2 pr-8 text-sm border-1 focus:border-0 border-gray-300 bg-white text-gray-700 appearance-none cursor-pointer"
            value={filters.type}
            onChange={(e) => handleFilterChange("type", e.target.value)}
          >
            <option value="">Types</option>
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
            className="w-full h-[50px] pl-4  p-2 pr-8 text-sm border bg-white text-gray-700 appearance-none cursor-pointer"
            value={filters.location}
            onChange={(e) => handleFilterChange("location", e.target.value)}
          >
            <option value="">Locations</option>
            {getUniqueLocations().map((location) => (
              <option key={location} value={location}>
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        <div>
          {/* <label className="block text-xs font-medium text-gray-500 mb-1">
            Min Bedrooms
          </label> */}
          <input
            type="number"
            placeholder="Number of bedrooms"
            className="w-full pl-4  p-2 text-sm border bg-white placeholder:text-gray-700 h-[50px]"
            value={filters.bedrooms}
            onChange={(e) => handleFilterChange("bedrooms", e.target.value)}
          />
        </div>

        <div>
          {/* <label className="block text-xs font-medium text-gray-500 mb-1">
            Min Bathrooms
          </label> */}
          <input
            type="number"
            placeholder="Number of bathrooms"
            className="w-full pl-4  p-2 text-sm border bg-white placeholder:text-gray-700 h-[50px]"
            value={filters.bathrooms}
            onChange={(e) => handleFilterChange("bathrooms", e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          {/* <label className="block text-xs font-medium text-gray-500 mb-1">
            Price range (USD)
          </label> */}
          <div className="px-1">
            <div className="flex justify-between text-xs text-gray-500 mb-3">
              <span>{formatPriceShort(filters.priceRange[0])}</span>
              <span>{formatPriceShort(filters.priceRange[1])}</span>
            </div>
            <Slider
              value={filters.priceRange}
              onValueChange={handlePriceRangeChange}
              max={50000}
              min={100}
              step={1000}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div>
          {/* <label className="block text-xs font-medium text-gray-500 mb-1">
            Min area (m²)
          </label> */}
          <input
            type="number"
            placeholder="Min Area"
            className="w-full p-2 pl-4  text-sm border bg-white placeholder:text-gray-700 h-[50px]"
            value={filters.minArea}
            onChange={(e) => handleFilterChange("minArea", e.target.value)}
          />
        </div>

        <div>
          {/* <label className="block text-xs font-medium text-gray-500 mb-1">
            Max area (m²)
          </label> */}
          <input
            type="number"
            placeholder="Max Area"
            className="w-full pl-4 p-2 text-sm border bg-white placeholder:text-gray-700 h-[50px]"
            value={filters.maxArea}
            onChange={(e) => handleFilterChange("maxArea", e.target.value)}
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={handleReset}
            className="w-full h-[50px] cursor-pointer p-2 border border-gray-300 hover:bg-gray-50 transition-colors flex justify-center items-center gap-1 text-sm"
          >
            <RefreshCcw className="w-4 h-4 text-gray-600" />
            Reset
          </button>
        </div>

        <div className="flex items-end">
          <button
            onClick={handleSearch}
            className="w-full p-2 h-[50px] cursor-pointer bg-[#FFCC41] hover:bg-yellow-500 text-black text-sm font-medium flex items-center justify-center gap-1 transition-colors"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
