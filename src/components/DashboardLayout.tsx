import {
  AppShell,
  Box,
  Burger,
  Button,
  Group,
  NavLink,
  ScrollArea,
  Text,
  UnstyledButton,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconDashboard,
  IconHeadphones,
  IconLogout,
  IconUserCheck,
  IconUserPlus,
} from "@tabler/icons-react";
import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "../api/auth.api";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [opened, { toggle }] = useDisclosure();
  const theme = useMantineTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const navItems = [
    { icon: IconDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: IconUserCheck, label: "Teachers", path: "/teachers" },
    { icon: IconUserPlus, label: "Students", path: "/students" },
    {
      icon: IconHeadphones,
      label: "Listening Practice",
      path: "/practice/listening",
    },
  ];

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const links = navItems.map((item) => (
    <NavLink
      key={item.label}
      active={currentPath === item.path}
      label={item.label}
      leftSection={<item.icon style={{ width: rem(20), height: rem(20) }} />}
      component={Link}
      to={item.path}
      style={{
        borderRadius: theme.radius.md,
        marginBottom: rem(4),
      }}
    />
  ));

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 220,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Group justify="space-between" style={{ flex: 1 }}>
            <UnstyledButton component={Link} to="/dashboard">
              <Text size="xl" fw={700} c={theme.primaryColor}>
                CRM English
              </Text>
            </UnstyledButton>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar>
        <AppShell.Section grow component={ScrollArea} my="xs">
          <Box px="xs">{links}</Box>
        </AppShell.Section>

        <AppShell.Section>
          <Box px="xs" pb="md">
            <Button
              fullWidth
              leftSection={<IconLogout size={16} />}
              variant="subtle"
              onClick={handleLogout}
              color="red"
              justify="start"
            >
              Logout
            </Button>
          </Box>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}

export default DashboardLayout;
