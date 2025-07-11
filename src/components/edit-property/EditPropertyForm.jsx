"use client";

import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { useRouter } from "next/navigation";
import axios from "axios";

import { getFormSections, initialValues } from "../../validation/formSections";
import { useValidationSchema } from "../../validation/add-property-validation";
import FormSection from "../add-property/FormSection";
import MediaUpload from "./MediaUpload";
import SubmitStatus from "../add-property/SubmitStatus";
import Toast from "@/app/(pages)/property/[id]/components/Toast";
import { useTranslation } from "@/TranslationContext";

const EditPropertyForm = ({ propertyId }) => {
  let { t } = useTranslation();
  const formSections = getFormSections(t);
  const validationSchema = useValidationSchema();

  const [formValues, setFormValues] = useState(initialValues);
  const [loading, setLoading] = useState(true);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "", visible: false });
  const router = useRouter();
  const [mediaDeleted, setMediaDeleted] = useState(false);

  useEffect(() => {
    if (propertyId) {
      axios
        .get(`http://127.0.0.1:8000/api/ads/${propertyId}`)
        .then((res) => {
          const data = res.data.data;
          setFormValues({
            ...initialValues,
            ...data,
            media:
              data.media?.map((m) => ({
                id: m.id,
                url: m.url, // ✅ نستخدم الرابط المباشر
                media_type: m.media_type, // مهم علشان نعرف هل هو صورة ولا فيديو
              })) || [],
          });
          // showToast(t("propertyUpdatedSuccessfully"), "success");
          setLoading(false);
        })
        .catch((err) => {
          console.error(t("propertyUpdatedNotSuccessfully"), err);
          showToast("Failed to load property data", "error");
          setLoading(false);
        });
    }
  }, [propertyId]);

  const showToast = (message, type) => {
    setToast({ message, type, visible: true });
  };

  const handleCloseToast = () => {
    setToast({ ...toast, visible: false });
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitStatus(null);

    try {
      const submitData = new FormData();

      // Append all non-media fields
      Object.keys(values).forEach((key) => {
        if (
          key !== "media" &&
          values[key] !== null &&
          values[key] !== undefined
        ) {
          submitData.append(key, values[key]);
        }
      });

      const existingMediaIds = values.media
        .filter((file) => file?.id)
        .map((file) => file.id);

      const newMediaFiles = values.media.filter((file) => file instanceof File);

      // Validate that at least one media file is present
      if (existingMediaIds.length + newMediaFiles.length === 0) {
        showToast(t("mediaMust"), "error");
        setSubmitting(false);
        return;
      }

      // Append existing media IDs
      existingMediaIds.forEach((id) => {
        submitData.append("existing_media[]", id);
      });

      // Append new media files
      newMediaFiles.forEach((file) => {
        submitData.append("media[]", file);
      });

      const response = await axios.post(
        `http://127.0.0.1:8000/api/ads/${propertyId}?_method=PUT`,
        submitData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: "application/json",
          },
        }
      );

      showToast("Property updated successfully!", "success");
      router.push("/dashboard/my-properties");
    } catch (error) {
      console.error("Submission error:", error);
      showToast(
        error.response?.data?.message || "Failed to update property",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveAllMedia = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/ads/${propertyId}/media`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setFormValues((prev) => ({
        ...prev,
        media: [],
      }));

      showToast(t("allMediaRemoved"), "success");
    } catch (err) {
      console.error("Failed to delete media:", err);
      showToast("Failed to delete media.", "error");
    }
  };

  return (
    <div className="p-4 md:p-6 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-black mb-2">
          {t("updateProperty")}
        </h1>
        <p className="text-sm text-gray-600">
          {t("updatePropertyDescription")}
        </p>
      </div>

      <SubmitStatus
        status={submitStatus}
        onDismiss={() => setSubmitStatus(null)}
      />

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading...</div>
      ) : (
        <Formik
          initialValues={formValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              {formSections.map((section, index) => (
                <FormSection key={index} section={section} />
              ))}

              <MediaUpload
                onRemoveAllMedia={handleRemoveAllMedia}
                propertyId={propertyId}
                showToast={showToast}
              />

              <div className="flex justify-end gap-3 pt-6">
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
                      {t("updating")}
                    </span>
                  ) : (
                    t("updateBtn")
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      )}

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

export default EditPropertyForm;
