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
import dayjs from "dayjs";
import { Teacher } from "../../types/teacher";

interface TeacherDetailProps {
  teacher: Teacher | null;
  opened: boolean;
  onClose: () => void;
}

export default function TeacherDetail({
  teacher,
  opened,
  onClose,
}: TeacherDetailProps) {
  if (!teacher) {
    return null;
  }

  const teacherInfo = [
    { label: "Họ", value: teacher.last_name },
    { label: "Tên", value: teacher.first_name },
    { label: "Email", value: teacher.email },
    { label: "Số điện thoại", value: teacher.phone },
    {
      label: "Ngày đăng ký",
      value: teacher.created_at
        ? dayjs(teacher.created_at).format("DD-MM-YYYY")
        : "N/A",
    },
  ];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Title order={3}>Thông tin giáo viên</Title>}
      size="lg"
      radius="md"
    >
      <Paper p="md" withBorder>
        <Stack>
          <Text size="xl" fw={700}>
            {teacher.first_name} {teacher.last_name}
          </Text>

          <Grid>
            {teacherInfo.map((item, index) => (
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
