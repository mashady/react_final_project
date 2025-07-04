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

const OwnerProfilePage = () => {
  const [userProfile, setUserProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const user = useSelector((state) => state.user.data);
  const token =
    useSelector((state) => state.user.token) || localStorage.getItem("token");
  const { t } = useTranslation();

  const [reviewRefreshKey, setReviewRefreshKey] = useState(0);
  const [reviewForm, setReviewForm] = useState({ comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [hideReviewForm, setHideReviewForm] = useState(false);

  const handleReviewSubmit = async () => {
    setReviewError("");
    if (!user) {
      setHideReviewForm(true);
      return;
    }
    if (!reviewForm.comment.trim()) {
      setReviewError("Please enter a comment");
      return;
    }
    try {
      setSubmittingReview(true);
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.post(
        `http://127.0.0.1:8000/api/owner-reviews`,
        {
          owner_id: id,
          content: reviewForm.comment.trim(),
        },
        { headers }
      );
      setReviewForm({ comment: "" });
      setReviewRefreshKey((k) => k + 1);
    } catch (err) {
      setHideReviewForm(true);
    } finally {
      setSubmittingReview(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    // eslint-disable-next-line
  }, []);

  const fetchUserProfile = () => {
    setLoading(true);
    axios
      .get(`http://localhost:8000/api/users/${id}`)
      .then((res) => {
        setUserProfile({
          ads: res.data.data.ads || [],
          name: res.data.data.name || t("onwerPnoName"),
          bio: res.data.data.owner_profile.bio || t("onwerPnoBio"),
          image: res.data.data.owner_profile.picture,
          email: res.data.data.email || t("onwerPnoEmail"),
          phone:
            res.data.data.owner_profile.phone_number ||
            t("onwerPnoPhoneNumber"),
          whatsapp:
            res.data.data.owner_profile.whatsapp_number ||
            t("onwerPnoWhatsappNumber"),
          address: res.data.data.owner_profile.address || t("onwerPnoAddress"),
        });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <section className="container w-[98%] mx-auto my-10">
        <Image src={banner} alt="Page Banner" className="hidden lg:block" />
      </section>
      <section
        id="profileContainer"
        className="w-[72%] mx-auto lg:flex lg:space-x-5"
      >
        <section id="leftSide" className="">
          <article
            id="infoCard"
            className="bg-[#edf9f9] rounded-sm flex flex-col justify-center items-center px-5 py-5 space-y-3 lg:relative lg:top-[-80px]"
          >
            <section id="profileImage">
              {userProfile.image ? (
                <Image
                  src={userProfile.image}
                  alt="owner image"
                  className="rounded-sm"
                  width={256}
                  height={256}
                />
              ) : (
                <div className="flex items-center justify-center bg-gray-200 rounded-sm w-64 h-64">
                  <User size={64} className="text-gray-400 w-full" />
                </div>
              )}
            </section>
            <section id="ownerInfo" className="my-6 space-y-3 w-full">
              {user ? (
                <>
                  <div className="flex justify-between border-b-1 border-gray-200 py-2">
                    <p className="text-gray-600">{t("ownerProfileAdress")}:</p>
                    <p>{userProfile.address}</p>
                  </div>
                  <div className="flex justify-between border-b-1 border-gray-200 py-2">
                    <p className="text-gray-600">{t("ownerProfilePNumber")}:</p>
                    <p>{userProfile.phone}</p>
                  </div>
                  <div className="flex justify-between border-b-1 border-gray-200 py-2">
                    <p className="text-gray-600">
                      {t("ownerProfileWhatsapp")}:
                    </p>
                    <p>{userProfile.whatsapp}</p>
                  </div>
                  <div className="flex justify-between py-2">
                    <p className="text-gray-600">{t("ownerProfileEmail")}:</p>
                    <p>{userProfile.email}</p>
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-600 mt-4">
                  <p className="mb-2">{t("loginToViewOwnerDetails")}</p>
                  <a
                    href="/login"
                    className="inline-block bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600 transition"
                  >
                    {t("loginNow")}
                  </a>
                </div>
              )}
            </section>
          </article>
        </section>

        <section id="rightSide">
          <article
            id="ownerProfile"
            className="w-full bg-white px-5 border-b-1 border-gray-200 py-3 rounded-sm"
          >
            <h3 className="text-5xl font-medium mb-8">{userProfile.name}</h3>
            <p className="text-gray-500 my-2">{userProfile.bio}</p>
          </article>

          <article
            id="ownerProperties"
            className="w-full bg-white px-5 border-b-1 border-gray-200 py-3 rounded-sm mt-5"
          >
            <h3 className="text-3xl font-medium mb-8">
              {t("ownerProfileListing")}
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {userProfile?.ads?.map((property, i) => (
                <PropertyCard key={i} property={property} />
              ))}
            </div>
          </article>

          <article className="w-full bg-white px-5 py-6 rounded-sm mt-5 mb-5">
            <h3 className="text-2xl mb-4" style={{ fontWeight: 500 }}>
              {t("ownerReviews")}
            </h3>
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