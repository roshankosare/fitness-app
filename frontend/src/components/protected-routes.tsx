import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { JSX } from "react";

export const UserRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/signin" replace />;
  if (user.role !== "USER") return <Navigate to="/unauthorized" replace />;

  return children;
};

export const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/signin" replace />;
  if (user.role !== "ADMIN") return <Navigate to="/unauthorized" replace />;

  return children;
};
