"use client";
import React, { useState, useCallback, useEffect } from "react";
import {
  ChevronDown,
  Upload,
  X,
  Image as ImageIcon,
  Video,
} from "lucide-react";

export default function CompletePropertyForm() {
  const [formData, setFormData] = useState({
    // API fields
    title: "",
    type: "apartment",
    description: "",
    price: "",
    location: "",
    space: "",
    media: [],
    // Additional form fields (kept for UI completeness)
    propertyId: "",
    propertyStatus: "Buy",
    displayLayout: "Default",
    bedrooms: "",
    bathrooms: "",
    propertyExcerpt: "",
    address: "",
    city: "Brooklyn",
    stateCountry: "",
    locationMap: "",
    videoUrl: "",
    virtualTourUrl: "",
    galleryImages: [],
    videoFile: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif"];
  const ALLOWED_VIDEO_TYPES = ["video/mp4"];
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/ads";

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      formData.galleryImages.forEach((file) => URL.revokeObjectURL(file));
      if (formData.videoFile) {
        URL.revokeObjectURL(formData.videoFile);
      }
    };
  }, [formData.galleryImages, formData.videoFile]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.type) newErrors.type = "Type is required";
    if (!formData.price || isNaN(Number(formData.price)))
      newErrors.price = "Valid price is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.stateCountry.trim())
      newErrors.stateCountry = "State/Country is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setSubmitStatus({
        type: "error",
        message: "Please fix the errors in the form before submitting.",
      });
    }
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleMultipleFilesChange = (e) => {
    const files = Array.from(e.target.files).filter((file) => {
      if (
        !ALLOWED_IMAGE_TYPES.includes(file.type) &&
        !ALLOWED_VIDEO_TYPES.includes(file.type)
      ) {
        setErrors((prev) => ({
          ...prev,
          media: `Unsupported file type: ${file.name}. Only images (JPEG, PNG, GIF) and MP4 videos are allowed.`,
        }));
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        setErrors((prev) => ({
          ...prev,
          media: `File ${file.name} exceeds 10MB limit.`,
        }));
        return false;
      }
      return true;
    });

    if (files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        galleryImages: [...prev.galleryImages, ...files],
        media: [...prev.media, ...files],
      }));
      setErrors((prev) => ({ ...prev, media: null }));
    }
  };

  const handleUploadGallery = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = "image/*,video/*";
    input.onchange = handleMultipleFilesChange;
    input.click();
  };

  const handleRemoveGallery = (index) => {
    setFormData((prev) => {
      const newGallery = [...prev.galleryImages];
      const newMedia = [...prev.media];
      const fileToRemove = newGallery[index];

      URL.revokeObjectURL(fileToRemove);
      newGallery.splice(index, 1);
      const mediaIndex = newMedia.findIndex((file) => file === fileToRemove);
      if (mediaIndex !== -1) {
        newMedia.splice(mediaIndex, 1);
      }

      return {
        ...prev,
        galleryImages: newGallery,
        media: newMedia,
      };
    });
  };

  const handleUploadVideo = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "video/mp4";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
          setErrors((prev) => ({
            ...prev,
            videoFile: "Only MP4 videos are allowed.",
          }));
          return;
        }
        if (file.size > MAX_FILE_SIZE) {
          setErrors((prev) => ({
            ...prev,
            videoFile: `Video file exceeds 10MB limit.`,
          }));
          return;
        }
        setFormData((prev) => ({
          ...prev,
          videoFile: file,
          media: [...prev.media, file],
        }));
        setErrors((prev) => ({ ...prev, videoFile: null }));
      }
    };
    input.click();
  };

  const handleRemoveVideo = () => {
    if (formData.videoFile) {
      URL.revokeObjectURL(formData.videoFile);
      setFormData((prev) => ({
        ...prev,
        videoFile: null,
        media: prev.media.filter((file) => file !== prev.videoFile),
      }));
    }
  };

  const handleResetMarker = () => {
    setFormData((prev) => ({ ...prev, locationMap: "" }));
  };

  const handleResetForm = () => {
    formData.galleryImages.forEach((file) => URL.revokeObjectURL(file));
    if (formData.videoFile) {
      URL.revokeObjectURL(formData.videoFile);
    }
    setFormData({
      title: "",
      type: "apartment",
      description: "",
      price: "",
      location: "",
      space: "",
      media: [],
      propertyId: "",
      propertyStatus: "Buy",
      displayLayout: "Default",
      bedrooms: "",
      bathrooms: "",
      propertyExcerpt: "",
      address: "",
      city: "Brooklyn",
      stateCountry: "",
      locationMap: "",
      videoUrl: "",
      virtualTourUrl: "",
      galleryImages: [],
      videoFile: null,
    });
    setErrors({});
    setSubmitStatus(null);
  };

  const moveImage = useCallback((fromIndex, toIndex) => {
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return;
    setFormData((prev) => {
      const newGallery = [...prev.galleryImages];
      const newMedia = [...prev.media];

      const [removedGallery] = newGallery.splice(fromIndex, 1);
      const [removedMedia] = newMedia.splice(fromIndex, 1);

      newGallery.splice(toIndex, 0, removedGallery);
      newMedia.splice(toIndex, 0, removedMedia);

      return {
        ...prev,
        galleryImages: newGallery,
        media: newMedia,
      };
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("type", formData.type);
      submitData.append("description", formData.description || "");
      submitData.append("price", formData.price); // Send as string to match API

      if (formData.space) {
        submitData.append("space", formData.space); // Send as string
      }
      formData.media.forEach((file) => {
        submitData.append("media[]", file);
      });

      const response = await fetch(API_URL, {
        method: "POST",
        body: submitData,
      });

      if (response.ok) {
        const result = await response.json();
        setSubmitStatus({
          type: "success",
          message: `Property listing "${result.data.title}" created successfully! Price: ${result.data.formatted_price}, Created: ${result.data.created_at_human}`,
        });
        handleResetForm();
      } else {
        const errorData = await response.json().catch(() => ({}));
        setSubmitStatus({
          type: "error",
          message: `Failed to create property listing: ${
            errorData.message || response.statusText
          }`,
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message:
          "Network error. Please check if the API server is running and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-black mb-2">
          Add New Property
        </h1>
        <p className="text-sm text-gray-600">
          You can create new properties by filling out the fields below.
        </p>
      </div>

      {submitStatus && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            submitStatus.type === "success"
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          {submitStatus.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Property Info Section */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h2 className="text-sm font-medium text-black flex items-center">
              <span className="w-4 h-4 border border-orange-500 text-orange-500 rounded-full flex items-center justify-center text-xs mr-2">
                i
              </span>
              Property Info
            </h2>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-black mb-1">
                  Property Title: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  aria-label="Property Title"
                  aria-invalid={!!errors.title}
                  className={`w-full px-3 py-2 text-sm border ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  } rounded focus:outline-none focus:border-blue-500`}
                />
                {errors.title && (
                  <p className="text-xs text-red-500 mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-black mb-1">
                  Property ID:
                </label>
                <input
                  type="text"
                  name="propertyId"
                  value={formData.propertyId}
                  onChange={handleInputChange}
                  aria-label="Property ID"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-black mb-1">
                  Property Type: <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                    aria-label="Property Type"
                    className={`w-full px-3 py-2 text-sm border ${
                      errors.type ? "border-red-500" : "border-gray-300"
                    } rounded focus:outline-none focus:border-blue-500 appearance-none bg-white text-gray-600`}
                  >
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="commercial">Commercial</option>
                    <option value="land">Land</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                {errors.type && (
                  <p className="text-xs text-red-500 mt-1">{errors.type}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-black mb-1">
                  Property status:
                </label>
                <div className="relative">
                  <select
                    name="propertyStatus"
                    value={formData.propertyStatus}
                    onChange={handleInputChange}
                    aria-label="Property Status"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 appearance-none bg-white text-gray-600"
                  >
                    <option value="Buy">Buy</option>
                    <option value="Rent">Rent</option>
                    <option value="Sold">Sold</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-black mb-1">
                  Display layout:
                </label>
                <div className="relative">
                  <select
                    name="displayLayout"
                    value={formData.displayLayout}
                    onChange={handleInputChange}
                    aria-label="Display Layout"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 appearance-none bg-white text-gray-600"
                  >
                    <option value="Default">Default</option>
                    <option value="Grid">Grid</option>
                    <option value="List">List</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-black mb-1">
                  Property Space (sq ft):
                </label>
                <input
                  type="number"
                  name="space"
                  value={formData.space}
                  onChange={handleInputChange}
                  min="0"
                  aria-label="Property Space"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-black mb-1">
                  Number of bedrooms:
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  min="0"
                  aria-label="Number of Bedrooms"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-black mb-1">
                  Number of bathrooms:
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  min="0"
                  step="0.5"
                  aria-label="Number of Bathrooms"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-black mb-1">
                Property Description:
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                aria-label="Property Description"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-black mb-1">
                Property excerpt:{" "}
                <span className="text-gray-500 font-normal">Shown on list</span>
              </label>
              <textarea
                name="propertyExcerpt"
                value={formData.propertyExcerpt}
                onChange={handleInputChange}
                rows={2}
                aria-label="Property Excerpt"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Price Settings Section */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h2 className="text-sm font-medium text-black flex items-center">
              <span className="w-4 h-4 border border-orange-500 text-orange-500 rounded-full flex items-center justify-center text-xs mr-2">
                $
              </span>
              Price settings
            </h2>
          </div>

          <div className="p-6">
            <div className="max-w-xs">
              <label className="block text-xs font-medium text-black mb-1">
                Price: <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                aria-label="Price"
                aria-invalid={!!errors.price}
                className={`w-full px-3 py-2 text-sm border ${
                  errors.price ? "border-red-500" : "border-gray-300"
                } rounded focus:outline-none focus:border-blue-500`}
              />
              {errors.price && (
                <p className="text-xs text-red-500 mt-1">{errors.price}</p>
              )}
            </div>
          </div>
        </div>

        {/* Location Settings Section */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h2 className="text-sm font-medium text-black flex items-center">
              <span className="w-4 h-4 border border-orange-500 text-orange-500 rounded-full flex items-center justify-center text-xs mr-2">
                📍
              </span>
              Location Settings
            </h2>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-black mb-1">
                  Address: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  aria-label="Address"
                  aria-invalid={!!errors.address}
                  className={`w-full px-3 py-2 text-sm border ${
                    errors.address ? "border-red-500" : "border-gray-300"
                  } rounded focus:outline-none focus:border-blue-500`}
                />
                {errors.address && (
                  <p className="text-xs text-red-500 mt-1">{errors.address}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-black mb-1">
                  City:
                </label>
                <div className="relative">
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    aria-label="City"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 appearance-none bg-white text-gray-600"
                  >
                    <option value="Brooklyn">Brooklyn</option>
                    <option value="Manhattan">Manhattan</option>
                    <option value="Queens">Queens</option>
                    <option value="Bronx">Bronx</option>
                    <option value="Staten Island">Staten Island</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-black mb-1">
                  State/Country: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="stateCountry"
                  value={formData.stateCountry}
                  onChange={handleInputChange}
                  required
                  aria-label="State or Country"
                  aria-invalid={!!errors.stateCountry}
                  className={`w-full px-3 py-2 text-sm border ${
                    errors.stateCountry ? "border-red-500" : "border-gray-300"
                  } rounded focus:outline-none focus:border-blue-500`}
                />
                {errors.stateCountry && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.stateCountry}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-black mb-1">
                Location: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                placeholder="Enter location for API"
                aria-label="Location"
                aria-invalid={!!errors.location}
                className={`w-full px-3 py-2 text-sm border ${
                  errors.location ? "border-red-500" : "border-gray-300"
                } rounded focus:outline-none focus:border-blue-500`}
              />
              {errors.location && (
                <p className="text-xs text-red-500 mt-1">{errors.location}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-black mb-1">
                Location on map:
              </label>
              <p className="text-xs text-blue-500 mb-2">
                If you wish to display an approximate location, simply input the
                street name only, without including the street number
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="locationMap"
                  value={formData.locationMap}
                  onChange={handleInputChange}
                  placeholder="Enter a location"
                  aria-label="Location on Map"
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleResetMarker}
                  aria-label="Reset Map Marker"
                  className="px-4 py-2 text-xs text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 rounded"
                >
                  Reset Marker
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Image Gallery Settings Section */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h2 className="text-sm font-medium text-black flex items-center">
              <span className="w-4 h-4 border border-orange-500 text-orange-500 rounded-full flex items-center justify-center text-xs mr-2">
                📷
              </span>
              Media Gallery (API: media[])
            </h2>
          </div>

          <div className="p-6">
            <div className="mb-4">
              <label className="block text-xs font-medium text-black mb-2">
                Upload media files (images/videos):
              </label>
              <p className="text-xs text-blue-500 mb-4">
                Upload images and videos that will be sent to the API. The first
                image will be displayed in lists. Drag & drop or use buttons to
                rearrange
              </p>

              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={handleUploadGallery}
                  aria-label="Upload Media Files"
                  className="flex items-center gap-1 px-3 py-2 text-xs text-blue-600 bg-white border border-blue-600 rounded hover:bg-blue-50"
                >
                  <Upload className="w-3 h-3" />
                  Upload Media
                </button>
                {formData.galleryImages.length > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        galleryImages: [],
                        media: prev.media.filter(
                          (file) => file !== prev.videoFile
                        ),
                      }))
                    }
                    aria-label="Remove All Media"
                    className="flex items-center gap-1 px-3 py-2 text-xs text-red-600 bg-white border border-red-600 rounded hover:bg-red-50"
                  >
                    Remove All
                  </button>
                )}
              </div>
              {errors.media && (
                <p className="text-xs text-red-500 mt-1">{errors.media}</p>
              )}

              {formData.galleryImages.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {formData.galleryImages.map((file, index) => (
                    <div
                      key={index}
                      className="relative group border rounded-md overflow-hidden"
                      draggable
                      onDragStart={(e) =>
                        e.dataTransfer.setData("text/plain", index)
                      }
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const fromIndex = parseInt(
                          e.dataTransfer.getData("text/plain")
                        );
                        moveImage(fromIndex, index);
                      }}
                    >
                      <div className="aspect-square bg-gray-100 flex items-center justify-center">
                        {file.type.startsWith("image/") ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <Video className="w-8 h-8 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => handleRemoveGallery(index)}
                          aria-label={`Remove media ${index + 1}`}
                          className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="absolute bottom-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => moveImage(index, index - 1)}
                          disabled={index === 0}
                          aria-label={`Move media ${index + 1} up`}
                          className="p-1 bg-blue-500 text-white rounded disabled:opacity-50"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => moveImage(index, index + 1)}
                          disabled={index === formData.galleryImages.length - 1}
                          aria-label={`Move media ${index + 1} down`}
                          className="p-1 bg-blue-500 text-white rounded disabled:opacity-50"
                        >
                          ↓
                        </button>
                      </div>
                      <div className="absolute top-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-500">
                    No media files uploaded yet
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Click "Upload Media" to add images and videos
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Video Upload Section */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h2 className="text-sm font-medium text-black flex items-center">
              <span className="w-4 h-4 border border-orange-500 text-orange-500 rounded-full flex items-center justify-center text-xs mr-2">
                🎥
              </span>
              Video & Virtual Tour
            </h2>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-black mb-1">
                Video URL:
              </label>
              <input
                type="url"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleInputChange}
                placeholder="https://www.youtube.com/watch?v=..."
                aria-label="Video URL"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-black mb-1">
                Virtual Tour URL:
              </label>
              <input
                type="url"
                name="virtualTourUrl"
                value={formData.virtualTourUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/virtual-tour/..."
                aria-label="Virtual Tour URL"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-black mb-2">
                Upload Video File:
              </label>
              <p className="text-xs text-blue-500 mb-4">
                Upload a video file (MP4 format) to include in the media gallery
              </p>
              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={handleUploadVideo}
                  aria-label="Upload Video File"
                  className="flex items-center gap-1 px-3 py-2 text-xs text-blue-600 bg-white border border-blue-600 rounded hover:bg-blue-50"
                >
                  <Upload className="w-3 h-3" />
                  Upload Video
                </button>
                {formData.videoFile && (
                  <button
                    type="button"
                    onClick={handleRemoveVideo}
                    aria-label="Remove Video File"
                    className="flex items-center gap-1 px-3 py-2 text-xs text-red-600 bg-white border border-red-600 rounded hover:bg-red-50"
                  >
                    <X className="w-3 h-3" />
                    Remove Video
                  </button>
                )}
              </div>
              {errors.videoFile && (
                <p className="text-xs text-red-500 mt-1">{errors.videoFile}</p>
              )}
              {formData.videoFile ? (
                <div className="relative border rounded-md overflow-hidden max-w-sm">
                  <video
                    src={URL.createObjectURL(formData.videoFile)}
                    controls
                    className="w-full h-48 object-cover"
                    aria-label="Video Preview"
                  />
                  <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                    Video
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-500">
                    No video file uploaded yet
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Click "Upload Video" to add a video
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Form Submission Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleResetForm}
            aria-label="Reset Form"
            className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            Reset Form
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            aria-label="Submit Property"
            className={`px-4 py-2 text-sm text-white rounded ${
              isSubmitting
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Property"}
          </button>
        </div>
      </form>
    </div>
  );
}
