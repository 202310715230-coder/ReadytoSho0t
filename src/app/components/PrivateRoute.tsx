import { JSX } from "react";
import {
  Navigate,
  useLocation,
} from "react-router-dom";

import { useAuth } from "../components/hooks/UseAuth";

interface PrivateRouteProps {
  children: JSX.Element;
  requireAdmin?: boolean;
}

export function PrivateRoute({
  children,
  requireAdmin = false,
}: PrivateRouteProps): JSX.Element {
  const location = useLocation();

  const {
    user,
    loading,
    isInitialized,
    isAuthenticated,
  } = useAuth();

  const localSession = localStorage.getItem("user_session");

  let localUser: any = null;

  if (localSession) {
    try {
      localUser = JSON.parse(localSession);
    } catch {
      localStorage.removeItem("user_session");
      localStorage.removeItem("user_id");
    }
  }

  const activeUser = user || localUser;

  if (!isInitialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-foreground border-t-secondary animate-spin rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated && !activeUser) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  if (
    requireAdmin &&
    activeUser?.role?.toLowerCase() !== "admin"
  ) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
}