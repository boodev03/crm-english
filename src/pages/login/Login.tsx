import {
  Alert,
  Box,
  Button,
  Container,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { nprogress } from "@mantine/nprogress";
import { IconAlertCircle } from "@tabler/icons-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PUBLIC_ROUTES } from "../../routes/route";
import { login } from "../../supabase/auth/auth.service";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length < 6 ? "Password should be at least 6 characters" : null,
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setError(null);
    nprogress.start();
    try {
      const { error } = await login({
        email: values.email,
        password: values.password,
      });

      if (error) throw error;

      // Redirect to the intended page or dashboard
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred during login";
      setError(errorMessage);
    } finally {
      nprogress.complete();
    }
  };

  return (
    <Container
      size="xs"
      px="xs"
      mih="100vh"
      display="flex"
      style={{
        alignItems: "center",
      }}
    >
      <Box h="100%" w="100%">
        <Paper shadow="md" p="xl" radius="md" withBorder>
          <Title order={2} ta="center" mb="md">
            Login to EngStudy Center
          </Title>

          {error && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              title="Error"
              color="red"
              mb="md"
            >
              {error}
            </Alert>
          )}

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
              required
              label="Email"
              placeholder="your@email.com"
              {...form.getInputProps("email")}
              autoComplete="email"
            />

            <PasswordInput
              required
              mt="md"
              label="Password"
              placeholder="Your password"
              {...form.getInputProps("password")}
              autoComplete="current-password"
            />

            <Button type="submit" fullWidth mt="xl" loading={form.submitting}>
              Sign in
            </Button>
          </form>

          <Group justify="center" mt="md">
            <Text size="sm">Don't have an account?</Text>
            <Button
              variant="subtle"
              disabled={form.submitting}
              onClick={() => navigate(PUBLIC_ROUTES.auth.register)}
            >
              Register
            </Button>
          </Group>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
