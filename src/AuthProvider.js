"use client";

import { createContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import LoadingSpinner from "./app/(pages)/properties/components/LoadingSpinner";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { user, loading, getUser, logout } = useUser();
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId && !user && !loading) {
      getUser(userId);
    }
  }, [getUser, loading, user]);

  const login = async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);
      localStorage.setItem("userId", response.data.user.id);
      await getUser(response.data.user.id);
      router.push("/dashboard");
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    logout();
    router.push("/login");
  };

  if (loading && !user) return <LoadingSpinner />;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout: handleLogout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};