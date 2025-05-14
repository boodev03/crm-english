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
import { Student } from "../../types/student";

interface StudentDetailProps {
  student: Student | null;
  opened: boolean;
  onClose: () => void;
}

export default function StudentDetail({
  student,
  opened,
  onClose,
}: StudentDetailProps) {
  if (!student) {
    return null;
  }

  const studentInfo = [
    { label: "Họ", value: student.last_name },
    { label: "Tên", value: student.first_name },
    { label: "Email", value: student.email },
    { label: "Số điện thoại", value: student.phone },
    {
      label: "Ngày đăng ký",
      value: student.created_at
        ? dayjs(student.created_at).format("DD-MM-YYYY")
        : "N/A",
    },
  ];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Title order={3}>Thông tin học viên</Title>}
      size="lg"
      radius="md"
    >
      <Paper p="md" withBorder>
        <Stack>
          <Text size="xl" fw={700}>
            {student.first_name} {student.last_name}
          </Text>

          <Grid>
            {studentInfo.map((item, index) => (
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
