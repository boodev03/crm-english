import { Center, Loader } from "@mantine/core";
import { Navigate } from "react-router-dom";
import { PUBLIC_ROUTES } from "../../routes/route";
import { useAuthStore } from "../../stores/useAuthStore";
import { logout } from "../../supabase/auth/auth.service";
import { notifications } from "@mantine/notifications";

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

  // Check if user has admin role
  const userRole = session?.user.user_metadata?.role;
  if (userRole !== "admin" || !session) {
    // Sign out user
    logout();
    notifications.show({
      title: "Không có quyền truy cập",
      message: "Bạn không có quyền truy cập vào trang này",
      color: "red",
    });
    return <Navigate to={PUBLIC_ROUTES.auth.login} replace />;
  }

  return children;
};

export default ProtectedRoutes;
