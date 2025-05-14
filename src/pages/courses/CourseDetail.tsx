import {
  Alert,
  Button,
  Container,
  Group,
  Paper,
  Skeleton,
  Title,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconArrowLeft,
  IconUserPlus,
} from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCourseById } from "../../hooks/useCourseById";
import AddStudentToCourse from "./AddStudentToCourse";
import CourseInformation from "./CourseInformation";
import CourseSchedules from "./CourseSchedules";
import CourseStudentList from "./CourseStudentList";

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const { course, isLoading, isError, refetch } = useCourseById(id || "");
  const navigate = useNavigate();
  const [addStudentModalOpened, setAddStudentModalOpened] = useState(false);

  if (isLoading) {
    return (
      <Container size="lg">
        <Paper shadow="xs" p="md" withBorder>
          <Skeleton height={40} mb="md" />
          <Skeleton height={20} mb="sm" />
          <Skeleton height={20} mb="sm" />
          <Skeleton height={20} mb="sm" />
        </Paper>
      </Container>
    );
  }

  if (isError || !course) {
    return (
      <Container size="lg">
        <Alert icon={<IconAlertCircle size={16} />} title="Lỗi" color="red">
          Không thể tải thông tin khóa học. Vui lòng thử lại sau.
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="lg">
      <Button
        leftSection={<IconArrowLeft size={16} />}
        variant="outline"
        mb="md"
        onClick={() => navigate("/courses")}
      >
        Quay lại
      </Button>

      <Paper
        shadow="sm"
        p="lg"
        withBorder
        style={{
          gap: 40,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Group justify="space-between" mb="md">
          <Title order={2}>{course.course_name}</Title>
          <Button
            leftSection={<IconUserPlus size={16} />}
            onClick={() => setAddStudentModalOpened(true)}
          >
            Thêm học viên
          </Button>
        </Group>

        <CourseInformation course={course} />
        <CourseSchedules course={course} />
        <CourseStudentList course={course} refetch={refetch} />
      </Paper>

      <AddStudentToCourse
        opened={addStudentModalOpened}
        onClose={() => setAddStudentModalOpened(false)}
        courseId={course.id}
        onSuccess={() => {
          refetch();
          setAddStudentModalOpened(false);
        }}
      />
    </Container>
  );
}
