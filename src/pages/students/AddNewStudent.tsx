import {
  Button,
  Group,
  Modal,
  Stack,
  TextInput,
  Title,
  PasswordInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { studentService } from "../../supabase/services/student.service";
import { register } from "../../supabase/auth/auth.service";

interface AddNewStudentProps {
  opened: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddNewStudent({
  opened,
  onClose,
  onSuccess,
}: AddNewStudentProps) {
  const form = useForm({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      password: "",
    },
    validate: {
      first_name: (value) => (value ? null : "Vui lòng nhập tên"),
      last_name: (value) => (value ? null : "Vui lòng nhập họ"),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Email không hợp lệ"),
      phone: (value) => (value ? null : "Vui lòng nhập số điện thoại"),
      password: (value) =>
        value.length >= 6 ? null : "Mật khẩu phải có ít nhất 6 ký tự",
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      // First create the student account
      const { error: registerError } = await register({
        email: values.email,
        password: values.password,
        metadata: { role: "student" },
      });

      if (registerError) throw registerError;

      // Then create the student profile
      const { error: studentError } = await studentService.createStudent({
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        phone: values.phone,
      });

      if (studentError) throw studentError;

      notifications.show({
        title: "Thành công",
        message: "Thêm học viên và tạo tài khoản thành công",
        color: "green",
      });

      form.reset();
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      notifications.show({
        title: "Lỗi",
        message:
          error instanceof Error ? error.message : "Không thể thêm học viên",
        color: "red",
      });
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Title order={3}>Thêm học viên mới</Title>}
      size="lg"
      radius="md"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="Tên"
            placeholder="Nhập tên học viên"
            {...form.getInputProps("first_name")}
          />

          <TextInput
            label="Họ"
            placeholder="Nhập họ học viên"
            {...form.getInputProps("last_name")}
          />

          <TextInput
            label="Số điện thoại"
            placeholder="Nhập số điện thoại"
            {...form.getInputProps("phone")}
          />

          <TextInput
            label="Email"
            placeholder="hocvien@example.com"
            {...form.getInputProps("email")}
          />

          <PasswordInput
            label="Mật khẩu"
            placeholder="Nhập mật khẩu"
            {...form.getInputProps("password")}
            required
          />

          <Group justify="flex-end" mt="md">
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" loading={form.submitting}>
              Thêm học viên
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
