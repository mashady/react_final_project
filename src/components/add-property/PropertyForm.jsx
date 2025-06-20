"use client";
import React, { useState } from "react";
import { Formik, Form } from "formik";
import { formSections, initialValues } from "../../validation/formSections";
import { validationSchema } from "../../validation/add-property-validation";
import FormSection from "./FormSection";
import MediaUpload from "./MediaUpload";
import SubmitStatus from "./SubmitStatus";
import axios from "axios";
import Toast from "@/app/(pages)/property/[id]/components/Toast";
const PropertyForm = () => {
  const [submitStatus, setSubmitStatus] = useState(null);
  const [toast, setToast] = useState({
    message: "",
    type: "",
    visible: false,
  });

  const showToast = (message, type) => {
    setToast({ message, type, visible: true });
  };

  const handleCloseToast = () => {
    setToast({ ...toast, visible: false });
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitStatus(null);

    try {
      const submitData = new FormData();

      Object.keys(values).forEach((key) => {
        if (key === "media") {
          values[key].forEach((file, index) => {
            submitData.append(`media[${index}]`, file);
          });
        } else if (
          values[key] !== null &&
          values[key] !== undefined &&
          values[key] !== ""
        ) {
          submitData.append(key, values[key]);
        }
      });

      console.log("Form values:", values);
      console.log(
        "Submitting form data:",
        Object.fromEntries(submitData.entries())
      );

      await axios
        .post("http://127.0.0.1:8000/api/ads", submitData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: "application/json",
          },
        })
        .then((response) => {
          resetForm();
          // setSubmitStatus({
          //   type: "success",
          //   message: "Property listing created successfully!",
          //   details: `Property ID: ${response.data.data.id}`
          // });
          showToast("Property listing created successfully!", "success");
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 3000);
          console.log("Property created successfully:", response.data);
        })
        .catch((error) => {
          console.error("Submission error:", error);
          // setSubmitStatus({
          //   type: "error",
          //   message: "Failed to create property listing",
          //   details: error.message
          // });
          if (error.response && error.response.data) {
            showToast(
              error.response.data.message || "Failed to create property",
              "error"
            );
          } else {
            showToast("An unexpected error occurred!", "error");
          }
        });
    } catch (error) {
      console.error("Submission error:", error);
      // setSubmitStatus({
      //   type: "error",
      //   message: "Failed to create property",
      //   details: error.message
      // });
      showToast("Failed to create property!", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = (resetForm) => {
    resetForm();
    setSubmitStatus(null);
  };

  return (
    <div className="p-4 md:p-6 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-black mb-2">
          Add New Property
        </h1>
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
            {formSections.map((section, index) => (
              <FormSection key={index} section={section} />
            ))}

            <MediaUpload />

            <div className="flex justify-end gap-3 pt-6">
              <button
                type="button"
                onClick={() => handleReset(resetForm)}
                disabled={isSubmitting}
                className="px-4 cursor-pointer py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Reset Form
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 text-sm text-black rounded transition-colors cursor-pointer ${
                  isSubmitting
                    ? "bg-yellow-400 cursor-not-allowed"
                    : "bg-yellow-500 hover:bg-yellow-600"
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
      {toast.visible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={handleCloseToast}
        />
      )}
    </div>
  );
};

export default PropertyForm;
