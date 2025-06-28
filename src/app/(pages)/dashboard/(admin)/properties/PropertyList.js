import React from "react";
import PropertyCard from "@/components/shared/PropertyCard";
import { useTranslation } from "../../../../../TranslationContext";

const PropertyList = ({ properties, onEdit, onView, onDelete, t }) => {
  const { locale } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          isDashboard={true}
          className="hover:shadow-lg transition-shadow duration-300"
        >
          <div
            className={`flex gap-2 mt-4 ${
              locale === "ar" ? "flex-row-reverse" : ""
            }`}
          >
            <button
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(property);
              }}
            >
              {t("editButton")}
            </button>
            <button
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(property.id);
              }}
            >
              {t("deleteButton")}
            </button>
          </div>
        </PropertyCard>
      ))}
    </div>
  );
};

export default PropertyList;
