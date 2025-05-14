import { Button, Code, Container, Paper, Title } from "@mantine/core";
import { useState } from "react";

import { enrollmentService } from "../../supabase/services/enrollment.service";

export default function Test() {
  const [res, setRes] = useState<unknown>(null);
  const handleClick = async () => {
    const course_id = "2232ef8b-bf97-4c2e-8048-d047ee2a5183";
    const student_id = "f685221d-2045-49f7-8fca-4aa179fcbece";
    const enrollment_id = "3dd242b1-5e25-4285-b7e7-55c468771269";

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
