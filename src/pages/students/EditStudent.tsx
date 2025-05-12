import { Button, Group, Modal, Stack, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useEffect } from "react";
import { Student } from "../../supabase/dto/student.dto";
import { studentService } from "../../supabase/services/student.service";

interface EditStudentProps {
  student: Student | null;
  opened: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function EditStudent({
  student,
  opened,
  onClose,
  onSuccess,
}: EditStudentProps) {
  const form = useForm({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
    },
    validate: {
      first_name: (value) => (value ? null : "Vui lòng nhập tên"),
      last_name: (value) => (value ? null : "Vui lòng nhập họ"),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Email không hợp lệ"),
      phone: (value) => (value ? null : "Vui lòng nhập số điện thoại"),
    },
  });

  useEffect(() => {
    if (student) {
      form.setValues({
        first_name: student.first_name,
        last_name: student.last_name,
        email: student.email,
        phone: student.phone,
      });
    }
  }, [student]);

  const handleSubmit = async (values: typeof form.values) => {
    if (!student) return;

    try {
      const { error } = await studentService.updateStudent(student.id, values);

      if (error) {
        throw error;
      }

      notifications.show({
        title: "Thành công",
        message: "Cập nhật học viên thành công",
        color: "green",
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      notifications.show({
        title: "Lỗi",
        message:
          error instanceof Error
            ? error.message
            : "Không thể cập nhật học viên",
        color: "red",
      });
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Title order={3}>Cập nhật thông tin học viên</Title>}
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
            label="Email"
            placeholder="hocvien@example.com"
            {...form.getInputProps("email")}
          />

          <TextInput
            label="Số điện thoại"
            placeholder="Nhập số điện thoại"
            {...form.getInputProps("phone")}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" loading={form.submitting}>
              Cập nhật
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
