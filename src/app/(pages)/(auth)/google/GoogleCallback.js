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

    if (token && userId) {
      console.log("Token:", token);
      console.log("User ID:", userId);

      localStorage.setItem("token", token);

      dispatch({
        type: "user/login/fulfilled",
        payload: { token },
      });

      dispatch(fetchUser(userId));

      router.push("/");
    } else {
      console.error("Missing token or user_id in URL");
    }
  }, [searchParams, router, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      Processing Google login...
    </div>
  );
}
