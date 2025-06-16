"use client";
import React from "react";
import { MapPin, Home, Bath, Star } from "lucide-react";
import api from "../../api/axiosConfig";
import Link from "next/link";
const PropertyCard = ({ property, onClick, className }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const {
    primary_image = null,
    type = null,
    title = null,
    description = null,
    price = null,
    currency = "$",
    space = null,
    block = null,
    street = null,
    area = null,
    number_of_bedrooms = null,
    number_of_bathrooms = null,
  } = property || {};

  return (
    <Link href={"/property/" + property.id}>
      <div
        className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden cursor-pointer relative ${className}`}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative h-64 bg-gray-200 overflow-hidden">
          {primary_image.file_path ? (
            <img
              src={"http://localhost:8000/storage/" + primary_image?.file_path}
              alt={title || "Property image"}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
              <Home className="w-16 h-16 text-gray-400" />
            </div>
          )}

          {type && (
            <div className="absolute top-4 left-4">
              <span className="bg-white text-gray-800 px-3 py-1 text-sm font-medium rounded shadow-sm">
                {type}
              </span>
            </div>
          )}

          <button
            type="button"
            className={`absolute top-4 right-4 z-10 bg-white rounded p-2 shadow transition-all duration-300 cursor-pointer
            ${
              isHovered
                ? "opacity-100 scale-100"
                : "opacity-0 scale-75 pointer-events-none"
            }
          `}
            aria-label="toggled to favorite"
            onClick={(e) => {
              e.stopPropagation();
              api.post(`/wishlist/toggle/${property.id}`);
              console.log(`Added ${title || "property"} to favorites`);
            }}
          >
            <Star
              className={`w-4 h-4 text-gray-800 transition-colors duration-300`}
            />
          </button>
        </div>

        <div className="p-6">
          {area && (
            <div
              className="flex items-center text-black text-[14px] mb-3 capitalize"
              style={{ fontWeight: 400 }}
            >
              <MapPin className="w-4 h-4 mr-1" />
              <span>{area}</span>
            </div>
          )}

          {title && (
            <h3
              className="text-[26px] text-black mb-3 truncate capitalize"
              style={{ fontWeight: 500 }}
            >
              {title}
            </h3>
          )}

          {description && (
            <p className="text-[#555] text-[15px] leading-relaxed mb-6 truncate capitalize">
              {description}
            </p>
          )}

          {(title || description || location) &&
            (price || area || bedrooms || bathrooms) && (
              <hr className="border-gray-200 mb-6" />
            )}

          {(price || area || bedrooms || bathrooms) && (
            <div className="flex items-center justify-between">
              {price && (
                <div
                  className="text-[23px] text-black"
                  style={{ fontWeight: 500 }}
                >
                  {price.toLocaleString()} {currency}
                </div>
              )}

              <div className="flex items-center space-x-4 text-[#555]">
                {area && (
                  <div className="flex items-center space-x-1">
                    <Home className="w-4 h-4 text-[15px]" />
                    <span className="text-sm">{space}m²</span>
                  </div>
                )}

                {number_of_bedrooms && (
                  <div className="flex items-center space-x-1">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-[15px]"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20 9.556V3h-2v2H6V3H4v6.557C2.81 10.25 2 11.526 2 13v4a1 1 0 0 0 1 1h1v4h2v-4h12v4h2v-4h1a1 1 0 0 0 1-1v-4c0-1.474-.811-2.75-2-3.444zM11 9H4V7h7v2zm9 0h-7V7h7v2z" />
                      </svg>
                    </div>
                    <span className="text-sm">{bedrooms}</span>
                  </div>
                )}

                {number_of_bathrooms && (
                  <div className="flex items-center space-x-1">
                    <Bath className="w-4 h-4 text-[15px]" />
                    <span className="text-sm">{number_of_bathrooms}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
