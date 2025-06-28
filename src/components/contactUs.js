"use client";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function ContactPage() {
  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Name is required")
      .min(2, "Name must be at least 2 characters"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    message: Yup.string()
      .required("Message is required")
      .min(10, "Message must be at least 10 characters"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      message: "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      console.log("Message sent:", values);
      resetForm();
    },
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
            Contact Us
          </h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white p-8 flex flex-col justify-center">
            <h2 className="text-3xl text-black mb-2 font-medium">
              Send Us a Message
            </h2>
            <p className="text-[#555] mb-6">
              Email us and our support team will reply immediately
            </p>

            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Your name*"
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
                  placeholder="Your email*"
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
                  placeholder="Message*"
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
                  {formik.isSubmitting ? "Sending..." : "Send a message"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
