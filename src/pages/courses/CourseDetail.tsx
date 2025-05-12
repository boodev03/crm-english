import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  Group,
  Paper,
  Skeleton,
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconArrowLeft,
  IconCalendar,
  IconClock,
  IconCoin,
  IconMapPin,
  IconUser,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
import DataTable from "../../components/DataTable";
import { useCourseById } from "../../hooks/useCourseById";

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const { course, isLoading, isError } = useCourseById(id || "");
  const navigate = useNavigate();

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

  // Map day of week number to Vietnamese day name
  const getDayOfWeekName = (dayNumber: number) => {
    const days = [
      "Chủ nhật",
      "Thứ hai",
      "Thứ ba",
      "Thứ tư",
      "Thứ năm",
      "Thứ sáu",
      "Thứ bảy",
    ];
    return days[dayNumber];
  };

  // Group lesson details by day of week for weekly schedule
  const weeklySchedule = course.lesson_details?.reduce((acc, lesson) => {
    const dayOfWeek = dayjs(lesson.start_time).day();
    const key = `${dayOfWeek}-${dayjs(lesson.start_time).format(
      "HH:mm"
    )}-${dayjs(lesson.end_time).format("HH:mm")}-${lesson.room_id}`;

    if (!acc[key]) {
      acc[key] = {
        dayOfWeek,
        startTime: dayjs(lesson.start_time).format("HH:mm"),
        endTime: dayjs(lesson.end_time).format("HH:mm"),
        roomId: lesson.room_id,
        roomName: lesson.room?.room_name,
      };
    }

    return acc;
  }, {} as Record<string, { dayOfWeek: number; startTime: string; endTime: string; roomId: string; roomName?: string }>);

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

      <Paper shadow="sm" p="lg" withBorder>
        <Group justify="space-between" mb="md">
          <Title order={2}>{course.course_name}</Title>
        </Group>

        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card withBorder p="md" h="100%" radius="md">
              <Title order={4} mb="md">
                Thông tin khóa học
              </Title>

              <Group gap="xs" mb="md">
                <IconUser size={18} />
                <Text fw={500}>Giáo viên chính:</Text>
                {course.teacher ? (
                  <Text>
                    {course.teacher.first_name + " " + course.teacher.last_name}
                  </Text>
                ) : (
                  <Badge color="gray">Chưa phân công</Badge>
                )}
              </Group>

              <Group gap="xs" mb="md">
                <IconCalendar size={18} />
                <Text fw={500}>Thời gian khóa học:</Text>
                <Text>
                  {dayjs(course.start_time).format("DD/MM/YYYY")} -{" "}
                  {dayjs(course.end_time).format("DD/MM/YYYY")}
                </Text>
              </Group>

              <Group gap="xs" mb="md">
                <IconCoin size={18} />
                <Text fw={500}>Học phí:</Text>
                <Text fw={600}>{course.tuition.toLocaleString()} VND</Text>
              </Group>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card withBorder p="md" h="100%" radius="md">
              <Title order={4} mb="md">
                Lịch học hàng tuần
              </Title>

              {weeklySchedule && Object.values(weeklySchedule).length > 0 ? (
                <Stack gap="md">
                  {Object.values(weeklySchedule).map((schedule, index) => (
                    <Box
                      key={index}
                      p="sm"
                      style={{
                        border: "1px solid #e9ecef",
                        borderRadius: "8px",
                        backgroundColor: "#f8f9fa",
                      }}
                    >
                      <Group gap="xs" mb="xs">
                        <IconCalendar size={16} />
                        <Text fw={600}>
                          {getDayOfWeekName(schedule.dayOfWeek)}
                        </Text>
                      </Group>

                      <Group gap="xs" mb="xs">
                        <IconClock size={16} />
                        <Text>
                          {schedule.startTime} - {schedule.endTime}
                        </Text>
                      </Group>

                      <Group gap="xs">
                        <IconMapPin size={16} />
                        <Text>
                          Phòng: {schedule.roomName || schedule.roomId}
                        </Text>
                      </Group>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Text color="dimmed" py="xl">
                  Chưa có lịch học hàng tuần
                </Text>
              )}
            </Card>
          </Grid.Col>
        </Grid>

        {course.lesson_details && course.lesson_details.length > 0 && (
          <>
            <Divider my="lg" />
            <Title order={3} mb="md">
              Lịch học chi tiết
            </Title>
            <DataTable
              data={course.lesson_details}
              keyExtractor={(lesson) => lesson.id}
              columns={[
                {
                  key: "date",
                  title: "Ngày",
                  render: (lesson) =>
                    dayjs(lesson.start_time).format("DD/MM/YYYY"),
                },
                {
                  key: "time",
                  title: "Thời gian",
                  render: (lesson) => (
                    <>
                      {dayjs(lesson.start_time).format("HH:mm")} -{" "}
                      {dayjs(lesson.end_time).format("HH:mm")}
                    </>
                  ),
                },
                {
                  key: "room",
                  title: "Phòng học",
                  render: (lesson) => lesson.room?.room_name || lesson.room_id,
                },
                {
                  key: "teacher",
                  title: "Giáo viên",
                  render: (lesson) => (
                    <>
                      {lesson.teacher ? (
                        <Group gap="xs">
                          <Text fz={14}>
                            {lesson.teacher.first_name +
                              " " +
                              lesson.teacher.last_name}
                          </Text>
                          {lesson.teacher_id !== course.teacher_id && (
                            <Tooltip label="Giáo viên thay thế">
                              <Badge color="orange" size="xs">
                                Thay thế
                              </Badge>
                            </Tooltip>
                          )}
                        </Group>
                      ) : (
                        <Badge color="gray">Chưa phân công</Badge>
                      )}
                    </>
                  ),
                },
                {
                  key: "status",
                  title: "Trạng thái",
                  render: (lesson) => (
                    <Badge
                      color={
                        lesson.status === "Chưa diễn ra"
                          ? "blue"
                          : lesson.status === "Đã diễn ra"
                          ? "green"
                          : "gray"
                      }
                    >
                      {lesson.status}
                    </Badge>
                  ),
                },
              ]}
              emptyMessage="Không có lịch học chi tiết"
            />
          </>
        )}
      </Paper>
    </Container>
  );
}
