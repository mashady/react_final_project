"use client";
import React, { useState } from "react";
import { Formik, Form } from "formik";
import { formSections, initialValues } from "../../validation/formSections";
import { validationSchema } from "../../validation/add-property-validation";
import FormSection from "./FormSection";
import MediaUpload from "./MediaUpload";
import SubmitStatus from "./SubmitStatus";
import axios from "axios";
const PropertyForm = () => {
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitStatus(null);
    
    try {
      // Create FormData for file uploads
      const submitData = new FormData();
      
      // Add all form fields
      Object.keys(values).forEach(key => {
        if (key === 'media') {
          // Handle file uploads
          values[key].forEach((file, index) => {
            submitData.append(`media[${index}]`, file);
          });
        } else if (values[key] !== null && values[key] !== undefined && values[key] !== '') {
          submitData.append(key, values[key]);
        }
      });

      // Log form data for debugging
      console.log("Form values:", values);
      console.log("Submitting form data:", Object.fromEntries(submitData.entries()));
      
      // Simulate API call
      await axios.post("http://127.0.0.1:8000/api/ads", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Accept": "application/json",
        },
      }).then((response) => {
        console.log("Response:", response.data);
        resetForm();
      }).catch((error) => {
        console.error("Submission error:", error);
        setSubmitStatus({
          type: "error",
          message: "Failed to create property listing",
          details: error.message
        });
      })     
      
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus({
        type: "error",
        message: "Failed to create property listing",
        details: error.message
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = (resetForm) => {
    resetForm();
    setSubmitStatus(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-black mb-2">Add New Property</h1>
        <p className="text-sm text-gray-600">
          Create new properties by filling out the fields below.
        </p>
      </div>

      <SubmitStatus 
        status={submitStatus} 
        onDismiss={() => setSubmitStatus(null)} 
      />

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ isSubmitting, resetForm, values, errors, touched }) => (
          <Form className="space-y-6">
            {/* Form Sections */}
            {formSections.map((section, index) => (
              <FormSection key={index} section={section} />
            ))}

            {/* Media Upload Section */}
            <MediaUpload />

            {/* Debug Info (remove in production) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                <h3 className="text-sm font-medium mb-2">Debug Info:</h3>
                <div className="text-xs space-y-1">
                  <p>Images: {values.galleryImages?.length || 0}</p>
                  <p>Errors: {Object.keys(errors).length}</p>
                  <p>Touched: {Object.keys(touched).length}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6">
              <button
                type="button"
                onClick={() => handleReset(resetForm)}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Reset Form
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 text-sm text-white rounded transition-colors ${
                  isSubmitting 
                    ? "bg-blue-400 cursor-not-allowed" 
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle 
                        className="opacity-25" 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4"
                        fill="none"
                      />
                      <path 
                        className="opacity-75" 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "Submit Property"
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default PropertyForm;