"use client";

import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import LoadMoreBtn from "@/components/shared/LoadMoreBtn";
import PropertyCard from "@/components/shared/PropertyCard";
import React, { useEffect, useState } from "react";
import api from "../../../../api/axiosConfig";

const WishlistContent = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const response = await api.get("/wishlist");
        const data = response.data.data.data;
        const wishlistArray = Array.isArray(data) ? data : [data];
        setWishlist(wishlistArray);
      } catch (err) {
        setError(err.message || "Failed to fetch wishlist");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const handleCardClick = (property) => {
    console.log("Property clicked:", property);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading wishlist...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <DashboardPageHeader
        title="My Wishlist"
        description='This page contains all the items you have added to your personal wishlist. Add items to your wishlist by clicking the "heart" icon while logged in to your account.'
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.length > 0 ? (
          wishlist.map((property, index) => (
            <PropertyCard
              key={index}
              property={property}
              onClick={() => handleCardClick(property)}
              className="hover:transform"
            />
          ))
        ) : (
          <div className="col-span-full text-center py-20">
            <p className="text-gray-500 text-lg">Your wishlist is empty</p>
          </div>
        )}
      </div>
      {wishlist.length > 0 && (
        <div className="flex justify-center mt-10">
          <LoadMoreBtn />
        </div>
      )}
    </div>
  );
};

import RequireAuth from "@/components/shared/RequireAuth";

const WishlistPage = () => (
  <RequireAuth allowedRoles={["student"]}>
    <WishlistContent />
  </RequireAuth>
);

export default WishlistPage;
