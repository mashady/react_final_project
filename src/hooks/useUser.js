import { useDispatch, useSelector } from "react-redux";
import { fetchUser, clearUser } from "../features/user/userSlice";

export const useUser = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.user);

  const getUser = (userId) => {
    dispatch(fetchUser(userId));
  };

  const resetUser = () => {
    dispatch(clearUser());
  };

  return {
    user: data,
    loading,
    error,
    getUser,
    resetUser,
  };
};
