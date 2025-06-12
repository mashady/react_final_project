"use client";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import {
  Heart,
  Share2,
  MapPin,
  User,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  CheckCircle,
  X,
  AlertTriangle,
  Info,
} from "lucide-react";
import axios from "axios";

// Toast Component
const Toast = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Allow fade out animation
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getToastStyles = () => {
    const baseStyles =
      "fixed top-4 right-4 z-50 max-w-sm w-full bg-white border-l-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out";

    if (!isVisible) return `${baseStyles} translate-x-full opacity-0`;

    switch (type) {
      case "success":
        return `${baseStyles} border-green-500`;
      case "error":
        return `${baseStyles} border-red-500`;
      case "warning":
        return `${baseStyles} border-yellow-500`;
      case "info":
        return `${baseStyles} border-blue-500`;
      default:
        return `${baseStyles} border-gray-500`;
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "info":
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className={getToastStyles()}>
      <div className="flex items-start p-4">
        <div className="flex-shrink-0 mr-3">{getIcon()}</div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">{message}</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="flex-shrink-0 ml-3 text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Toast Manager Hook
const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return { toasts, showToast, removeToast };
};

// Form Error Component
const FormError = ({ message, onClose }) => (
  <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
    <AlertCircle className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
    <span className="text-sm text-red-700 flex-1">{message}</span>
    {onClose && (
      <button
        onClick={onClose}
        className="text-red-500 hover:text-red-700 ml-2"
      >
        <X className="w-4 h-4" />
      </button>
    )}
  </div>
);

// Loading Button Component
const LoadingButton = ({ loading, children, className, ...props }) => (
  <button
    className={`flex items-center justify-center ${className}`}
    disabled={loading}
    {...props}
  >
    {loading && <Loader2 className="animate-spin mr-2" size={16} />}
    {children}
  </button>
);

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

      <div className="relative w-full h-96">
        <img
          src={images[currentImageIndex]}
          alt={`${property?.title || "Property"} view ${currentImageIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-500"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:bg-white transition-all duration-200 shadow-lg"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:bg-white transition-all duration-200 shadow-lg"
            >
              <ChevronRight size={20} />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentImageIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentImageIndex + 1} / {images.length}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {property.title}
            </h1>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {property.formatted_price}
            </div>
            <div className="text-gray-600 flex items-center space-x-4 mb-2">
              <span>For {property.status === "rent" ? "rent" : "sale"}</span>
              <span>•</span>
              <span className="capitalize">{property.type}</span>
              <span>•</span>
              <span>{property.space} m²</span>
              {property.price_per_sqm && (
                <>
                  <span>•</span>
                  <span>{property.price_per_sqm}</span>
                </>
              )}
            </div>
            {property.location && (
              <div className="flex items-center text-gray-600 mt-2">
                <MapPin size={16} className="mr-1" />
                <span>{property.location}</span>
              </div>
            )}
            <div className="flex items-center space-x-4 mt-4 font-[500] text-[45px]">
              Description
            </div>
            <div className="text-gray-600 leading-relaxed mt-4">
              <p>{property.description}</p>
            </div>

            {/* Property Details */}
            <div className="mb-8 mt-8">
              <h2 className="font-semibold text-xl mb-4">Property features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Type:</span>
                    <span className="text-gray-900 capitalize">
                      {property.type}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Space:</span>
                    <span className="text-gray-900">{property.space} m²</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span className="text-gray-900 capitalize">
                      {property.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Listed:</span>
                    <span className="text-gray-900">
                      {property.created_at_human}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Price per m²:</span>
                    <span className="text-gray-900">
                      {property.price_per_sqm || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Media Count:</span>
                    <span className="text-gray-900">
                      {property.media_count?.total || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="text-gray-900">
                      {property.updated_at_human}
                    </span>
                  </div>
                </div>
              </div>
            </div>

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
                <>
                  {reviews.length === 0 ? (
                    <div className="text-gray-500 py-4">No reviews yet.</div>
                  ) : (
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review.id} className="flex space-x-4 mb-6">
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                            <User size={20} className="text-gray-500" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <h4 className="font-semibold text-gray-900">
                                  {review.user?.name || "Anonymous"}
                                </h4>
                              </div>
                              {currentUser &&
                                (review.user?.id === currentUser.id ||
                                  currentUser.role === "admin") && (
                                  <button
                                    onClick={() =>
                                      handleDeleteReview(review.id)
                                    }
                                    className="text-red-500 hover:text-red-700 text-sm"
                                  >
                                    Delete
                                  </button>
                                )}
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed">
                              {review.content}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {review.created_at}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div className="text-gray-500 text-sm">
                        Showing {reviews.length} review(s)
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Review Form */}
              <div className="border-t pt-8 mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Leave a Review
                </h3>
                <div className="space-y-4">
                  {reviewError && (
                    <FormError
                      message={reviewError}
                      onClose={() => setReviewError("")}
                    />
                  )}
                  <div>
                    <textarea
                      value={reviewForm.comment}
                      onChange={(e) =>
                        setReviewForm({ comment: e.target.value })
                      }
                      placeholder="Your Comment *"
                      rows={6}
                      className="w-full px-3 py-3 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      required
                    />
                  </div>
                  <div>
                    <LoadingButton
                      type="button"
                      onClick={handleReviewSubmit}
                      loading={submittingReview}
                      className="bg-yellow-400 text-gray-900 py-3 px-8 rounded font-medium hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!reviewForm.comment.trim()}
                    >
                      {submittingReview ? "Posting..." : "Post Review"}
                    </LoadingButton>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
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
                  <button className="p-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="6,9 6,2 18,2 18,9"></polyline>
                      <path d="M6,18H4a2,2,0,0,1-2-2V11a2,2,0,0,1,2-2H20a2,2,0,0,1,2,2v5a2,2,0,0,1-2,2H18"></path>
                      <rect x="6" y="14" width="12" height="8"></rect>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            {/* Agent Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <User size={24} className="text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    NEW HOME
                  </p>
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">
                    Rachel Gray
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    569 7th Ave, New York, NY 10018, USA
                  </p>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Office phone:</span>
                      <span className="text-gray-900">+1(844)6557</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mobile phone:</span>
                      <span className="text-gray-900">+777 844 2222</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Whatsapp, Viber phone:
                      </span>
                      <span className="text-gray-900">77777444222</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="text-gray-900">
                        rachelgray@example.com
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <button className="w-full bg-yellow-400 text-gray-900 py-3 px-4 rounded font-medium hover:bg-yellow-500 transition-colors mb-4">
                View my properties
              </button>
            </div>

            {/* Schedule Tour Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Schedule tour
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Tellus sollicitudin cursus est, ut, ut dapibus fermentum.
                Praesent dignissim.
              </p>

              <form onSubmit={handleContactSubmit} className="space-y-4">
                {contactError && (
                  <FormError
                    message={contactError}
                    onClose={() => setContactError("")}
                  />
                )}

                <div>
                  <input
                    type="text"
                    placeholder="Your name*"
                    value={contactForm.name}
                    onChange={(e) =>
                      setContactForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <input
                    type="email"
                    placeholder="Your email*"
                    value={contactForm.email}
                    onChange={(e) =>
                      setContactForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    placeholder="Your phone*"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  />
                </div>

                <div>
                  <textarea
                    rows={4}
                    placeholder="Message"
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm((prev) => ({
                        ...prev,
                        message: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none"
                    required
                  />
                </div>

                <LoadingButton
                  type="submit"
                  loading={submittingContact}
                  className="w-full bg-yellow-400 text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingContact ? "Sending..." : "Make enquiry"}
                </LoadingButton>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DynamicPropertyListing;
