import { Badge, Container, Group, Text, Title, Tooltip } from "@mantine/core";
import dayjs from "dayjs";
import { useState } from "react";
import DataTable from "../../components/DataTable";
import { Course } from "../../types/courses";

interface CourseSchedulesProps {
  course: Course;
}

export default function CourseSchedules({ course }: CourseSchedulesProps) {
  const [page, setPage] = useState(1);
  return (
    <Container size="xl">
      <Title order={4} mb="md">
        Lịch học chi tiết
      </Title>

      {course.lesson_details && course.lesson_details.length > 0 ? (
        <DataTable
          data={course.lesson_details}
          keyExtractor={(lesson) => lesson.id}
          page={page}
          onPageChange={setPage}
          itemsPerPage={10}
          columns={[
            {
              key: "date",
              title: "Ngày",
              render: (lesson) => dayjs(lesson.start_time).format("DD/MM/YYYY"),
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
      ) : (
        <Text color="dimmed" py="xl">
          Chưa có lịch học chi tiết
        </Text>
      )}
    </Container>
  );
}
