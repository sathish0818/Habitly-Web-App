import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../data/AuthContext";

export default function RequireAuth() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
}
