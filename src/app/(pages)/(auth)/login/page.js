"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from 'axios';
import Link from "next/link";
// Yup Validation Schema
const LoginSchema = Yup.object().shape({
  email: Yup.string()
  .matches(
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    "Invalid email format"
  )
  .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const page = () => {
  const handleLogin = (values) => {
    console.log("Login Data:", values);
    // API call goes here
    axios.post('http://localhost:8000/api/login',values)
               .then( (res) => {
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
                console.log(user)
                console.log(token)
               })
  };

  return (
    <>
      <header className="bg-[#ffcc41] text-black font-medium p-4 h-60 m-6 mb-0 rounded-lg flex items-center">
        <h1 className="text-6xl ml-40 ">User Dashboard</h1>
      </header>
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-sm border-1 rounded-1xl">
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
                  {/* Email */}
                  <div className="grid gap-2">
                    
                    <Field
                      name="email"
                      type="text"
                      as={Input}
                      placeholder="Email*"
                      className="border rounded-none p-6 text-5xl"
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
                      className="border rounded-none p-6 text-5xl"
                      title="Please fill out this field"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="bg-[#ffcc41] text-black text-1xl p-6 rounded-none hover:bg-amber-400">
                    {isSubmitting ? "Logging in..." : "Login"}
                  </Button>
                </Form>
              )}
            </Formik>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <div className="text-center">
              <span className="text-muted-foreground">Not a member?</span>
              <Link href="/register" passHref  className="text-black m-2 hover:underline" >
                Register here
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default page
