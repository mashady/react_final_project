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

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const LoginPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error, data } = useSelector((state) => state.user);
  const [emailNotVerified, setEmailNotVerified] = useState(false);

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
        throw resultAction.payload;
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
        <div className="my-4 p-4 w-[300px] m-auto bg-yellow-100 border border-yellow-400 text-yellow-700 rounded md:w-[450px]">
          <span>Your email is not verified? Please check your inbox and verify your email to proceed.</span>
          <p>
            <Link href="/verify/resend_verify_mail" className="ml-2 text-blue-600 hover:underline">
              Resend Verification Email
            </Link>
          </p>
        </div>
        <Card className="w-[300px] m-auto min-h-[450px] border-1 rounded-1xl shadow-lg py-16 md:w-[450px]">
          <CardHeader>
            <CardTitle className="text-center text-3xl">Login</CardTitle>
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
                      placeholder="Email*"
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
                      placeholder="Password*"
                      className="border rounded-none p-6 md:text-1xl"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-[#ffcc41] text-black text-1xl p-6 rounded-none hover:bg-amber-400"
                  >
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                </Form>
              )}
            </Formik>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <div className="text-center">
              <span className="text-muted-foreground">Not a member?</span>
              <Link
                href="/register"
                passHref
                className="text-black m-2 hover:underline"
              >
                Register here
              </Link>
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
