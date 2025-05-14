import {
  Badge,
  Box,
  Card,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconCalendar,
  IconClock,
  IconCoin,
  IconMapPin,
  IconUser,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import { Course } from "../../types/courses";

interface CourseInformationProps {
  course: Course;
}

export default function CourseInformation({ course }: CourseInformationProps) {
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
    <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
      <Card withBorder p="md" radius="md">
        <Title order={4} mb="md" fz={16}>
          Thông tin khóa học
        </Title>

        <Stack gap="md">
          <Group gap="xs">
            <IconUser size={18} />
            <Text fw={500} fz={14}>
              Giáo viên chính:
            </Text>
            {course.teacher ? (
              <Text fz={14}>
                {course.teacher.first_name + " " + course.teacher.last_name}
              </Text>
            ) : (
              <Badge color="gray" fz={14}>
                Chưa phân công
              </Badge>
            )}
          </Group>

          <Group gap="xs">
            <IconCalendar size={18} />
            <Text fw={500} fz={14}>
              Thời gian khóa học:
            </Text>
            <Text fz={14}>
              {dayjs(course.start_time).format("DD/MM/YYYY")} -{" "}
              {dayjs(course.end_time).format("DD/MM/YYYY")}
            </Text>
          </Group>

          <Group gap="xs">
            <IconCoin size={18} />
            <Text fw={500} fz={14}>
              Học phí:
            </Text>
            <Text fw={600} fz={14}>
              {course.tuition.toLocaleString()} VND
            </Text>
          </Group>
        </Stack>
      </Card>

      <Card withBorder p="md" radius="md">
        <Title order={4} mb="md" fz={16}>
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
                  <Text fw={600} fz={14}>
                    {getDayOfWeekName(schedule.dayOfWeek)}
                  </Text>
                </Group>

                <Group gap="xs" mb="xs">
                  <IconClock size={16} />
                  <Text fz={14}>
                    {schedule.startTime} - {schedule.endTime}
                  </Text>
                </Group>

                <Group gap="xs">
                  <IconMapPin size={16} />
                  <Text fz={14}>
                    Phòng: {schedule.roomName || schedule.roomId}
                  </Text>
                </Group>
              </Box>
            ))}
          </Stack>
        ) : (
          <Text color="dimmed" py="xl" fz={14}>
            Chưa có lịch học hàng tuần
          </Text>
        )}
      </Card>
    </SimpleGrid>
  );
}
