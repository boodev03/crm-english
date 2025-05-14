import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";
import { PRIVATE_ROUTES } from "../../routes/route";
import { Center, Loader } from "@mantine/core";

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoutes = ({ children }: PublicRouteProps) => {
  const { session, isLoading } = useAuthStore();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <Center h="100vh">
        <Loader size="lg" />
      </Center>
    );
  }

  if (session) {
    return <Navigate to={PRIVATE_ROUTES.dashboard} replace />;
  }

  return children;
};

export default PublicRoutes;
