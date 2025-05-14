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
import { Room } from "../../types/room";
import { useEffect } from "react";

interface EditRoomProps {
  room: Room | null;
  opened: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditRoom({
  room,
  opened,
  onClose,
  onSuccess,
}: EditRoomProps) {
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

  useEffect(() => {
    if (room) {
      form.setValues({
        room_name: room.room_name,
        description: room.description,
      });
    }
  }, [room]);

  const handleSubmit = async (values: typeof form.values) => {
    if (!room) return;

    try {
      const { data, error } = await roomService.updateRoom(room.id, values);

      if (error) {
        throw error;
      }

      if (data) {
        notifications.show({
          title: "Thành công",
          message: "Cập nhật phòng thành công",
          color: "green",
        });
        onSuccess();
        onClose();
      }
    } catch (error) {
      notifications.show({
        title: "Lỗi",
        message:
          error instanceof Error ? error.message : "Không thể cập nhật phòng",
        color: "red",
      });
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Chỉnh sửa phòng" size="lg">
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
              Lưu
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
