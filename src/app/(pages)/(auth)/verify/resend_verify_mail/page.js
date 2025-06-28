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
import { useTranslation } from "@/TranslationContext";


const ResendVerifyMailPage = () => {
  
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

  let { t } = useTranslation();

  const ResendVerifyMailSchema = Yup.object().shape({
    email: Yup.string()
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, t("emailInvalidLogin"))
      .required(t("emailRequired")),
  });

  const handleResendVerification = async (values) => {
    try {
      setLoading(true);
        const response = await api.post("/email/verification-notification-guest", {
          email: values.email,
        }, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        showToast(t("verificationEmailSent"), "success");
        setTimeout(() => {
          router.push("/verify/sent");
        }, 3000);
    } catch (error) {
      showToast(error.message || t("failedToResendVerificationEmail"), "error");
        setLoading(false);
        if (error.response && error.response.data && error.response.data.message === "Email already verified.") {
            showToast(t("emailAlreadyVerified"), "info");
            setTimeout(() => {
                router.push("/verify/already-verified");
            }, 3000);
        }

    }
  };


  return (
    <>
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-[300px] m-auto min-h-[300px] border-1 rounded-1xl shadow-lg py-16 md:w-[450px]">
                <CardHeader>
                    <CardTitle className="text-center text-3xl">{t("resendVerifyMail")}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Formik
                    initialValues={{ email: "" }}
                    validationSchema={ResendVerifyMailSchema}
                    onSubmit={(values, actions) => {
                        handleResendVerification(values);
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
                            <Button
                                type="submit"
                                disabled={loading}
                                className="bg-[#ffcc41] text-black text-1xl p-6 rounded-none hover:bg-amber-400"
                            >
                                {loading ? t("resending") : t("resendVerifyMail")}
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

export default ResendVerifyMailPage;
