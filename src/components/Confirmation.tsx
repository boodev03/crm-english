import { Button, Group, Modal, Stack, Text, Title } from "@mantine/core";

interface ConfirmationProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmColor?: string;
  loading?: boolean;
}

export default function Confirmation({
  opened,
  onClose,
  onConfirm,
  title = "Xác nhận",
  message = "Bạn có chắc chắn muốn thực hiện hành động này?",
  confirmLabel = "Xác nhận",
  cancelLabel = "Hủy",
  confirmColor = "red",
  loading = false,
}: ConfirmationProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Title order={3}>{title}</Title>}
      centered
    >
      <Stack>
        <Text>{message}</Text>
        <Group justify="flex-end" mt="md">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button color={confirmColor} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
