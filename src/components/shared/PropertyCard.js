"use client";
import React from "react";
import { MapPin, Home, Bath, Star, User } from "lucide-react";
import api from "../../api/axiosConfig";
import Link from "next/link";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { toggleWishlistItem } from "@/features/wishlist/wishlistThunks";

const ProfileImage = ({ owner, API_BASE_URL }) => {
  const [imgError, setImgError] = React.useState(false);

  if (imgError || !owner?.owner_profile?.picture) {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
        <User className="w-5 h-5 text-gray-400" />
      </div>
    );
  }

  const imageUrl =
    owner.owner_profile.picture.startsWith("http") ||
    owner.owner_profile.picture.startsWith("/")
      ? owner.owner_profile.picture
      : `${API_BASE_URL}/${owner.owner_profile.picture}`;

  return (
    <Image
      src={imageUrl}
      alt={`${owner.name || "Owner"} profile`}
      width={32}
      height={32}
      className="rounded-full object-cover border border-gray-200"
      onError={() => setImgError(true)}
      unoptimized={!imageUrl.startsWith("/")}
    />
  );
};

const PropertyImage = ({ imageUrl, title, API_BASE_URL }) => {
  const [imgError, setImgError] = React.useState(false);

  if (imgError || !imageUrl) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
        <Home className="w-16 h-16 text-gray-400" />
      </div>
    );
  }

  const fullImageUrl =
    imageUrl.startsWith("http") || imageUrl.startsWith("/")
      ? imageUrl
      : `${API_BASE_URL}/storage/${imageUrl}`;

  return (
    <Image
      src={fullImageUrl}
      alt={title || "Property image"}
      fill
      className="object-cover hover:scale-105 transition-transform duration-300"
      onError={() => setImgError(true)}
      unoptimized={!fullImageUrl.startsWith("/")}
      priority={false}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
};

const PropertyCard = ({ property, onClick, className }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

  const {
    primary_image = null,
    media = null,
    type = null,
    title = null,
    description = null,
    price = null,
    currency = "$",
    space = null,
    block = null,
    street = null,
    area = null,
    number_of_beds = null,
    number_of_bathrooms = null,
    owner = null,
  } = property || {};

  const imageUrl = primary_image?.file_path || media?.[0]?.file_path;

  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.items);
  const pendingToggle = useSelector(
    (state) => state.wishlist.pendingToggles[property.id] || false
  );
  const isInWishlist = pendingToggle
    ? !wishlist.some((item) => item.id === property.id)
    : wishlist.some((item) => item.id === property.id);

  const currentUser = useSelector((state) => state.user.data);
  const isOwner = currentUser?.role === "owner";
  const isLoggedIn = !!currentUser;

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (!pendingToggle) {
      dispatch(toggleWishlistItem(property.id));
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden cursor-pointer relative ${className}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-64 bg-gray-200 overflow-hidden">
        <PropertyImage
          imageUrl={imageUrl}
          title={title}
          API_BASE_URL={API_BASE_URL}
        />

        {type && (
          <div className="absolute top-4 left-4">
            <span className="bg-white text-gray-800 px-3 py-1 text-sm font-medium rounded shadow-sm">
              {type}
            </span>
          </div>
        )}

        {owner && (
          <div className="absolute bottom-4 left-4 flex items-center space-x-2">
            <ProfileImage owner={owner} API_BASE_URL={API_BASE_URL} />
            {owner?.name && (
              <Link
                href={`/owner-profile/${owner.id}`}
                onClick={(e) => e.stopPropagation()}
              >
                <span className="bg-white text-gray-800 px-3 py-1 text-sm font-medium rounded shadow-sm">
                  {owner.name}
                </span>
              </Link>
            )}
          </div>
        )}

        {!isOwner && isLoggedIn && (
          <button
            type="button"
            className={`absolute top-4 right-4 z-10 rounded p-2 shadow transition-all duration-300 cursor-pointer
              ${
                isHovered || isInWishlist
                  ? "opacity-100 scale-100 bg-white"
                  : "opacity-0 scale-75 pointer-events-none bg-white"
              }
              ${pendingToggle ? "opacity-50 cursor-wait" : ""}
            `}
            onClick={handleFavoriteClick}
            disabled={pendingToggle}
            aria-label={
              isInWishlist ? "Remove from wishlist" : "Add to wishlist"
            }
          >
            <Star
              className={`w-4 h-4 transition-colors duration-300 ${
                isInWishlist ? "text-yellow-400" : "text-gray-800"
              }`}
              fill={isInWishlist ? "currentColor" : "none"}
            />
          </button>
        )}
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
            <Link
              href={`/property/${property.id}`}
              onClick={(e) => e.stopPropagation()}
            >
              {title}
            </Link>
          </h3>
        )}

        {description && (
          <p className="text-[#555] text-[15px] leading-relaxed mb-6 line-clamp-2 capitalize">
            {description}
          </p>
        )}

        {(title || description) &&
          (price || space || number_of_beds || number_of_bathrooms) && (
            <hr className="border-gray-200 mb-6" />
          )}

        {(price || space || number_of_beds || number_of_bathrooms) && (
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
              {space && (
                <div className="flex items-center space-x-1">
                  <Home className="w-4 h-4 text-[15px]" />
                  <span className="text-sm">{space}m²</span>
                </div>
              )}

              {number_of_beds && (
                <div className="flex items-center space-x-1">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-[15px]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20 9.556V3h-2v2H6V3H4v6.557C2.81 10.25 2 11.526 2 13v4a1 1 0 0 0 1 1h1v4h2v-4h12v4h2v-4h1a1 1 0 0 0 1-1v-4c0-1.474-.811-2.75-2-3.444zM11 9H4V7h7v2zm9 9h-7V7h7v2z" />
                    </svg>
                  </div>
                  <span className="text-sm">{number_of_beds}</span>
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
  );
};

export default PropertyCard;
