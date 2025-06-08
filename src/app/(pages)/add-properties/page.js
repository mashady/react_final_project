'use client'
import React, { use, useState } from 'react';
import { ChevronDown, Upload } from 'lucide-react';

export default function CompletePropertyForm() {
  const [formData, setFormData] = useState({
    // Property Info
    propertyName: '',
    propertyId: '',
    propertyCategory: 'Apartments',
    propertyStatus: 'Buy',
    displayLayout: 'Default',
    propertySize: '',
    bedrooms: '',
    bathrooms: '',
    propertyDescription: '',
    propertyExcerpt: '',
    
    // Price Settings
    price: '',
    oldPrice: '',
    pricePrefix: '',
    pricePostfix: '',
    
    // Location Settings
    address: '',
    city: 'Brooklyn',
    stateCountry: '',
    locationMap: '',
    
    // Media Settings
    videoUrl: '',
    virtualTourUrl: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUploadGallery = () => {
    console.log('Upload gallery images');
  };

  const handleRemoveGallery = () => {
    console.log('Remove gallery images');
  };

  const handleUploadVideo = () => {
    console.log('Upload video');
  };

  const handleRemoveVideo = () => {
    console.log('Remove video');
  };

  const handleResetMarker = () => {
    setFormData(prev => ({
      ...prev,
      locationMap: ''
    }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    alert('Property listing created successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Add New Property</h1>
        <p className="text-sm text-gray-600">
          You can create new properties by filling out the fields below. Please note that fields marked 
          with an asterisk <span className="text-red-500">(*)</span> have to be filled before you can create your property.
        </p>
      </div>

      <div className="space-y-6">
        {/* Property Info Section */}
        <div className="bg-white border border-gray-200 rounded">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h2 className="text-sm font-medium text-gray-700 flex items-center">
              <span className="w-4 h-4 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs mr-2">1</span>
              Property Info
            </h2>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Property Name */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Property name: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="propertyName"
                  value={formData.propertyName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Property ID */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Property ID:
                </label>
                <input
                  type="text"
                  name="propertyId"
                  value={formData.propertyId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Property Category */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Property category: <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="propertyCategory"
                    value={formData.propertyCategory}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 appearance-none bg-white text-blue-600"
                  >
                    <option value="Apartments">Apartments</option>
                    <option value="Houses">Houses</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Land">Land</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Property Status */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Property status: <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="propertyStatus"
                    value={formData.propertyStatus}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 appearance-none bg-white text-blue-600"
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
              {/* Display Layout */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Display layout:
                </label>
                <div className="relative">
                  <select
                    name="displayLayout"
                    value={formData.displayLayout}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 appearance-none bg-white text-blue-600"
                  >
                    <option value="Default">Default</option>
                    <option value="Grid">Grid</option>
                    <option value="List">List</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Property Size */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Property size:
                </label>
                <input
                  type="text"
                  name="propertySize"
                  value={formData.propertySize}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Number of Bedrooms */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Number of bedrooms:
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Number of Bathrooms */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Number of bathrooms:
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  min="0"
                  step="0.5"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Property Description */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Property description:
              </label>
              <textarea
                name="propertyDescription"
                value={formData.propertyDescription}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            {/* Property Excerpt */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Property excerpt: <span className="text-blue-500 font-normal">Shown on list</span>
              </label>
              <textarea
                name="propertyExcerpt"
                value={formData.propertyExcerpt}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Price Settings Section */}
        <div className="bg-white border border-gray-200 rounded">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h2 className="text-sm font-medium text-gray-700 flex items-center">
              <span className="w-4 h-4 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs mr-2">2</span>
              Price settings
            </h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Price */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Price: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Old Price */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Old price: <span className="text-blue-500 font-normal">If any</span>
                </label>
                <input
                  type="text"
                  name="oldPrice"
                  value={formData.oldPrice}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Price Prefix */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Price prefix text:
                </label>
                <input
                  type="text"
                  name="pricePrefix"
                  value={formData.pricePrefix}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Price Postfix */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Price postfix text:
                </label>
                <input
                  type="text"
                  name="pricePostfix"
                  value={formData.pricePostfix}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Location Settings Section */}
        <div className="bg-white border border-gray-200 rounded">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h2 className="text-sm font-medium text-gray-700 flex items-center">
              <span className="w-4 h-4 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs mr-2">3</span>
              Location Settings
            </h2>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Address */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Address: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  City: <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 appearance-none bg-white text-blue-600"
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

              {/* State/Country */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  State/Country: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="stateCountry"
                  value={formData.stateCountry}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Location on Map */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Location on map:
              </label>
              <p className="text-xs text-blue-500 mb-2">
                If you wish to display an approximate location, simply input the street name only, without including the street number
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="locationMap"
                  value={formData.locationMap}
                  onChange={handleInputChange}
                  placeholder="Enter a location"
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleResetMarker}
                  className="px-4 py-2 text-xs text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 rounded"
                >
                  Reset Marker
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Image Gallery Settings Section */}
        <div className="bg-white border border-gray-200 rounded">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h2 className="text-sm font-medium text-gray-700 flex items-center">
              <span className="w-4 h-4 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs mr-2">4</span>
              Image gallery settings
            </h2>
          </div>
          
          <div className="p-6">
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Upload gallery images:
              </label>
              <p className="text-xs text-blue-500 mb-4">
                The first image in the gallery will be displayed in lists. Drag & drop the images to rearrange them
              </p>
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleUploadGallery}
                  className="flex items-center gap-1 px-3 py-2 text-xs text-blue-600 bg-white border border-blue-600 rounded hover:bg-blue-50"
                >
                  <Upload className="w-3 h-3" />
                  Upload
                </button>
                <button
                  type="button"
                  onClick={handleRemoveGallery}
                  className="flex items-center gap-1 px-3 py-2 text-xs text-red-600 bg-white border border-red-600 rounded hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Video Settings Section */}
        <div className="bg-white border border-gray-200 rounded">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h2 className="text-sm font-medium text-gray-700 flex items-center">
              <span className="w-4 h-4 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs mr-2">5</span>
              Video settings
            </h2>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Upload Self-hosted Video */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Upload self-hosted video:
              </label>
              <p className="text-xs text-blue-500 mb-4">
                Allowed file type is mp4
              </p>
              
              <div className="flex gap-2 mb-6">
                <button
                  type="button"
                  onClick={handleUploadVideo}
                  className="flex items-center gap-1 px-3 py-2 text-xs text-blue-600 bg-white border border-blue-600 rounded hover:bg-blue-50"
                >
                  <Upload className="w-3 h-3" />
                  Upload
                </button>
                <button
                  type="button"
                  onClick={handleRemoveVideo}
                  className="flex items-center gap-1 px-3 py-2 text-xs text-red-600 bg-white border border-red-600 rounded hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Video URL */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Video URL: <span className="text-blue-500 font-normal">Link to YouTube, Vimeo</span>
                </label>
                <input
                  type="url"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Virtual Tour URL */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  360° Virtual tour URL: <span className="text-blue-500 font-normal">Link to virtual tour</span>
                </label>
                <input
                  type="url"
                  name="virtualTourUrl"
                  value={formData.virtualTourUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-6">
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Create Property Listing
          </button>
        </div>
      </div>
    </div>
  );
}