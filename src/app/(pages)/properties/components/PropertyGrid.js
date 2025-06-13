"use client";
import {
  Card,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

export default function PropertyGrid({
  properties,
  getPropertyImage,
  formatPrice,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {properties.map((property) => (
        <Card
          key={property.id}
          className="cursor-pointer hover:shadow-md transition-all overflow-hidden border-none shadow-sm"
        >
          <div className="relative h-48 bg-gray-200">
            <img
              src={getPropertyImage(property)}
              alt={property.title}
              className="w-full h-full object-cover rounded-t-lg"
              onError={(e) => {
                e.target.src =
                  "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=400&h=300&fit=crop";
              }}
            />
          </div>

          <CardContent className="p-4">
            <div className="text-sm font-medium text-gray-500 mb-1">
              {property.type?.toUpperCase()}
              {property.location && (
                <>
                  {" - "}
                  {property.location.split(",")[0]}
                </>
              )}
            </div>
            <CardTitle className="text-lg font-bold mb-2">
              {property.title}
            </CardTitle>
            <CardDescription className="text-gray-600 mb-4">
              {property.description || "No description available"}
            </CardDescription>
            <div className="text-xl font-bold text-gray-900">
              {property.price
                ? formatPrice(property.price)
                : "Price on request"}
            </div>
            {property.space && !isNaN(property.space) && (
              <div className="text-sm text-gray-500 mt-2">
                {property.space}m²
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
