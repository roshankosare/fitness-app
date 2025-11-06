import { useEffect, useState } from "react";
import { AuthContext, type User } from "../context/authContext";
import axios from "axios";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [refetchToggle, setRefetchToggle] = useState<boolean>(false);

  const refreshUser = async () => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/auth/user",
        {},
        {
          withCredentials: true,
        }
      );

      setUser(res.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await axios.post(
      "http://localhost:4000/api/auth/logout",
      {},
      { withCredentials: true }
    );
    setUser(null);
  };

  useEffect(() => {
    refreshUser();
  }, [refetchToggle]);

  const toggleRefetch = () => {
    setRefetchToggle((value) => !value);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        refreshUser,
        logout,
        refetchToggle: toggleRefetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
