import { Button, Code, Container, Paper, Title } from "@mantine/core";
import { useState } from "react";

import { courseService } from "../../supabase/services/course.service";

export default function Test() {
  const [res, setRes] = useState<unknown>(null);
  const handleClick = async () => {
    const course_id = "42c42a31-b656-4d1c-8b38-8df9e5c48415";
    const schedules = [
      {
        day_of_week: 1,
        start_time: "15:00",
        end_time: "16:30",
        room_id: "1",
      },
      {
        day_of_week: 2,
        start_time: "9:00",
        end_time: "10:30",
        room_id: "3",
      }
    ];
    const res = await courseService.createScheduleOfCourse(
      course_id,
      schedules
    );

    setRes(res);
  };

  return (
    <Container size="md" py="xl">
      <Title order={3} mb="md">
        API Test
      </Title>
      <Button onClick={handleClick} mb="lg">
        Test
      </Button>
      <Paper p="md" withBorder>
        <Title order={4} mb="sm">
          Kết quả:
        </Title>
        <Code
          block
          style={{
            whiteSpace: "pre-wrap",
            maxHeight: "400px",
            overflow: "auto",
          }}
        >
          {JSON.stringify(res, null, 2)}
        </Code>
      </Paper>
    </Container>
  );
}
