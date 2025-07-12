import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps): JSX.Element => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  return (isLoggedIn || isLocalhost) ? <>{children}</> : <Navigate to="/register" replace />;
};

export default ProtectedRoute;
