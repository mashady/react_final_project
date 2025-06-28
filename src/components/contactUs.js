"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "@/api/axiosConfig"
import Toast from "@/app/(pages)/property/[id]/components/Toast";
import { useState } from "react";
import { useTranslation } from "@/TranslationContext";
export default function ContactPage() {

  let { t } = useTranslation();

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
  
  const validationSchema = Yup.object({
    name: Yup.string()
      .required(t("nameRequired"))
      .min(2, t("nameContactMinLength")),
    email: Yup.string()
      .email(t("emailInvalidLogin"))
      .required(t("emailRequired")),
    message: Yup.string()
      .required(t("messageRequired"))
      .min(10, t("messageMinLength")),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      message: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        setSubmitting(true);
        const response = await api.post("/contact", values);
        showToast(t("messageSuccess"), "success");
        resetForm();
      } catch (err) {
        const errorMessage =
          err?.response?.data?.message || "Something went wrong";
        showToast(t("messageError") + ": " + errorMessage, "error");
      } finally {
        setSubmitting(false);
      }
    }


  });

  return (
    <div className="min-h-screen bg-white">
      <section
        className="relative h-[400px] w-full flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://newhome.qodeinteractive.com/wp-content/uploads/2023/03/contact-us-title-img.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-[#0000008a] bg-opacity-40"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-5xl md:text-5xl font-medium text-white">
            {t("footerContactUS")}
          </h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white p-8 flex flex-col justify-center">
            <h2 className="text-3xl text-black mb-2 font-medium">
              {t("ContactHeader")}
            </h2>
            <p className="text-[#555] mb-6">
              {t("contactDescription")}
            </p>

            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder={t("nameContactPlaceholder")}
                  className={`w-full px-0 py-3 text-gray-900 placeholder-gray-500 bg-transparent border-0 border-b ${
                    formik.touched.name && formik.errors.name
                      ? "border-red-500"
                      : "border-gray-300"
                  } focus:border-gray-900 focus:outline-none focus:ring-0 transition-colors duration-200`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                />
                {formik.touched.name && formik.errors.name ? (
                  <div className="mt-1 text-sm text-red-600">
                    {formik.errors.name}
                  </div>
                ) : null}
              </div>

              <div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder={t("emailContactPlaceholder")}
                  className={`w-full px-0 py-3 text-gray-900 placeholder-gray-500 bg-transparent border-0 border-b ${
                    formik.touched.email && formik.errors.email
                      ? "border-red-500"
                      : "border-gray-300"
                  } focus:border-gray-900 focus:outline-none focus:ring-0 transition-colors duration-200`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="mt-1 text-sm text-red-600">
                    {formik.errors.email}
                  </div>
                ) : null}
              </div>

              <div>
                <textarea
                  id="message"
                  name="message"
                  placeholder={t("messageContactPlaceholder")}
                  rows={6}
                  className={`w-full px-0 py-3 text-gray-900 placeholder-gray-500 bg-transparent border-0 border-b ${
                    formik.touched.message && formik.errors.message
                      ? "border-red-500"
                      : "border-gray-300"
                  } focus:border-gray-900 focus:outline-none focus:ring-0 resize-none transition-colors duration-200`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.message}
                />
                {formik.touched.message && formik.errors.message ? (
                  <div className="mt-1 text-sm text-red-600">
                    {formik.errors.message}
                  </div>
                ) : null}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={formik.isSubmitting || !formik.isValid}
                  className={`bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 cursor-pointer ${
                    formik.isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {formik.isSubmitting ? t("sendingMessage") : t("sendMessage")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
            {toast.visible && (
              <Toast
                message={toast.message}
                type={toast.type}
                onClose={handleCloseToast}
              />
            )}
    </div>
  );
}
