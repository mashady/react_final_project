"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
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
import { RegisterSchema } from "@/validation/register-validation";
import Toast from "../../property/[id]/components/Toast";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "@/features/user/userSlice";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useSelector((state) => state.user);

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

  const handleRegister = async (values) => {
    try {
      const resultAction = await dispatch(registerUser(values));

      if (registerUser.fulfilled.match(resultAction)) {
        showToast("Registration successful!, Please check your email to verify your account.", "success");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        throw resultAction.payload;
      }
    } catch (error) {
      showToast(error || "Registration failed", "error");
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-[500px] border rounded-lg shadow-lg py-6">
          <CardHeader>
            <CardTitle className="text-center text-3xl">Register</CardTitle>
          </CardHeader>
          <CardContent>
            <Formik
              initialValues={{
                name: "",
                email: "",
                password: "",
                password_confirmation: "",
                role: "",
                verification_document: null,
              }}
              validationSchema={RegisterSchema}
              onSubmit={(values, actions) => {
                handleRegister(values);
                actions.setSubmitting(false);
              }}
            >
              {({ isSubmitting, setFieldValue }) => (
                <Form className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Field
                      name="name"
                      type="text"
                      as={Input}
                      placeholder="Name*"
                      className="border rounded-none p-6 text-muted-foreground"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Field
                      name="email"
                      type="text"
                      as={Input}
                      placeholder="Email*"
                      className="border rounded-none p-6 text-muted-foreground"
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
                      className="border rounded-none p-6 text-muted-foreground"
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
                      placeholder="Confirm Password*"
                      className="border rounded-none p-6 text-muted-foreground"
                    />
                    <ErrorMessage
                      name="password_confirmation"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Field
                      name="role"
                      as="select"
                      className="border rounded-none p-4 text-1xl text-muted-foreground"
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
                      onChange={(event) => {
                        setFieldValue(
                          "verification_document",
                          event.currentTarget.files[0]
                        );
                      }}
                      className="border rounded-none text-muted-foreground py-4 px-1"
                    />
                    <ErrorMessage
                      name="verification_document"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-[#ffcc41] text-black text-1xl p-6 rounded-none hover:bg-amber-400"
                  >
                    {loading ? "Registering..." : "Register"}
                  </Button>
                </Form>
              )}
            </Formik>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <div className="text-center">
              <span className="text-muted-foreground">Have an account?</span>
              <Link
                href="/login"
                passHref
                className="text-black m-2 hover:underline"
              >
                Log in
              </Link>
            </div>
            <div className="text-center">
              <span className="text-muted-foreground">Or</span>
              <Link
                href="/sign-with-google"
                passHref
                className="text-black m-2 hover:underline"
              >
                Sign up with Google
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

export default RegisterPage;
