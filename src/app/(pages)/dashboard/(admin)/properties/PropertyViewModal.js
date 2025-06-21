import React from "react";
import { X } from "lucide-react";

const PropertyViewModal = ({ isOpen, onClose, property, getStatusBadge }) => {
  if (!isOpen || !property) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">{property.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          {property.primary_image && (
            <img
              src={property.primary_image.url || property.media?.[0]?.url}
              alt={property.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Property Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium capitalize">
                    {property.type}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-bold text-blue-600">
                    {property.formatted_price}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Space:</span>
                  <span className="font-medium">{property.space}m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price per m²:</span>
                  <span className="font-medium">{property.price_per_sqm}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bedrooms:</span>
                  <span className="font-medium">{property.number_of_beds}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bathrooms:</span>
                  <span className="font-medium">
                    {property.number_of_bathrooms}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  {getStatusBadge(property.status)}
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Location & Owner</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-600">Address:</span>
                  <p className="font-medium">
                    {property.street}, {property.area}
                  </p>
                  {property.block && (
                    <p className="text-sm text-gray-600">
                      Block: {property.block}
                    </p>
                  )}
                </div>
                <div className="border-t pt-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        property.owner.owner_profile?.picture ||
                        "/api/placeholder/50/50"
                      }
                      alt={property.owner.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">{property.owner.name}</p>
                      <p className="text-sm text-gray-600">
                        {property.owner.owner_profile?.bio}
                      </p>
                      <p className="text-sm text-gray-600">
                        {property.owner.owner_profile?.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">
              {property.description}
            </p>
          </div>
          <div className="mt-6 text-sm text-gray-500">
            <p>Created: {property.created_at_human}</p>
            <p>Updated: {property.updated_at_human}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyViewModal;
