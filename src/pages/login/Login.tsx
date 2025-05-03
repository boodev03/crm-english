import {
  Anchor,
  Button,
  Checkbox,
  Container,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { nprogress } from "@mantine/nprogress";
import { IconAt, IconLock } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [visible, { toggle }] = useDisclosure(false);
  const navigate = useNavigate();
  const location = useLocation();

  // On component mount, complete any pending progress
  useEffect(() => {
    nprogress.complete();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    nprogress.start();

    try {
      // Mock login - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo purposes, hardcode a valid credential
      if (email === "admin@example.com" && password === "password") {
        // Save to localStorage if remember me is checked
        if (rememberMe) {
          localStorage.setItem("user", JSON.stringify({ email }));
        } else {
          sessionStorage.setItem("user", JSON.stringify({ email }));
        }

        // Show success notification
        notifications.show({
          title: "Đăng nhập thành công",
          message: "Chào mừng bạn đến với CRM English",
          color: "green",
          autoClose: 3000,
        });

        // Redirect to dashboard or intended destination
        const from = location.state?.from?.pathname || "/dashboard";
        navigate(from);
      } else {
        setError("Email hoặc mật khẩu không đúng");

        // Show error notification
        notifications.show({
          title: "Đăng nhập thất bại",
          message: "Email hoặc mật khẩu không đúng. Vui lòng thử lại.",
          color: "red",
          autoClose: 3000,
        });
      }
    } catch (err) {
      setError("Có lỗi xảy ra, vui lòng thử lại");
      console.error(err);

      // Show server error notification
      notifications.show({
        title: "Lỗi hệ thống",
        message:
          "Có lỗi xảy ra trong quá trình đăng nhập. Vui lòng thử lại sau.",
        color: "red",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
      nprogress.complete();
    }
  };

  return (
    <Container
      size={500}
      py={40}
      mih="100vh"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Title ta="center" fw={700} mb={30}>
        CRM English
      </Title>

      <Paper radius="md" p={40} withBorder shadow="xs" w="100%">
        <Title order={3} ta="center" mb={30}>
          Đăng nhập vào hệ thống
        </Title>

        <form onSubmit={handleSubmit}>
          <Stack gap="lg">
            <TextInput
              required
              label="Email"
              placeholder="your@email.com"
              value={email}
              onChange={(event) => setEmail(event.currentTarget.value)}
              error={error && !email ? "Email không được để trống" : null}
              leftSection={
                <IconAt style={{ width: rem(16), height: rem(16) }} />
              }
              size="md"
            />

            <PasswordInput
              required
              label="Mật khẩu"
              placeholder="Mật khẩu của bạn"
              value={password}
              visible={visible}
              onVisibilityChange={toggle}
              onChange={(event) => setPassword(event.currentTarget.value)}
              error={error && !password ? "Mật khẩu không được để trống" : null}
              leftSection={
                <IconLock style={{ width: rem(16), height: rem(16) }} />
              }
              size="md"
            />

            {error && (
              <Text c="red" size="sm">
                {error}
              </Text>
            )}

            <Group justify="space-between">
              <Checkbox
                label="Nhớ đăng nhập"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.currentTarget.checked)}
                size="md"
              />
              <Anchor component="button" size="sm">
                Quên mật khẩu?
              </Anchor>
            </Group>

            <Button fullWidth type="submit" loading={loading} size="md" mt={10}>
              Đăng nhập
            </Button>
          </Stack>
        </form>

        <Group justify="center" mt={30}>
          <Text size="sm">
            Chưa có tài khoản?{" "}
            <Anchor
              size="sm"
              component="button"
              onClick={() =>
                notifications.show({
                  title: "Chức năng đang phát triển",
                  message:
                    "Tính năng đăng ký sẽ được cập nhật trong thời gian tới",
                  color: "blue",
                })
              }
            >
              Đăng ký
            </Anchor>
          </Text>
        </Group>
      </Paper>
    </Container>
  );
}

export default Login;
