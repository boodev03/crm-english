import { Container, Stack, Text, Title, Center } from "@mantine/core";
import { IconSchool } from "@tabler/icons-react";

export function Dashboard() {
  return (
    <Container size="lg">
      <Stack gap="xl" align="center" mt={200}>
        <Center>
          <IconSchool size={48} color="#fe731a" />
        </Center>
        <Title order={2} ta="center">
          Chào mừng đến với CRM English
        </Title>

        <Text color="dimmed" size="sm" ta="center">
          Quản lý trường học tiếng Anh của bạn một cách hiệu quả với hệ thống
          CRM toàn diện của chúng tôi.
        </Text>
      </Stack>
    </Container>
  );
}

export default Dashboard;
