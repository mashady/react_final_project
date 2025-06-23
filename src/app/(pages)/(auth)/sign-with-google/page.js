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
import * as Yup from "yup";
import { useState } from "react";
import api from "../../../../api/axiosConfig";

const SignWithGooglePage = () => {
const handleGoogleSignIn = async (e) => {
  e.preventDefault();
  try {
    const response = await api.get("/auth/google/redirect");
    window.location.href = response.data.url; 
  } catch (error) {
    console.error("Error redirecting to Google:", error);
  }
};


return (
    <>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-[400px] border rounded-lg shadow-lg py-6">
                <CardHeader>
                    <CardTitle className="text-center text-2xl">Google Registration</CardTitle>
                </CardHeader>
                <CardContent>
                        <form className="flex flex-col gap-6" onSubmit={handleGoogleSignIn}>
                            <Button
                                type="submit"
                                className="bg-[#ffcc41] text-black py-3 rounded hover:bg-amber-400"
                            >
                                Sign in with Google
                            </Button>
                        </form>
                </CardContent>
            </Card>
        </div>

    </>
);
}

export default SignWithGooglePage;
