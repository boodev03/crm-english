import {
  Alert,
  Box,
  Button,
  Container,
  Group,
  Paper,
  PasswordInput,
  Select,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconAlertCircle } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../api/auth.api";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      role: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length < 6 ? "Password should be at least 6 characters" : null,
      role: (value) => (!value ? "Please select a role" : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setError(null);
    setLoading(true);

    try {
      await registerUser({
        email: values.email,
        password: values.password,
        role: values.role,
      });

      // Redirect to dashboard
      navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred during registration";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="xs" px="xs">
      <Box mt={50} mb={30}>
        <Paper shadow="md" p="xl" radius="md" withBorder>
          <Title order={2} ta="center" mb="md">
            Create an Account
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
              autoComplete="new-password"
            />

            <Select
              required
              mt="md"
              label="Role"
              placeholder="Select a role"
              data={[
                { value: "admin", label: "Admin" },
                { value: "manager", label: "Manager" },
              ]}
              {...form.getInputProps("role")}
            />

            <Button type="submit" fullWidth loading={loading} mt="xl">
              Register
            </Button>
          </form>

          <Group justify="center" mt="md">
            <Text size="sm">Already have an account?</Text>
            <Button variant="subtle" onClick={() => navigate("/login")}>
              Sign in
            </Button>
          </Group>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
