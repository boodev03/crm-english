import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";
import { PRIVATE_ROUTES } from "../../routes/route";

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoutes = ({ children }: PublicRouteProps) => {
  const { session } = useAuthStore();

  if (session) {
    return <Navigate to={PRIVATE_ROUTES.dashboard} replace />;
  }

  return children;
};

export default PublicRoutes;
