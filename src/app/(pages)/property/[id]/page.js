"use client";
import React, { useState, useEffect } from "react";
import {
  MapPin,
  Calendar,
  Calculator,
  Phone,
  Mail,
  User,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Home,
  Square,
  Clock,
} from "lucide-react";

export default function PropertyListingPage() {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [tourForm, setTourForm] = useState({
    date: "",
    time: "",
    message: "",
  });

  const fallbackImages = [
    "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=800&h=600&fit=crop",
  ];

  useEffect(() => {
    fetchProperty();
  }, []);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:8000/api/ads/15");
      if (!response.ok) {
        throw new Error("Failed to fetch property data");
      }
      const result = await response.json();
      setProperty(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const images =
    property?.media
      ?.filter((item) => item.type === "image")
      ?.map((item) => item.url) || fallbackImages;

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    console.log("Contact form submitted:", contactForm);
  };

  const handleTourSubmit = (e) => {
    e.preventDefault();
    console.log("Tour form submitted:", tourForm);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={fetchProperty}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="text-xl font-semibold">Property Listing</div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-800">Login</button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
              Sign Up
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Property Title and Status */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900">
              {property.title}
            </h1>
            <div className="flex items-center space-x-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  property.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : property.status === "published"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {property.status.charAt(0).toUpperCase() +
                  property.status.slice(1)}
              </span>
            </div>
          </div>
          <div className="flex items-center text-gray-600 space-x-4">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{property.location}</span>
            </div>
            <div className="flex items-center">
              <Home className="w-4 h-4 mr-1" />
              <span className="capitalize">{property.type}</span>
            </div>
            <div className="flex items-center">
              <Square className="w-4 h-4 mr-1" />
              <span>{property.space} m²</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{property.created_at_human}</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-3xl font-bold text-green-600">
              {property.formatted_price}
            </span>
            <span className="text-lg text-gray-600 ml-2">
              ({property.price_per_sqm})
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Image Carousel */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
              <div className="relative">
                <img
                  src={images[activeImageIndex]}
                  alt={property.title}
                  className="w-full h-96 object-cover"
                />

                {/* Carousel Navigation */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                  {activeImageIndex + 1} / {images.length}
                </div>

                {/* Thumbnail Navigation */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          activeImageIndex === index
                            ? "bg-white"
                            : "bg-white bg-opacity-50"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {property.description ||
                  "No description available for this property."}
              </p>
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Property Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900">Type</h3>
                  <p className="text-gray-700 capitalize">{property.type}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900">Space</h3>
                  <p className="text-gray-700">{property.space} m²</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900">Price per m²</h3>
                  <p className="text-gray-700">{property.price_per_sqm}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900">Status</h3>
                  <p className="text-gray-700 capitalize">{property.status}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900">Listed</h3>
                  <p className="text-gray-700">{property.created_at_human}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900">Updated</h3>
                  <p className="text-gray-700">{property.updated_at_human}</p>
                </div>
              </div>
            </div>

            {/* Media Information */}
            {property.media_count && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">Media</h2>
                <div className="flex space-x-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {property.media_count.total}
                    </div>
                    <div className="text-sm text-gray-600">Total Media</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {property.media_count.images}
                    </div>
                    <div className="text-sm text-gray-600">Images</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {property.media_count.videos}
                    </div>
                    <div className="text-sm text-gray-600">Videos</div>
                  </div>
                </div>
              </div>
            )}

            {/* Location */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Location</h2>
              <div className="flex items-center mb-4">
                <MapPin className="w-5 h-5 text-gray-500 mr-2" />
                <span className="text-gray-700">{property.location}</span>
              </div>
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Interactive Map</p>
                  <p className="text-sm text-gray-400">
                    Map integration coming soon
                  </p>
                </div>
              </div>
            </div>

            {/* Leave a Reply */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Leave a Reply</h2>
              <p className="text-gray-600 mb-4">
                Your email address will not be published. Required fields are
                marked *
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Comment *
                  </label>
                  <textarea
                    rows="4"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your comment..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <input
                      type="url"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <button className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                  Post Comment
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Price Summary */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Price Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Price:</span>
                  <span className="font-semibold text-lg">
                    {property.formatted_price}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price per m²:</span>
                  <span className="font-medium">{property.price_per_sqm}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Space:</span>
                  <span className="font-medium">{property.space} m²</span>
                </div>
              </div>
            </div>

            {/* Agent Details */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                  <User className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Property Agent</h3>
                  <p className="text-sm text-gray-600">
                    Real Estate Professional
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-sm">+20 123 456 789</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-sm">agent@realestate.com</span>
                </div>
              </div>
              <button className="w-full bg-orange-500 text-white py-2 rounded-lg mt-4 hover:bg-orange-600 transition-colors">
                Contact Agent
              </button>
            </div>

            {/* Schedule Tour */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Schedule Tour</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred date
                  </label>
                  <input
                    type="date"
                    value={tourForm.date}
                    onChange={(e) =>
                      setTourForm({ ...tourForm, date: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred time
                  </label>
                  <select
                    value={tourForm.time}
                    onChange={(e) =>
                      setTourForm({ ...tourForm, time: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select time</option>
                    <option value="9:00 AM">9:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="2:00 PM">2:00 PM</option>
                    <option value="3:00 PM">3:00 PM</option>
                    <option value="4:00 PM">4:00 PM</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    rows="3"
                    value={tourForm.message}
                    onChange={(e) =>
                      setTourForm({ ...tourForm, message: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Additional message..."
                  />
                </div>
                <button
                  onClick={handleTourSubmit}
                  className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Request Tour
                </button>
              </div>
            </div>

            {/* Mortgage Calculator */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">
                Mortgage Calculator
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Home price
                  </label>
                  <input
                    type="text"
                    defaultValue={property.formatted_price}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Down payment (%)
                  </label>
                  <input
                    type="number"
                    placeholder="20"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Interest rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="12.5"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors">
                  Calculate Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
