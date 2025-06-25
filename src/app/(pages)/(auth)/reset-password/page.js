"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Toast from "@/app/(pages)/property/[id]/components/Toast";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/api/axiosConfig";

const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(12, "Password must be at least 12 characters")
    .max(50, "Password can not exceed 50 characters")
    .required("Password is required").matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,50}$/,
      "Password must be 12-50 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
    ),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Password confirmation is required"),
});

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [toast, setToast] = useState({
    message: "",
    type: "",
    visible: false,
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const showToast = (message, type) => {
    setToast({ message, type, visible: true });
  };

  const handleCloseToast = () => {
    setToast({ ...toast, visible: false });
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const res = await api.post("/reset-password", {
        token,
        email,
        password: values.password,
        password_confirmation: values.password_confirmation,
      });
      showToast(res.data.message, "success");
      setTimeout(() => {
        router.push("/login"); // تعديل حسب مسار صفحة تسجيل الدخول
      }, 3000);
    } catch (err) {
      showToast(
        err.response?.data?.message || "Something went wrong.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-[300px] m-auto min-h-[300px] border-1 rounded-1xl shadow-lg py-16 md:w-[450px]">
          <CardHeader>
            <CardTitle className="text-center text-3xl">
              Reset Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Formik
              initialValues={{
                password: "",
                password_confirmation: "",
              }}
              validationSchema={ResetPasswordSchema}
              onSubmit={(values, actions) => {
                handleSubmit(values);
                actions.setSubmitting(false);
              }}
            >
              {({ isSubmitting }) => (
                <Form className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Field
                      name="password"
                      type="password"
                      as={Input}
                      placeholder="New Password"
                      className="border rounded-none p-6 md:text-1xl"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Field
                      name="password_confirmation"
                      type="password"
                      as={Input}
                      placeholder="Confirm Password"
                      className="border rounded-none p-6 md:text-1xl"
                    />
                    <ErrorMessage
                      name="password_confirmation"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-[#ffcc41] text-black text-1xl p-6 rounded-none hover:bg-amber-400"
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </Button>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>
      </div>
      {toast.visible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={handleCloseToast}
        />
      )}
    </>
  );
}
