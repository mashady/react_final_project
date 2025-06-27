import React from "react";
import PropertyCard from "@/components/shared/PropertyCard";

const PropertyList = ({ properties, onEdit, onView, onDelete }) => {
  if (!properties.length) {
    return (
      <div className="py-12 text-center text-gray-500">
        No properties found.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          onEdit={onEdit}
          onView={onView}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default PropertyList;