import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return user ? children : <Navigate to="/login" replace />;
}