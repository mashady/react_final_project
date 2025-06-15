"use client";
import { MapPin, User } from "lucide-react";
export default function PropertyDetails({ property }) {
  if (!property) return null;
  return (
    <div className="mb-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">{property.title}</h1>
      <div className="flex items-center text-gray-500 mb-2">
        <MapPin className="w-4 h-4 mr-1" />
        <span>{property.location}</span>
      </div>
      <div className="flex items-center text-gray-500 mb-2">
        <User className="w-4 h-4 mr-1" />
        <span>By {property.user?.name || "Unknown"}</span>
      </div>
      <div className="text-xl font-bold text-yellow-600 mb-2">{property.price}</div>
      <div className="text-gray-700 mb-2">{property.description}</div>
      {/* Add more property details as needed */}
    </div>
  );
}
