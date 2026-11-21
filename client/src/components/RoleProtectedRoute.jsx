import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Context } from "../context/AuthContext";

const RoleProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useContext(Context);

  if (loading) {
    return <div>Checking permissions...</div>; 
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleProtectedRoute;
