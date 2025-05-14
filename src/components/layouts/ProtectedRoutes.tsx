import { Navigate } from "react-router-dom";
import { PUBLIC_ROUTES } from "../../routes/route";
import { useAuthStore } from "../../stores/useAuthStore";
import { Center, Loader } from "@mantine/core";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoutes = ({ children }: ProtectedRouteProps) => {
  const { session, isLoading } = useAuthStore();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <Center h="100vh">
        <Loader size="lg" />
      </Center>
    );
  }

  if (!session) {
    return <Navigate to={PUBLIC_ROUTES.auth.login} replace />;
  }

  return children;
};

export default ProtectedRoutes;
