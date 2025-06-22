"use client";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/app/(pages)/properties/components/LoadingSpinner";

export default function RequireAuth({ allowedRoles = [], children }) {
  const router = useRouter();
  const user = useSelector((state) => state.user.data); // 👈 from your slice
  const loading = useSelector((state) => state.user.loading);

  const role = user?.role;

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (
        allowedRoles.length > 0 &&
        (!role || !allowedRoles.includes(role))
      ) {
        router.push("/");
      }
    }
  }, [user, role, loading, router, allowedRoles]);

  if (
    loading ||
    !user ||
    (allowedRoles.length > 0 && !allowedRoles.includes(role))
  ) {
    return <LoadingSpinner />;
  }

  return children;
}
