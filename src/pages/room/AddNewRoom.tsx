import {
  Button,
  Group,
  Modal,
  Stack,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { roomService } from "../../supabase/services/room.service";

interface AddNewRoomProps {
  opened: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddNewRoom({
  opened,
  onClose,
  onSuccess,
}: AddNewRoomProps) {
  const form = useForm({
    initialValues: {
      room_name: "",
      description: "",
    },
    validate: {
      room_name: (value) =>
        value.trim().length < 1 ? "Tên phòng không được để trống" : null,
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const { data, error } = await roomService.createRoom(values);

      if (error) {
        throw error;
      }

      if (data) {
        notifications.show({
          title: "Thành công",
          message: "Thêm phòng mới thành công",
          color: "green",
        });
        form.reset();
        onSuccess();
        onClose();
      }
    } catch (error) {
      notifications.show({
        title: "Lỗi",
        message:
          error instanceof Error ? error.message : "Không thể thêm phòng mới",
        color: "red",
      });
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Thêm phòng mới" size="lg">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="Tên phòng"
            placeholder="Nhập tên phòng"
            required
            {...form.getInputProps("room_name")}
          />
          <Textarea
            label="Mô tả"
            placeholder="Nhập mô tả phòng"
            {...form.getInputProps("description")}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" loading={form.submitting}>
              Thêm phòng
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
