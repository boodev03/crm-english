import { Center, Loader } from "@mantine/core";
import { Navigate } from "react-router-dom";
import { PRIVATE_ROUTES } from "../../routes/route";
import { useAuthStore } from "../../stores/useAuthStore";

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

  if (session && session.user.user_metadata?.role === "admin") {
    return <Navigate to={PRIVATE_ROUTES.dashboard} replace />;
  }

  return children;
};

export default PublicRoutes;
