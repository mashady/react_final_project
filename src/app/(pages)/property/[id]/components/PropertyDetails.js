"use client";
import { MapPin, User } from "lucide-react";

const propertyNameStyle = {
  fontFamily: "Poppins, sans-serif",
  fontWeight: 500,
  color: "#000",
  fontSize: "45px",
  lineHeight: "1.1333333333em",
  margin: "25px 0",
  wordWrap: "break-word",
};

export default function PropertyDetails({ property }) {
  if (!property) return null;
  return (
    <div className="mb-10 bg-white rounded-2xl shadow-lg p-10 flex flex-col md:flex-row md:items-center md:gap-10 border border-[#ececec]">
      <div className="flex-1">
        <h1
          className={
            property.propertyNameClass || "text-2xl md:text-3xl font-bold mb-2"
          }
          style={property.propertyNameClass ? propertyNameStyle : {}}
        >
          {property.title}
        </h1>

        <div className="flex items-center text-[#888] mb-4 text-lg font-medium"></div>
        <div className="flex gap-8 mb-6">
          <div className="flex flex-col">
            <span className="text-[#888] text-base">Bedrooms</span>
            <span className="text-xl font-bold text-[#222]">
              {property.numberOfBeds || property.number_of_beds || "N/A"}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[#888] text-base">Bathrooms</span>
            <span className="text-xl font-bold text-[#222]">
              {property.numberOfBathrooms ||
                property.number_of_bathrooms ||
                "N/A"}
            </span>
          </div>
        </div>
        <h1 className="font-[500] text-4xl">Description</h1>
        <div className="text-[#444] text-lg mb-2 leading-relaxed">
          {property.description}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <div className="flex flex-col">
            <span className="text-[#888] text-base">Area</span>
            <span className="text-lg font-semibold text-[#222]">
              {property.space || property.area || "N/A"} m²
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[#888] text-base">Block</span>
            <span className="text-lg font-semibold text-[#222]">
              {property.block || "N/A"}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[#888] text-base">Street</span>
            <span className="text-lg font-semibold text-[#222]">
              {property.street || "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
