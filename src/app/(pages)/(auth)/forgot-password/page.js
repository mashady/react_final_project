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
import { useState, useEffect } from "react";
import api from "@/api/axiosConfig";
import { useRouter } from "next/navigation";

const handleSubmitSchema = Yup.object().shape({
  email: Yup.string()
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format")
    .required("Email is required"),
});

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const[loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    message: "",
    type: "",
    visible: false,
  });
  const router = useRouter();
  const showToast = (message, type) => {
    setToast({ message, type, visible: true });
  };

  const handleCloseToast = () => {
    setToast({ ...toast, visible: false });
  };

  const handleSubmit = async (values) => {
    try {
      const res = await api.post('/forgot-password', { email: values.email });
      showToast(res.data.message, "success");
    } catch (err) {
      showToast('Error: ' + err.response?.data?.message || 'Something went wrong.', "error");
    }
  };

  return (
    <>
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-[300px] m-auto min-h-[300px] border-1 rounded-1xl shadow-lg py-16 md:w-[450px]">
                <CardHeader>
                    <CardTitle className="text-center text-3xl">Resend Verification Email</CardTitle>
                </CardHeader>
                <CardContent>
                    <Formik
                    initialValues={{ email: "" }}
                    validationSchema={handleSubmitSchema}
                    onSubmit={(values, actions) => {
                        handleSubmit(values);
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
                            <Button
                                type="submit"
                                disabled={loading}
                                className="bg-[#ffcc41] text-black text-1xl p-6 rounded-none hover:bg-amber-400"
                            >
                                {loading ? "Resending..." : "Resend Verification Email"}
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
};
