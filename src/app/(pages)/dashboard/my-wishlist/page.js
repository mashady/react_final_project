"use client";
import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import LoadMoreBtn from "@/components/shared/LoadMoreBtn";
import PropertyCard from "@/components/shared/PropertyCard";
import { fetchWishlist } from "@/features/wishlist/wishlistThunks";
import Link from "next/link";
import LoadingSpinner from "../../properties/components/LoadingSpinner";
import useIntersection from "@/hooks/useIntersection";
import { useTranslation } from "../../../../TranslationContext";

const PAGE_SIZE = 9;

const WishlistContent = () => {
  const dispatch = useDispatch();
  const { t, locale } = useTranslation();
  const wishlistState = useSelector((state) => state.wishlist || {});
  const { items: wishlist = [], loading = false, error = null } = wishlistState;

  // Pagination state
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const hasNextPage = wishlist.length > visibleCount;
  const isLoadingMore = useRef(false);

  // Intersection observer for lazy loading
  const { ref: sentinelRef } = useIntersection({
    onIntersect: () => {
      if (hasNextPage && !isLoadingMore.current) {
        isLoadingMore.current = true;
        setTimeout(() => {
          setVisibleCount((prev) => prev + PAGE_SIZE);
          isLoadingMore.current = false;
        }, 400); // Simulate loading delay
      }
    },
    rootMargin: "200px",
  });

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  useEffect(() => {
    // Reset visible count if wishlist changes
    setVisibleCount(PAGE_SIZE);
  }, [wishlist.length]);

  const handleRetry = () => {
    dispatch(fetchWishlist());
  };

  // Only show up to visibleCount items
  const visibleWishlist = useMemo(
    () => wishlist.slice(0, visibleCount),
    [wishlist, visibleCount]
  );

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
          {t("retry") || "Retry"}{" "}
        </button>
      </div>
    );
  }

  return (
    <div>
      <DashboardPageHeader
        title={t("navbarDropMyWishlist")}
        description={t("wishlistDescription")}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleWishlist.length > 0 ? (
          visibleWishlist.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              className="hover:transform transition-transform duration-300"
            />
          ))
        ) : (
          <div className="col-span-full text-center">
            <p className="text-[#555] text-lg mb-4">
              {t("wishlistEmptyMessage")}
            </p>
            <Link
              href="/properties"
              className="inline-block px-6 py-2 bg-yellow-500 text-black rounded-none hover:bg-primary-dark transition-colors"
            >
              {t("browseProperties")}
            </Link>
          </div>
        )}
      </div>

      {/* Lazy loading sentinel and loading indicator */}
      {hasNextPage && (
        <div ref={sentinelRef} className="flex justify-center mt-10">
          <div className="flex items-center space-x-2">
            <LoadingSpinner />
            <span className="text-gray-500">{t("loadingMore")}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistContent;
