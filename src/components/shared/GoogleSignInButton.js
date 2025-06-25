"use client";
import { Button } from "@/components/ui/button";
import api from "@/api/axiosConfig";
import { FcGoogle } from "react-icons/fc";

const GoogleSignInButton = ({page}) => {
  const handleGoogleSignIn = async () => {
    try {
      const response = await api.get("/auth/google/redirect");
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Error redirecting to Google:", error);
    }
  };

  return (
    <Button
      onClick={handleGoogleSignIn}
      className="bg-black text-white py-3 rounded hover:bg-gray-800 hover:cursor-pointer transition-colors duration-300 w-full"
    >
      Sign {page === "register" ? "up" : "in"} with Google <FcGoogle className="inline ml-2" />
    </Button>
  );
};

export default GoogleSignInButton;
