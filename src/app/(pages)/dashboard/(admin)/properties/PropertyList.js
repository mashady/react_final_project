import React from "react";

const PropertyList = ({ properties, onEdit, onView, onDelete }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
            Title
          </th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
            Type
          </th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
            Price
          </th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
            Area
          </th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
            Beds
          </th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
            Baths
          </th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
            Status
          </th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {properties.map((property) => (
          <tr
            key={property.id}
            className="border-b hover:bg-gray-50 cursor-pointer"
            onClick={() => onView(property)}
          >
            <td className="px-4 py-3 font-medium text-gray-900">
              {property.title}
            </td>
            <td className="px-4 py-3 capitalize">{property.type}</td>
            <td className="px-4 py-3">
              {property.formatted_price || property.price}
            </td>
            <td className="px-4 py-3">{property.area}</td>
            <td className="px-4 py-3">{property.number_of_beds}</td>
            <td className="px-4 py-3">{property.number_of_bathrooms}</td>
            <td className="px-4 py-3">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  property.status === "published"
                    ? "bg-green-100 text-green-800"
                    : property.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {property.status.charAt(0).toUpperCase() +
                  property.status.slice(1)}
              </span>
            </td>
            <td className="px-4 py-3">
              <div className="flex gap-2">
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-500 text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(property);
                  }}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(property.id);
                  }}
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default PropertyList;
