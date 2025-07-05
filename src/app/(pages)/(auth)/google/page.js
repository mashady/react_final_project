"use client";
import { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import * as Yup from "yup";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "@/features/user/userSlice";
import api from "@/api/axiosConfig";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import Toast from "../../property/[id]/components/Toast"; // Adjust the import path as necessary
import { useTranslation } from "@/TranslationContext";
const GooglePage = () => {
  let { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const userId = searchParams.get("user_id");
  const [selectedPersonalImageName, setSelectedPersonalImageName] =
    useState("");
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

  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated and profile is completed
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && user?.data) {
      router.push("/");
    }
  }, [user, router]);

  const validationSchema = Yup.object().shape({
    role: Yup.string().required("Role is required"),
    verification_document: Yup.mixed()
      .required("Verification document is required")
      .test(
        "fileSize",
        "File too large",
        (value) => value && value.size <= 5 * 1024 * 1024
      )
      .test(
        "fileType",
        "Unsupported file format",
        (value) =>
          value &&
          ["application/pdf", "image/jpeg", "image/png", "image/jpg"].includes(
            value.type
          )
      ),
    picture: 
        Yup.mixed()
        .required("personal Image Required")
        .test(
          "fileSize",
          t("File size is too large (max 5MB)"),
          (value) => value && value.size <= 5242880
        )
        .test(
          "fileType",
          t("Unsupported file format (only JPG, PNG, PDF, JPEG)"),
          (value) =>
            value &&
            ["image/jpeg", "image/png", "application/pdf"].includes(value.type)
        )
  });

  const handleGoogleSignIn = async (values) => {
    try {
      setLoading(true);
      const compareFormData = new FormData();
      compareFormData.append("image1", values.verification_document);
      compareFormData.append("image2", values.picture);
      compareFormData.append("tolerance", 0.6);
      const compareRes = await fetch("http://localhost:5001/compare-files", {
        method: "POST",
        body: compareFormData,
      });
      const compareData = await compareRes.json();
      let verificationStatus = "pending";
      if (compareData.same_person) {
        verificationStatus = "verified";
      }
      const formData = new FormData();
      formData.append("role", values.role);
      formData.append("verification_document", values.verification_document);
      formData.append("verification_status", verificationStatus);
      formData.append("profile_image", values.picture);
      formData.append("user_id", userId);
      const response = await api.post("/auth/google/complete-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showToast("Profile completed successfully!", "success");

      const { token, user } = response.data;
      if (user.verification_status === "verified") {
        localStorage.setItem("token", token);
        dispatch({ type: "user/login/fulfilled", payload: { token } });
        dispatch(fetchUser(user.id));
        router.push("/");
      } else {
        localStorage.setItem("status", user.verification_status);
        router.push(
          user.verification_status === "pending"
            ? "/admin/pending"
            : "/admin/banned"
        );
      }

    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to complete profile",
        "error"
      );
      console.error("Error completing profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-[400px] border rounded-lg shadow-lg py-6">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Google Registration</CardTitle>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={{
              role: "",
              verification_document: null,
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => handleGoogleSignIn(values)}
          >
            {({ setFieldValue }) => (
              <Form className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Field
                    name="role"
                    as="select"
                    className="border rounded p-3 text-muted-foreground"
                  >
                    <option value="">Select role*</option>
                    <option value="student">Student</option>
                    <option value="owner">Owner</option>
                  </Field>
                  <ErrorMessage
                    name="role"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="grid gap-2">
                  <input
                    name="verification_document"
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(event) => {
                      setFieldValue(
                        "verification_document",
                        event.currentTarget.files[0]
                      );
                    }}
                    className="border rounded p-2"
                  />
                  <ErrorMessage
                    name="verification_document"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                
                <div className="grid gap-2">
                  <input
                    id="personalImageUpload"
                    name="picture"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      setFieldValue("picture", file);
                      setSelectedPersonalImageName(file?.name || "");
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor="personalImageUpload"
                    className="cursor-pointer text-muted-foreground border border-gray-300 px-4 py-4 rounded w-full hover:bg-gray-100"
                  >
                    {selectedPersonalImageName
                      ? selectedPersonalImageName
                      : t("choosePersonalImage")}
                  </label>
                  <ErrorMessage
                    name="picture"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <Button
                  type="submit"
                  className="bg-[#ffcc41] text-black py-3 rounded hover:bg-amber-400 flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </Form>
            )}
          </Formik>
        </CardContent>
        <CardFooter className="text-center text-sm text-gray-500">
          You must provide role and document before continuing.
        </CardFooter>
      </Card>
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

export default GooglePage;
