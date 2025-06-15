"use client";
import Link from "next/link";

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
        <Link
          key={property.id}
          href={`/property/${property.id}`}
          className="block"
          passHref
        >
          <Card className="cursor-pointer hover:shadow-md transition-all overflow-hidden border-none shadow-sm">
            <div className="relative h-48 bg-gray-200 flex items-center justify-center">
              <img
                src={getPropertyImage(property)}
                alt={property.title}
                className="w-full h-full object-cover rounded-t-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = "none";
                  const parent = e.target.parentNode;
                  if (!parent.querySelector(".img-placeholder")) {
                    const placeholder = document.createElement("div");
                    placeholder.className =
                      "img-placeholder absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-200 to-gray-400 text-gray-500";
                    placeholder.innerHTML = `
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z" />
                        <circle cx="12" cy="13" r="3" />
                      </svg>
                      <span class="text-base font-semibold">No Image Available</span>
                    `;
                    parent.appendChild(placeholder);
                  }
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
        </Link>
      ))}
    </div>
  );
}
