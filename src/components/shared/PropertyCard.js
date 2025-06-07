import React from "react";
import { MapPin, Home, Bath, Star } from "lucide-react";

const PropertyCard = ({
  image,
  status,
  location,
  title,
  description,
  price,
  currency,
  area,
  bedrooms,
  bathrooms,
  onClick,
  className,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden cursor-pointer relative ${className}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-64 bg-gray-200 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
            <Home className="w-16 h-16 text-gray-400" />
          </div>
        )}

        <div className="absolute top-4 left-4">
          <span className="bg-white text-gray-800 px-3 py-1 text-sm font-medium rounded shadow-sm">
            {status}
          </span>
        </div>

        <button
          type="button"
          className={`absolute top-4 right-4 z-10 bg-white rounded p-2 shadow transition-all duration-300 cursor-pointer
            ${
              isHovered
                ? "opacity-100 scale-100"
                : "opacity-0 scale-75 pointer-events-none"
            }
          `}
          aria-label="Add to favorite"
          onClick={(e) => {
            e.stopPropagation();
            console.log(`Added ${title} to favorites`);
          }}
        >
          <Star
            className={`w-4 h-4 text-gray-800 transition-colors duration-300`}
          />
        </button>
      </div>

      <div className="p-6">
        <div
          className="flex items-center text-black text-[14px] mb-3"
          style={{ fontWeight: 400 }}
        >
          <MapPin className="w-4 h-4 mr-1" />
          <span>{location}</span>
        </div>

        <h3 className="text-[26px] text-black mb-3" style={{ fontWeight: 500 }}>
          {title}
        </h3>

        <p className="text-[#555] text-[15px] leading-relaxed mb-6">
          {description}
        </p>
        <hr className="border-gray-200 mb-6" />

        <div className="flex items-center justify-between">
          <div className="text-[23px] text-black" style={{ fontWeight: 500 }}>
            {price.toLocaleString()} {currency}
          </div>

          <div className="flex items-center space-x-4 text-[#555]">
            <div className="flex items-center space-x-1">
              <Home className="w-4 h-4 text-[15px] " />
              <span className="text-sm">{area}m²</span>
            </div>

            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-[15px] "
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 9.556V3h-2v2H6V3H4v6.557C2.81 10.25 2 11.526 2 13v4a1 1 0 0 0 1 1h1v4h2v-4h12v4h2v-4h1a1 1 0 0 0 1-1v-4c0-1.474-.811-2.75-2-3.444zM11 9H4V7h7v2zm9 0h-7V7h7v2z" />
                </svg>
              </div>
              <span className="text-sm">{bedrooms}</span>
            </div>

            <div className="flex items-center space-x-1">
              <Bath className="w-4 h-4 text-[15px]" />
              <span className="text-sm">{bathrooms}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
