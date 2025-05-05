import { Navigate } from "react-router-dom";
import { PUBLIC_ROUTES } from "../../routes/route";
import { useAuthStore } from "../../stores/useAuthStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoutes = ({ children }: ProtectedRouteProps) => {
  const { session } = useAuthStore();

  if (!session) {
    return <Navigate to={PUBLIC_ROUTES.auth.login} replace />;
  }

  return children;
};

export default ProtectedRoutes;
