"use client";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchUser,
  updateUser,
  clearUser,
  selectCurrentUser,
  selectUserLoading,
  selectUserError,
  selectUpdateStatus,
} from "@/lib/features/user/userSlice";

export const useUser = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);
  const updateStatus = useSelector(selectUpdateStatus);

  return {
    user,
    loading,
    error,
    updateStatus,
    isAuthenticated: !!user,

    getUser: (userId) => dispatch(fetchUser(userId)),
    updateUserData: (userId, userData) =>
      dispatch(updateUser({ userId, userData })),
    logout: () => dispatch(clearUser()),
  };
};
