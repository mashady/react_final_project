"use client";
import React, { useState, useEffect } from "react";
import {
  Heart,
  Share2,
  Plus,
  Phone,
  MessageSquare,
  Star,
  MapPin,
  Home,
  Bath,
  Ruler,
  Calendar,
  Building,
  Maximize,
  Loader2,
  ChevronUp,
  ChevronDown,
  X,
} from "lucide-react";
import ReviewList from "./components/ReviewList";
import ReviewForm from "./components/ReviewForm";
import axios from "axios";
import { useParams } from "next/navigation";
import ChatWindow from "@/components/chat/ChatWindow";
import LoadingSpinner from "../../properties/components/LoadingSpinner";
import { useSelector } from "react-redux";

const PropertyListing = ({ toggleChat, showChat, senderId, ownerUserId }) => {
  const params = useParams();
  const propertyId = params.id;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewForm, setReviewForm] = useState({ comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [ownerDetails, setOwnerDetails] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Fetch property data
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://127.0.0.1:8000/api/ads/${propertyId}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setProperty(result.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching property:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  const images =
    property?.media?.filter((item) => item.is_image).map((item) => item.url) ||
    [];

  const agent = {
    name: property?.owner?.name || "Property Owner",

    address: `${property?.street || ""}, ${property?.area || ""}, ${
      property?.block || ""
    }`
      .trim()
      .replace(/^,|,$/, ""),
    mobile: "+7774442225",
    whatsapp: "7774442225",
    email: "agent@example.com",
    avatar: "/api/placeholder/100/100",
  };

  // Map API data to features
  const features = property
    ? [
        { icon: Ruler, label: "Size:", value: `${property.space}m²` },
        {
          icon: Home,
          label: "Bedrooms:",
          value: property.number_of_beds?.toString() || "N/A",
        },
        {
          icon: Bath,
          label: "Bathrooms:",
          value: property.number_of_bathrooms?.toString() || "N/A",
        },
        { icon: MapPin, label: "Area:", value: property.area || "N/A" },
        {
          icon: Building,
          label: "Type:",
          value:
            property.type?.charAt(0).toUpperCase() + property.type?.slice(1) ||
            "N/A",
        },
        {
          icon: Calendar,
          label: "Listed:",
          value: property.created_at_human || "N/A",
        },
      ]
    : [];

  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [images.length]);

  const handleContactSubmit = () => {
    console.log("Contact form submitted:", contactForm);
  };

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await axios.get(
          `http://127.0.0.1:8000/api/ads/${propertyId}/reviews`,
          { headers }
        );
        setReviews(res.data.data || []);
      } catch (err) {
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };
    if (property) fetchReviews();
  }, [property, propertyId]);

  // Fetch user
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setCurrentUser(JSON.parse(userData));
      } catch {}
    }
  }, []);

  const handleReviewSubmit = async () => {
    setReviewError("");
    if (!currentUser) {
      setReviewError("Please log in to submit a review");
      return;
    }
    if (!reviewForm.comment.trim()) {
      setReviewError("Please enter a comment");
      return;
    }
    try {
      setSubmittingReview(true);
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.post(
        `http://127.0.0.1:8000/api/reviews`,
        {
          ad_id: propertyId,
          content: reviewForm.comment.trim(),
        },
        { headers }
      );
      setReviewForm({ comment: "" });
      // Refetch reviews
      const reviewsRes = await axios.get(
        `http://127.0.0.1:8000/api/ads/${propertyId}/reviews`,
        { headers }
      );
      setReviews(reviewsRes.data.data || []);
    } catch (err) {
      setReviewError("Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  useEffect(() => {
    const fetchOwnerDetails = async () => {
      if (!property?.user_id && !property?.owner?.id) return;
      try {
        const ownerId = property.owner?.id || property.user_id;
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await axios.get(
          `http://127.0.0.1:8000/api/oneowner/${ownerId}`,
          { headers }
        );
        setOwnerDetails(res.data.data);
      } catch (err) {
        setOwnerDetails(null);
      }
    };
    if (property) fetchOwnerDetails();
  }, [property]);

  const handleToggleWishlist = async () => {
    if (!currentUser) {
      alert("Please log in to use wishlist.");
      return;
    }

    if (!propertyId) {
      alert("Invalid property ID.");
      return;
    }

    setWishlistLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.post(
        `http://127.0.0.1:8000/api/wishlist/toggle/${propertyId}`,
        {},
        { headers }
      );
      setIsInWishlist(res.data.is_in_wishlist);
    } catch (err) {
      console.error(err);
      alert("Failed to update wishlist. Please try again.");
    } finally {
      setWishlistLoading(false);
    }
  };

  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!currentUser) return;
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await axios.get(
          `http://127.0.0.1:8000/api/wishlist/${propertyId}`,
          { headers }
        );
        setIsInWishlist(res.data.is_in_wishlist);
      } catch (err) {
        setIsInWishlist(false);
      }
    };
    checkWishlistStatus();
  }, [currentUser, propertyId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <span>
            <LoadingSpinner />
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">
            Error loading property
          </div>
          <div className="text-gray-600">{error}</div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-xl">Property not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-[600px] bg-gray-200 overflow-hidden">
        {images.length > 0 ? (
          <>
            <img
              src={images[currentImageIndex]}
              alt="Property"
              className="w-full h-full object-cover"
            />
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full ${
                      index === currentImageIndex ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300">
            <span className="text-gray-500">No images available</span>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1
                    className="text-[45px] text-black mb-2 capitalize"
                    style={{
                      fontWeight: 500,
                    }}
                  >
                    {property.title}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="uppercase font-medium">
                      {property.type}
                    </span>
                    <span> {property.created_at_human}</span>
                    <div className="flex items-center"></div>
                  </div>
                  {agent.address && (
                    <div className="flex items-center mt-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{agent.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2
                className="text-[26px] text-black mb-4"
                style={{
                  fontWeight: 500,
                }}
              >
                Description
              </h2>
              <p className="text-[#555] text-[15px] leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Property Features */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2
                className="text-[26px] text-black mb-4"
                style={{
                  fontWeight: 500,
                }}
              >
                Property details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <feature.icon className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">{feature.label}</span>
                    <span className="font-semibold text-gray-900 ml-auto">
                      {feature.value}
                    </span>
                  </div>
                ))}
              </div>
              {property.price_per_sqm && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div
                    className="text-[26px] text-black"
                    style={{
                      fontWeight: 500,
                    }}
                  >
                    {property.price_per_sqm}
                  </div>
                </div>
              )}
            </div>

            {/* Reviews Section */}
            {/* <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Reviews</h2>
              {reviewsLoading ? (
                <div className="text-gray-500 mb-6">Loading reviews...</div>
              ) : (
                <ReviewList reviews={reviews} />
              )}
              <div className="border-t border-gray-100 pt-6 mt-6">
                <ReviewForm
                  reviewForm={reviewForm}
                  setReviewForm={setReviewForm}
                  submittingReview={submittingReview}
                  reviewError={reviewError}
                  onSubmit={handleReviewSubmit}
                />
              </div>
            </div> */}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Price:</div>
                  <div className="flex items-baseline">
                    <span
                      className="text-[26px] text-black"
                      style={{ fontWeight: 500 }}
                    >
                      {property.formatted_price}
                    </span>
                  </div>
                </div>
                {/* <div className="flex space-x-2">
                  <button
                    className={`flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors ${
                      isInWishlist ? "text-red-500" : ""
                    }`}
                    onClick={handleToggleWishlist}
                    disabled={wishlistLoading}
                  >
                    <Heart className="w-5 h-5" />
                    <span className="text-sm">
                      {isInWishlist
                        ? "Remove from wishlist"
                        : "Add to wishlist"}
                    </span>
                  </button>
                  <button className="p-2 border border-gray-200 rounded hover:bg-gray-50 transition-colors"></button>
                  <button className="p-2 border border-gray-200 rounded hover:bg-gray-50 transition-colors"></button>
                </div> */}
              </div>
            </div>

            {/* Agent Card (Owner Details) */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              {property && property.owner === null ? (
                <div className="text-gray-500">Owner not found</div>
              ) : ownerDetails ? (
                <>
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={
                        ownerDetails.picture
                          ? `${ownerDetails.picture}`
                          : "/owner.jpg"
                      }
                      alt={ownerDetails.user?.name || "Owner"}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide">
                        Property Owner
                      </div>
                      <h3 className="font-bold text-gray-900">
                        {ownerDetails.user?.name}
                      </h3>
                      {ownerDetails.bio && (
                        <p className="text-sm text-gray-600">
                          {ownerDetails.bio}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    {ownerDetails.phone_number && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">
                          {ownerDetails.phone_number}
                        </span>
                      </div>
                    )}
                    {ownerDetails.whatsapp_number && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Whatsapp:</span>
                        <span className="font-medium">
                          {ownerDetails.whatsapp_number}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium text-blue-600">
                        {ownerDetails.user?.email}
                      </span>
                    </div>
                  </div>
                  {ownerDetails.user_id && (
                    <a
                      href={`/owner-profile/${ownerDetails.user_id}`}
                      className="block w-full bg-yellow-500 text-black py-2 px-4 mt-4 hover:bg-yellow-600 transition-colors text-center"
                      style={{
                        fontWeight: 500,
                      }}
                    >
                      View my profile
                    </a>
                  )}
                  {/* Chat with Owner Button */}
                  <button
                    className={`mt-4 w-full bg-yellow-500  text-white font-semibold py-2 px-4 rounded-lg shadow transition-colors duration-200 flex items-center justify-center space-x-2 ${
                      !senderId ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={senderId ? toggleChat : undefined}
                    disabled={!senderId}
                    title={
                      !senderId ? "Please log in to chat with the owner." : ""
                    }
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{showChat ? "Hide Chat" : "Chat with Owner"}</span>
                    {showChat ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                  {!senderId && (
                    <div className="text-xs text-red-500 mt-2 text-center">
                      Please log in to chat with the owner.
                    </div>
                  )}
                </>
              ) : (
                <div className="text-gray-500">
                  <LoadingSpinner />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Render ChatWindow globally, fixed to bottom, only if showChat
import dynamic from "next/dynamic";
const DynamicChatWindow = dynamic(
  () => import("@/components/chat/ChatWindow"),
  { ssr: false }
);

export default function PropertyListingWrapper(props) {
  const [showChat, setShowChat] = React.useState(false);
  const params = useParams();
  const propertyId = params.id;

  // Get user from Redux global state
  const user = useSelector((state) => state.user.data);

  const [ownerDetails, setOwnerDetails] = React.useState(null);
  const [property, setProperty] = React.useState(null);

  // Fetch property data
  React.useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/ads/${propertyId}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setProperty(result.data);
      } catch (err) {
        console.error("Error fetching property:", err);
      }
    };

    fetchProperty();
  }, [propertyId]);

  // Fetch owner details
  React.useEffect(() => {
    const fetchOwnerDetails = async () => {
      if (!property?.user_id && !property?.owner?.id) return;
      try {
        const ownerId = property.owner?.id || property.user_id;
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await axios.get(
          `http://127.0.0.1:8000/api/oneowner/${ownerId}`,
          { headers }
        );
        setOwnerDetails(res.data.data);
      } catch (err) {
        setOwnerDetails(null);
      }
    };
    if (property) fetchOwnerDetails();
  }, [property]);

  // Determine the current user (sender) and the property owner (receiver)
  const senderId = user?.id;
  const ownerUserId = property?.owner?.id || ownerDetails?.user_id;
  const toggleChat = () => setShowChat((v) => !v);

  return (
    <>
      <PropertyListing
        {...props}
        toggleChat={toggleChat}
        showChat={showChat}
        senderId={senderId}
        ownerUserId={ownerUserId}
      />
      {showChat && (
        <div
          className="fixed bottom-4 left-4 z-50 transition-all duration-300 ease-in-out"
          style={{ width: "350px", height: "500px" }}
        >
          <div className="bg-white rounded-t-xl shadow border border-gray-300 overflow-hidden h-full flex flex-col">
            {/* Single Chat Header (no avatar, no online, no user id) */}
            <div className="bg-black px-4 py-3 flex items-center justify-between">
              <div className="font-semibold text-white text-base truncate">
                {ownerDetails?.user?.name || property?.owner?.name || "Owner"}
              </div>
              <button
                onClick={toggleChat}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
            {/* Chat Content */}
            <div className="flex-1 min-h-0">
              <DynamicChatWindow
                userId={senderId}
                targetUserId={ownerUserId}
                forceOpen={true}
                currentUser={user}
                targetUser={{
                  id: ownerUserId,
                  name:
                    ownerDetails?.user?.name ||
                    property?.owner?.name ||
                    "Owner",
                }}
                customStyles={{
                  popupStyle: {
                    position: "static",
                    boxShadow: "none",
                    borderRadius: 0,
                    width: "100%",
                    height: "100%",
                    minHeight: 0,
                    maxHeight: "100%",
                    background: "transparent",
                    border: "none",
                  },
                  bubbleButtonStyle: { display: "none" },
                }}
                onClose={toggleChat}
                hideHeader={true}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
