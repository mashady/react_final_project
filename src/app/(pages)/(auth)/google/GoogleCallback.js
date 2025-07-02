'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchUser } from '@/features/user/userSlice';
import { useDispatch } from 'react-redux';

export default function GoogleCallback() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
  const token = searchParams.get("token");
  const userId = searchParams.get("user_id");
  const status = searchParams.get("status");

  const handleLogin = async () => {
    
    if (status === "pending") {
      localStorage.setItem("status", status);
      router.push("/admin/pending");
      return;
    } else if (status === "unverified") {
      localStorage.setItem("status", status);
      router.push("/admin/banned");
      return;  
    } else {
        localStorage.setItem("token", token);

        dispatch({
          type: "user/login/fulfilled",
          payload: { token },
        });

        try {
          await dispatch(fetchUser(userId)).unwrap(); 

          // Fetch user data and update the state
          router.push("/");
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
        return;
    }
      
  };

  handleLogin();
}, [searchParams, router, dispatch]);


  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600 text-lg animate-pulse">Processing Google login...</p>
    </div>
  );
}
