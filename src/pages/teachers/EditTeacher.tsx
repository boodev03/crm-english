import { Button, Group, Modal, Stack, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useEffect } from "react";
import { teacherService } from "../../supabase/services/teacher.service";
import { Teacher } from "../../types/teacher";

interface EditTeacherProps {
  teacher: Teacher | null;
  opened: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function EditTeacher({
  teacher,
  opened,
  onClose,
  onSuccess,
}: EditTeacherProps) {
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
    if (teacher) {
      form.setValues({
        first_name: teacher.first_name,
        last_name: teacher.last_name,
        email: teacher.email,
        phone: teacher.phone,
      });
    }
  }, [teacher]);

  const handleSubmit = async (values: typeof form.values) => {
    if (!teacher) return;

    try {
      const { error } = await teacherService.updateTeacher(teacher.id, values);

      if (error) {
        throw error;
      }

      notifications.show({
        title: "Thành công",
        message: "Cập nhật giáo viên thành công",
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
            : "Không thể cập nhật giáo viên",
        color: "red",
      });
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Title order={3}>Cập nhật thông tin giáo viên</Title>}
      size="lg"
      radius="md"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="Tên"
            placeholder="Nhập tên giáo viên"
            {...form.getInputProps("first_name")}
          />

          <TextInput
            label="Họ"
            placeholder="Nhập họ giáo viên"
            {...form.getInputProps("last_name")}
          />

          <TextInput
            label="Email"
            placeholder="Nhập email"
            type="email"
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
