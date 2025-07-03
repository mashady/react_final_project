"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import banner from "../../../../../public/banner.jpg";
import Image from "next/image";
import axios from "axios";
import PropertyCard from "@/components/shared/PropertyCard";
import { User } from "lucide-react";
import LoadingSpinner from "../../properties/components/LoadingSpinner";
import { useSelector } from "react-redux";
import OwnerReviewList from "./OwnerReviewList";
import { useTranslation } from "@/TranslationContext";
import { useInView } from "react-intersection-observer";

const OwnerProfilePage = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adsLoading, setAdsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { id } = useParams();
  const token = useSelector((state) => state.user.token) || localStorage.getItem("token");
  const { t } = useTranslation();
  const { ref, inView } = useInView({ threshold: 0.5 });

  const [reviewForm, setReviewForm] = useState({ comment: "" });
  const [reviewError, setReviewError] = useState("");
  const [reviewRefreshKey, setReviewRefreshKey] = useState(0);
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/users/${id}?page=1`);
      const user = res.data.data.user;
      setUserProfile({
        name: user.name,
        bio: user.owner_profile?.bio || t("onwerPnoBio"),
        image: user.owner_profile?.picture,
        email: user.email,
        phone: user.owner_profile?.phone_number,
        whatsapp: user.owner_profile?.whatsapp_number,
        address: user.owner_profile?.address,
      });
      const firstAds = res.data.data.ads.data;
      setAds(firstAds);
      setHasMore(res.data.data.ads.next_page_url !== null);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMoreAds = async () => {
    if (!hasMore || adsLoading) return;
    try {
      setAdsLoading(true);
      const res = await axios.get(`http://localhost:8000/api/users/${id}?page=${currentPage + 1}`);
      const newAds = res.data.data.ads.data;
      setAds((prev) => [...prev, ...newAds]);
      setCurrentPage((prev) => prev + 1);
      setHasMore(res.data.data.ads.next_page_url !== null);
    } catch (err) {
      console.error("Failed to fetch more ads", err);
    } finally {
      setAdsLoading(false);
    }
  };

  const handleReviewSubmit = async () => {
    if (!reviewForm.comment.trim()) {
      setReviewError("Please enter a comment");
      return;
    }
    try {
      setSubmittingReview(true);
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.post("http://127.0.0.1:8000/api/owner-reviews", {
        owner_id: id,
        content: reviewForm.comment.trim(),
      }, { headers });
      setReviewForm({ comment: "" });
      setReviewRefreshKey((prev) => prev + 1);
    } catch (err) {
      console.error("Review submission failed", err);
    } finally {
      setSubmittingReview(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (inView) fetchMoreAds();
  }, [inView]);

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <section className="container w-[98%] mx-auto my-10">
        <Image src={banner} alt="Page Banner" className="hidden lg:block" />
      </section>
      <section id="profileContainer" className="w-[72%] mx-auto lg:flex lg:space-x-5">
        <section id="leftSide">
          <article className="bg-[#edf9f9] rounded-sm flex flex-col justify-center items-center px-5 py-5 space-y-3 lg:relative lg:top-[-80px]">
            {userProfile?.image ? (
              <Image src={userProfile.image} alt="owner image" width={256} height={256} className="rounded-sm" />
            ) : (
              <div className="flex items-center justify-center bg-gray-200 rounded-sm w-64 h-64">
                <User size={64} className="text-gray-400 w-full" />
              </div>
            )}
            <section className="my-6 space-y-3 w-full">
              <div className="flex justify-between border-b-1 border-gray-200 py-2">
                <p className="text-gray-600">{t("ownerProfileAdress")}:</p>
                <p>{userProfile.address}</p>
              </div>
              <div className="flex justify-between border-b-1 border-gray-200 py-2">
                <p className="text-gray-600">{t("ownerProfilePNumber")}:</p>
                <p>{userProfile.phone}</p>
              </div>
              <div className="flex justify-between border-b-1 border-gray-200 py-2">
                <p className="text-gray-600">{t("ownerProfileWhatsapp")}:</p>
                <p>{userProfile.whatsapp}</p>
              </div>
              <div className="flex justify-between py-2">
                <p className="text-gray-600">{t("ownerProfileEmail")}:</p>
                <p>{userProfile.email}</p>
              </div>
            </section>
          </article>
        </section>

        <section id="rightSide">
          <article className="w-full bg-white px-5 border-b-1 border-gray-200 py-3 rounded-sm">
            <h3 className="text-5xl font-medium mb-8">{userProfile.name}</h3>
            <p className="text-gray-500 my-2">{userProfile.bio}</p>
          </article>

          <article className="w-full bg-white px-5 py-3 rounded-sm mt-5">
            <h3 className="text-3xl font-medium mb-8">{t("ownerProfileListing")}</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {ads.map((property, i) => (
                <PropertyCard key={i} property={property} />
              ))}
            </div>
            {adsLoading && <LoadingSpinner />}
            <div ref={ref}></div>
          </article>

          <article className="w-full bg-white px-5 py-6 rounded-sm mt-5 mb-5">
            <h3 className="text-2xl mb-4" style={{ fontWeight: 500 }}>{t("ownerReviews")}</h3>
            <OwnerReviewList
              ownerId={id}
              refreshKey={reviewRefreshKey}
              showReviewForm={true}
              reviewForm={reviewForm}
              setReviewForm={setReviewForm}
              submittingReview={submittingReview}
              reviewError={reviewError}
              onSubmit={handleReviewSubmit}
            />
          </article>
        </section>
      </section>
    </>
  );
};

export default OwnerProfilePage;
