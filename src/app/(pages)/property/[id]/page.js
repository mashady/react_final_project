"use client";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Toast from "./components/Toast";
import FormError from "./components/FormError";
import LoadingButton from "./components/LoadingButton";
import ImageCarousel from "./components/ImageCarousel";
import PropertyDetails from "./components/PropertyDetails";
import ReviewList from "./components/ReviewList";
import ReviewForm from "./components/ReviewForm";
import ContactForm from "./components/ContactForm";
import MortgageCalculator from "./components/MortgageCalculator";
import Tabs from "./components/Tabs";
import { Heart, Share2, MapPin, User, AlertCircle, Loader2 } from "lucide-react";

function useToast() {
  const [toasts, setToasts] = useState([]);
  const showToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };
  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };
  return { toasts, showToast, removeToast };
}

const DynamicPropertyListing = () => {
  const { id } = useParams();
  const { toasts, showToast, removeToast } = useToast();

  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("schedule");
  const [images, setImages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Form states
  const [reviewForm, setReviewForm] = useState({
    comment: "",
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");

  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submittingContact, setSubmittingContact] = useState(false);
  const [contactError, setContactError] = useState("");

  const [calculatorInputs] = useState({
    downPayment: 20,
    loanTerm: 30,
    interestRate: 5.5,
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setCurrentUser({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isLoggedIn: true,
          isAdmin: user.role === "admin",
        });
      } catch (err) {
        console.error("Error parsing user data:", err);
        showToast("Error loading user data", "error");
      }
    }
  }, []);

  const refetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const token = localStorage.getItem("token");
      const reviewsResponse = await axios.get(
        `http://127.0.0.1:8000/api/ads/${id}/reviews`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReviews(reviewsResponse.data?.data || []);
    } catch (error) {
      console.error("Failed to refetch reviews:", error);
      showToast("Failed to load reviews", "error");
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    const fetchPropertyAndReviews = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const propertyResponse = await axios.get(
          `http://127.0.0.1:8000/api/ads/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const propertyData = propertyResponse.data?.data;
        setProperty(propertyData);

        if (propertyData?.media) {
          setImages(propertyData.media.map((m) => m.url));
        }

        await refetchReviews();
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to load property data";
        setError(errorMessage);
        showToast(errorMessage, "error");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPropertyAndReviews();
    }
  }, [id]);

  useEffect(() => {
    console.log("Reviews state updated:", reviews);
  }, [reviews]);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  const goToSlide = (index) => {
    setCurrentImageIndex(index);
  };

  const goToPrevious = () => {
    setCurrentImageIndex(
      currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex(
      currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1
    );
  };

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
      const reviewData = {
        ad_id: property.id,
        content: reviewForm.comment.trim(),
      };

      const token = localStorage.getItem("token");
      if (!token) {
        setReviewError("Authentication required. Please log in again.");
        return;
      }

      console.log("Submitting review:", reviewData);

      const response = await axios.post(
        `http://127.0.0.1:8000/api/reviews`,
        reviewData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Review submission response:", response.data);

      setReviewForm({ comment: "" });

      if (response.data?.data) {
        const apiReview = response.data.data;

        const newReview = {
          id: apiReview.id || Date.now(),
          content: apiReview.content || reviewForm.comment.trim(),
          created_at:
            apiReview.created_at ||
            new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
          user: apiReview.user || {
            id: currentUser.id,
            name: currentUser.name,
          },
          ad_id: apiReview.ad_id || property.id,
          ...apiReview,
        };

        console.log("Adding new review:", newReview);

        setReviews((prevReviews) => {
          const updatedReviews = [newReview, ...prevReviews];
          console.log("Updated reviews list:", updatedReviews);
          return updatedReviews;
        });

        showToast("Review submitted successfully!", "success");
      } else {
        console.warn(
          "API didn't return review data, refetching all reviews..."
        );
        await refetchReviews();
        showToast("Review submitted successfully!", "success");
      }
    } catch (error) {
      console.error("Review submission error:", error);
      if (error.response?.status === 401) {
        setReviewError("Session expired. Please log in again.");
      } else {
        const errorMessage =
          error.response?.data?.message || "Failed to submit review";
        setReviewError(errorMessage);
        showToast(errorMessage, "error");
      }
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!currentUser) {
      showToast("Please log in to delete a review", "warning");
      return;
    }

    if (!confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showToast("Authentication required. Please log in again.", "error");
        return;
      }

      setReviews((prevReviews) =>
        prevReviews.filter((review) => review.id !== reviewId)
      );

      await axios.delete(`http://127.0.0.1:8000/api/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      showToast("Review deleted successfully!", "success");
    } catch (error) {
      console.error("Delete review error:", error);

      await refetchReviews();

      if (error.response?.status === 401) {
        showToast("Session expired. Please log in again.", "error");
      } else {
        const errorMessage =
          error.response?.data?.message || "Failed to delete review";
        showToast(errorMessage, "error");
      }
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactError("");

    if (!currentUser) {
      setContactError("Please log in to send a message");
      return;
    }

    if (
      !contactForm.name.trim() ||
      !contactForm.email.trim() ||
      !contactForm.message.trim()
    ) {
      setContactError("Please fill in all fields");
      return;
    }

    try {
      setSubmittingContact(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setContactError("Authentication required. Please log in again.");
        return;
      }

      await axios.post(
        `http://127.0.0.1:8000/api/contact`,
        {
          ...contactForm,
          ad_id: property.id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      showToast("Message sent successfully!", "success");
      setContactForm({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to send message. Please try again.";
      setContactError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setSubmittingContact(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="animate-spin" size={24} />
          <span>Loading property...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex items-center space-x-2 text-red-600">
          <AlertCircle size={24} />
          <span>Error: {error}</span>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Property not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Toast Container */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
      <ImageCarousel
        images={images}
        currentImageIndex={currentImageIndex}
        setCurrentImageIndex={setCurrentImageIndex}
      />
      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <PropertyDetails property={property} />
            {/* Property features, description, etc. can be further split if needed */}
            {/* Reviews Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Reviews ({reviews.length})
                </h2>
              </div>
              {reviewsLoading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="animate-spin" size={16} />
                  <span className="text-gray-600">Loading reviews...</span>
                </div>
              ) : (
                <ReviewList reviews={reviews} />
              )}
              {/* Review Form */}
              <div className="border-t pt-8 mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Leave a Review
                </h3>
                <ReviewForm
                  reviewForm={reviewForm}
                  setReviewForm={setReviewForm}
                  submittingReview={submittingReview}
                  reviewError={reviewError}
                  onSubmit={handleReviewSubmit}
                />
              </div>
            </div>
          </div>
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card, Agent Card, etc. can be further split if needed */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Price:
                  </h3>
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold text-gray-900">
                      {property.formatted_price}
                    </span>
                    {property.status === "rent" && (
                      <span className="text-sm text-gray-600 ml-1">/month</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  <Heart size={16} />
                  <span>Add to wishlist</span>
                </button>
                <div className="flex items-center space-x-3">
                  <button className="p-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                    <span className="text-lg font-bold">+</span>
                  </button>
                  <button className="p-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                    <Share2 size={16} />
                  </button>
                </div>
              </div>
            </div>
            {/* Agent Card, Schedule Tour, etc. can be further split if needed */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Schedule tour
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Tellus sollicitudin cursus est, ut, ut dapibus fermentum.
                Praesent dignissim.
              </p>
              <ContactForm
                contactForm={contactForm}
                setContactForm={setContactForm}
                submittingContact={submittingContact}
                contactError={contactError}
                onSubmit={handleContactSubmit}
              />
            </div>
            <MortgageCalculator calculatorInputs={calculatorInputs} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DynamicPropertyListing;
