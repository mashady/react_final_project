"use client";

export default function PropertyHeader({ totalProperties, error }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
        Property List
      </h1>
      <p className="text-gray-600 mt-2">
        Found {totalProperties} properties
        {error && (
          <span className="text-red-500 ml-2">
            (Using demo data - API connection failed)
          </span>
        )}
      </p>
    </div>
  );
}
