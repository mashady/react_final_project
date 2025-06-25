"use client";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import LoadMoreBtn from "@/components/shared/LoadMoreBtn";
import PropertyCard from "@/components/shared/PropertyCard";
import { fetchWishlist } from "@/features/wishlist/wishlistThunks";
import Link from "next/link";
import LoadingSpinner from "../../properties/components/LoadingSpinner";

const WishlistContent = () => {
  const dispatch = useDispatch();
  const wishlistState = useSelector((state) => state.wishlist || {});
  const { items: wishlist = [], loading = false, error = null } = wishlistState;

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleRetry = () => {
    dispatch(fetchWishlist());
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-black">{error}</p>
        <button
          onClick={handleRetry}
          className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
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
          wishlist.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              className="hover:transform transition-transform duration-300"
            />
          ))
        ) : (
          <div className="col-span-full text-center">
            <p className="text-[#555] text-lg mb-4">Your wishlist is empty</p>
            <Link
              href="/properties"
              className="inline-block px-6 py-2 bg-yellow-500 text-black rounded-none hover:bg-primary-dark transition-colors"
            >
              Browse Properties
            </Link>
          </div>
        )}
      </div>

      {wishlist.length > 6 && (
        <div className="flex justify-center mt-10">
          <LoadMoreBtn />
        </div>
      )}
    </div>
  );
};

export default WishlistContent;
