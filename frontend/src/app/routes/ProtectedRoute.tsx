import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "@/app/providers/Auth";

interface ProtectedRouteProps {
  element: ReactElement;
}

export const ProtectedRoute = ({ element }: ProtectedRouteProps) => {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <Navigate to="/auth" replace />;
  }

  return element;
};

interface PublicRouteProps {
  element: ReactElement;
}

export const PublicRoute = ({ element }: PublicRouteProps) => {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return element;
};
