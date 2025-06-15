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
import { Label } from "@/components/ui/label";
import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/shared/Header";
// Yup Validation Schema
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/";

  const handleLogin = async (values, { setSubmitting, setFieldError }) => {
    try {
      const response = await axios.post("/api/login", values);
      const { data, token } = response.data;

      const user = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      };

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      // Redirect to the return URL or home
      router.push(returnTo);
    } catch (error) {
      if (error.response?.data?.errors) {
        // Handle validation errors
        Object.keys(error.response.data.errors).forEach((key) => {
          setFieldError(key, error.response.data.errors[key][0]);
        });
      } else {
        // Handle general error
        setFieldError(
          "email",
          error.response?.data?.message || "Login failed. Please try again."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="h-screen flex items-center justify-center">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Log In</CardTitle>
          </CardHeader>
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={LoginSchema}
            onSubmit={handleLogin}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form>
                <CardContent>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="email">Email</Label>
                      <Field
                        as={Input}
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        className={
                          errors.email && touched.email ? "border-red-500" : ""
                        }
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-sm text-red-500"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="password">Password</Label>
                      <Field
                        as={Input}
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        className={
                          errors.password && touched.password
                            ? "border-red-500"
                            : ""
                        }
                      />
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-sm text-red-500"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Logging in..." : "Log In"}
                  </Button>
                  <div className="text-sm text-center space-x-1">
                    <span>Don&apos;t have an account?</span>
                    <Link
                      href="/register"
                      className="text-blue-600 hover:underline"
                    >
                      Register
                    </Link>
                  </div>
                </CardFooter>
              </Form>
            )}
          </Formik>
        </Card>
      </div>
    </>
  );
};

export default page;
