import { Button } from "@mantine/core";
import { nprogress } from "@mantine/nprogress";
import { IconLogout } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../supabase/auth/auth.service";

export function UserButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    nprogress.start();

    const { success, error } = await logout();

    if (success) {
      navigate("/login");
    } else {
      console.error("Logout failed:", error);
    }

    nprogress.stop();
  };

  return (
    <Button
      variant="subtle"
      leftSection={<IconLogout size={16} />}
      onClick={handleLogout}
      fullWidth
      justify="start"
      py={10}
      px={16}
      h={48}
    >
      Đăng xuất
    </Button>
  );
}
