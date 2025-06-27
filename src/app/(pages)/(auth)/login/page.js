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
import Link from "next/link";
import Toast from "../../property/[id]/components/Toast";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, fetchUser } from "@/features/user/userSlice";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/TranslationContext";
import GoogleSignInButton from "@/components/shared/GoogleSignInButton";

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required"),
});

const LoginPage = () => {
  let { t } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error, data } = useSelector((state) => state.user);

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

  const handleLogin = async (values) => {
    try {
      const resultAction = await dispatch(loginUser(values));

      if (loginUser.fulfilled.match(resultAction)) {
        showToast("Login successful!", "success");

        setTimeout(() => {
          router.push("/");
        }, 3000);
      } else {
        const { status, message } = resultAction.payload;

        if (
          status === 403 &&
          message === "Please verify your email before logging in."
        ) {
          showToast("Please verify your email first.", "warning");
            // Redirect to verification sent page
            setTimeout(() => {
              router.push("/verify/sent");
              return;
            }, 3000);
        }

        throw message;
      }
    } catch (error) {
      showToast(error || "Login failed", "error");
    }
  };

  // Redirect when user data is available
  useEffect(() => {
    if (data) {
      setTimeout(() => {
        router.push("/");
      }, 1000);
    }
  }, [data, router]);

  return (
    <>
      <div className="min-h-screen py-32 bg-gray-50">
        <Card className="w-[300px] m-auto min-h-[450px] border-1 rounded-1xl shadow-lg py-16 md:w-[450px]">
          <CardHeader>
            <CardTitle className="text-center text-3xl">
              {" "}
              {t("loginHeader")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={LoginSchema}
              onSubmit={(values, actions) => {
                handleLogin(values);
                actions.setSubmitting(false);
              }}
            >
              {({ isSubmitting }) => (
                <Form className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Field
                      name="email"
                      type="text"
                      as={Input}
                      placeholder={t("loginEmailPlaceholder")}
                      className="border rounded-none p-6 md:text-1xl"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Field
                      name="password"
                      type="password"
                      as={Input}
                      placeholder={t("loginPasswordPlaceholder")}
                      className="border rounded-none p-6 md:text-1xl"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div>
                    <Link
                      href="/forgot-password"
                      className="text-gray-600  hover:underline"
                    >
                      {t("Forgot Password?")}
                    </Link>
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-[#ffcc41] text-black text-1xl p-6 rounded-none hover:bg-amber-400"
                  >
                    {loading ? t("loginLoading") : t("loginButton")}
                  </Button>
                </Form>
              )}
            </Formik>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <div className="text-center">
              <span className="text-muted-foreground">{t("notAMamber")}</span>
              <Link
                href="/register"
                passHref
                className="text-black m-2 hover:underline"
              >
                {t("registerHere")}
              </Link>
            </div>
            <div>
              <p> or </p>
            </div>
            <div className="flex justify-center items-center">
              <GoogleSignInButton page="login" />
            </div>
          </CardFooter>
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
};

export default LoginPage;
