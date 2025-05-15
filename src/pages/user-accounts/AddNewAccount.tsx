import {
  Button,
  Group,
  Modal,
  Select,
  Stack,
  TextInput,
  Title,
  PasswordInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { register } from "../../supabase/auth/auth.service";

interface AddNewAccountProps {
  opened: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ROLE_OPTIONS = [
  { value: "admin", label: "Admin" },
  { value: "teacher", label: "Giáo viên" },
  { value: "student", label: "Học viên" },
];

export default function AddNewAccount({
  opened,
  onClose,
  onSuccess,
}: AddNewAccountProps) {
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      role: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Email không hợp lệ"),
      password: (value) =>
        value.length >= 6 ? null : "Mật khẩu phải có ít nhất 6 ký tự",
      role: (value) => (value ? null : "Vui lòng chọn vai trò"),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const { error } = await register({
        email: values.email,
        password: values.password,
        metadata: { role: values.role },
      });

      if (error) throw error;

      notifications.show({
        title: "Thành công",
        message: "Tạo tài khoản mới thành công",
        color: "green",
      });

      form.reset();
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      notifications.show({
        title: "Lỗi",
        message:
          error instanceof Error
            ? error.message
            : "Không thể tạo tài khoản mới",
        color: "red",
      });
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Title order={3}>Thêm tài khoản mới</Title>}
      size="lg"
      radius="md"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="Email"
            placeholder="user@example.com"
            {...form.getInputProps("email")}
            required
          />

          <PasswordInput
            label="Mật khẩu"
            placeholder="Nhập mật khẩu"
            {...form.getInputProps("password")}
            required
          />

          <Select
            label="Vai trò"
            placeholder="Chọn vai trò"
            data={ROLE_OPTIONS}
            {...form.getInputProps("role")}
            required
          />

          <Group justify="flex-end" mt="md">
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" loading={form.submitting}>
              Thêm tài khoản
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
