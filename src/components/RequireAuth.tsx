import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../data/AuthContext";

export default function RequireAuth() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
}
