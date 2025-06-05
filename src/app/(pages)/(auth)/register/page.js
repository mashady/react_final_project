"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import axios from 'axios';
import Link from "next/link";
import Header from "@/components/shared/Header";
// Yup Validation Schema
const RegisterSchema = Yup.object().shape({
  name: Yup.string()
  .matches(
    /^[A-Za-zÀ-ÿ' -]{3,70}$/, 
    "Invalid name! Name must be 3–70 characters and only include letters, spaces, hyphens, or apostrophes."
  )
  .required("Name is required")
  ,
  email: Yup.string()
  .matches(
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    "Invalid email format! It must be like m@example.com"
  )
  .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required("Password confirmation is required"),
  role: Yup.string()
    .required("Role is required"),
  verification_document: Yup.mixed()
    .required("Verification document is required")
    .test("fileSize", "File size is too large", value => {
      return value && value.size <= 5242880; // 5MB limit
    })
    .test("fileType", "Unsupported file format", value => {
      return value && ["image/jpeg", "image/png", "application/pdf"].includes(value.type);
    }),
});

const page = () => {
  const handleRegister = (values) => {
    console.log("Register Data:", values);
    // API call goes here
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("password_confirmation", values.password_confirmation);
    formData.append("role", values.role);
    formData.append("verification_document", values.verification_document);

    axios.post('http://localhost:8000/api/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then( (res) => {
        const data = res.data.data;
        const token = res.data.token
        console.log(data, token);
        const user = {
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role
        }
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
        window.location.href = "/";

        console.log(user)
        console.log(token)
        })
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-sm border rounded-lg">
          <CardHeader>
            <CardTitle className="text-center text-3xl">Register</CardTitle>
          </CardHeader>
          <CardContent>
            <Formik
              initialValues={{  name: "", email: "", password: "", password_confirmation: "", role: "student", verification_document: "", }}
              validationSchema={RegisterSchema}
              onSubmit={(values, actions) => {
                handleRegister(values);
                actions.setSubmitting(false);
              }}
            >
              {({ isSubmitting, setFieldValue }) => (
                <Form className="flex flex-col gap-6" encType="multipart/form-data">
                  {/* Name */}
                  <div className="grid gap-2">
                    
                    <Field
                      name="name"
                      type="text"
                      as={Input}
                      placeholder="Name*"
                      className="border rounded-none p-6 text-muted-foreground"
                      title="Please fill out this field"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  {/* Email */}
                  <div className="grid gap-2">
                    
                    <Field
                      name="email"
                      type="text"
                      as={Input}
                      placeholder="Email*"
                      className="border rounded-none p-6 text-muted-foreground"
                      title="Please fill out this field"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Password */}
                  <div className="grid gap-2">
                    
                    <Field
                      name="password"
                      type="password"
                      as={Input}
                      placeholder="Password*"
                      className="border rounded-none p-6 text-muted-foreground"
                      title="Please fill out this field"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  {/* Password_confirmation */}
                  <div className="grid gap-2">
                    
                    <Field
                      name="password_confirmation"
                      type="password"
                      as={Input}
                      placeholder="Confirm Password*"
                      className="border rounded-none p-6 text-muted-foreground"
                      title="Please fill out this field"
                    />
                    <ErrorMessage
                      name="password_confirmation"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  {/* Role */}
                  <div className="grid gap-2">
                    <Field
                      name="role"
                      as="select"
                      className="border rounded-none p-4 text-1xl text-muted-foreground"
                      title="Please select a role"
                    >
                      <option value="student" label="Student" />
                      <option value="owner" label="Owner" />
                    </Field>
                    <ErrorMessage
                      name="role"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  {/* Verification Document */}
                  <div className="grid gap-2">
                    <input
                      name="verification_document"
                      type="file"
                      onChange={(event) => {
                        setFieldValue("verification_document", event.currentTarget.files[0]);
                      }}
                      className="border rounded-none text-muted-foreground p-4"
                    />
                    <ErrorMessage
                      name="verification_document"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  {/* Submit Button */}
                  <Button type="submit" disabled={isSubmitting} className="bg-[#ffcc41] text-black text-1xl p-6 rounded-none hover:bg-amber-400">
                    {isSubmitting ? "Redirecting..." : "Register"}
                  </Button>
                </Form>
              )}
            </Formik>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <div className="text-center">
              <span className="text-muted-foreground">Have an account?</span>
              <Link href="/login" passHref  className="text-black m-2 hover:underline" >
                Log in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default page
