import {
  Button,
  Grid,
  Group,
  Modal,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { Room } from "../../types/room";
import dayjs from "dayjs";

interface RoomDetailProps {
  room: Room | null;
  opened: boolean;
  onClose: () => void;
}

export default function RoomDetail({ room, opened, onClose }: RoomDetailProps) {
  if (!room) return null;

  const roomInfo = [
    { label: "Tên phòng", value: room.room_name },
    { label: "Mô tả", value: room.description || "Không có mô tả" },
    {
      label: "Ngày tạo",
      value: room.created_at
        ? dayjs(room.created_at).format("DD-MM-YYYY")
        : "N/A",
    },
  ];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Title order={3}>Thông tin phòng</Title>}
      size="lg"
      radius="md"
    >
      <Paper p="md" withBorder>
        <Stack>
          <Grid>
            {roomInfo.map((item, index) => (
              <Grid.Col span={6} key={index}>
                <Stack>
                  <Text size="sm" color="dimmed">
                    {item.label}
                  </Text>
                  <Text>{item.value}</Text>
                </Stack>
              </Grid.Col>
            ))}
          </Grid>

          <Group justify="flex-end" mt="md">
            <Button variant="outline" onClick={onClose}>
              Đóng
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Modal>
  );
}
