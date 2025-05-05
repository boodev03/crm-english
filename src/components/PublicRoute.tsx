import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../hooks/useUser";

interface PublicRouteProps {
  children: React.ReactNode;
}

export function PublicRoute({ children }: PublicRouteProps) {
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";
  const { isAuthenticated } = useUser();
  if (isAuthenticated) {
    // Redirect to dashboard if already authenticated
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
}
