import { Container, Text, Title } from "@mantine/core";

export function Dashboard() {
  return (
    <Container>
      <Title order={2} mb="md">
        Dashboard
      </Title>
      <Text>Welcome to the CRM English dashboard.</Text>
    </Container>
  );
}

export default Dashboard;
