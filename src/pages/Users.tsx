import { Container, Title, Text } from "@mantine/core";

export function Users() {
  return (
    <Container>
      <Title order={2} mb="md">
        Users
      </Title>
      <Text>Manage your users here.</Text>
    </Container>
  );
}

export default Users;
