"use client";

import React, { useState, useRef } from "react";
import {
  FaceComparisonService,
  FaceComparisonResult,
} from "../utils/faceComparison";

export default function FaceComparison() {
  const [image1, setImage1] = useState<File | null>(null);
  const [image2, setImage2] = useState<File | null>(null);
  const [result, setResult] = useState<FaceComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [tolerance, setTolerance] = useState(0.6);
  const [serviceHealth, setServiceHealth] = useState<boolean | null>(null);

  const image1Ref = useRef<HTMLInputElement>(null);
  const image2Ref = useRef<HTMLInputElement>(null);
  const faceService = new FaceComparisonService();

  React.useEffect(() => {
    checkServiceHealth();
  }, []);

  const checkServiceHealth = async () => {
    const isHealthy = await faceService.healthCheck();
    setServiceHealth(isHealthy);
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setImage: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const compareFaces = async () => {
    if (!image1 || !image2) {
      alert("Please select both images");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const comparisonResult = await faceService.compareFacesFiles(
        image1,
        image2,
        tolerance
      );
      setResult(comparisonResult);
    } catch (error) {
      setResult({
        same_person: false,
        error: `Comparison failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setImage1(null);
    setImage2(null);
    setResult(null);
    if (image1Ref.current) image1Ref.current.value = "";
    if (image2Ref.current) image2Ref.current.value = "";
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6">
        Face Comparison Tool
      </h1>
      <div className="mb-4 p-3 rounded-lg text-center">
        <span className="text-sm">
          Service Status:
          <span
            className={`ml-2 px-2 py-1 rounded text-white text-xs ${
              serviceHealth === null
                ? "bg-gray-500"
                : serviceHealth
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          >
            {serviceHealth === null
              ? "Checking..."
              : serviceHealth
              ? "Online"
              : "Offline"}
          </span>
        </span>
        <button
          onClick={checkServiceHealth}
          className="ml-3 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Similarity Tolerance: {tolerance}
        </label>
        <input
          type="range"
          min="0.3"
          max="1.0"
          step="0.1"
          value={tolerance}
          onChange={(e) => setTolerance(parseFloat(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Strict (0.3)</span>
          <span>Lenient (1.0)</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">First Image</label>
          <input
            ref={image1Ref}
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, setImage1)}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {image1 && (
            <div className="mt-2">
              <img
                src={URL.createObjectURL(image1)}
                alt="First face"
                className="w-full h-48 object-cover rounded"
              />
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Second Image</label>
          <input
            ref={image2Ref}
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, setImage2)}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {image2 && (
            <div className="mt-2">
              <img
                src={URL.createObjectURL(image2)}
                alt="Second face"
                className="w-full h-48 object-cover rounded"
              />
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-4 justify-center mb-6">
        <button
          onClick={compareFaces}
          disabled={!image1 || !image2 || loading || !serviceHealth}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Comparing..." : "Compare Faces"}
        </button>
        <button
          onClick={resetForm}
          className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Reset
        </button>
      </div>
      {result && (
        <div className="mt-6 p-4 rounded-lg border">
          <h2 className="text-xl font-bold mb-3">Comparison Result</h2>
          {result.error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <strong>Error:</strong> {result.error}
            </div>
          ) : (
            <div className="space-y-2">
              <div
                className={`text-lg font-semibold ${
                  result.same_person ? "text-green-600" : "text-red-600"
                }`}
              >
                {result.same_person ? "✅ Same Person" : "❌ Different People"}
              </div>
              {result.confidence && (
                <div>
                  <strong>Confidence:</strong> {result.confidence}%
                </div>
              )}
              {result.distance && (
                <div>
                  <strong>Face Distance:</strong> {result.distance}
                  <span className="text-sm text-gray-500 ml-2">
                    (lower = more similar)
                  </span>
                </div>
              )}
              {result.faces_detected && (
                <div>
                  <strong>Faces Detected:</strong>
                  Image 1: {result.faces_detected.image1}, Image 2:{" "}
                  {result.faces_detected.image2}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
