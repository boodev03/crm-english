import { Badge, Button, Group, Paper, Text } from "@mantine/core";
import { ListeningExercise } from "../../types/listening";

interface ExerciseDetailsProps {
  exercise: ListeningExercise;
  onEdit?: (exercise: ListeningExercise) => void;
  onDelete?: (id: string) => void;
  onClose?: () => void;
}

export function ExerciseDetails({
  exercise,
  onEdit,
  onDelete,
  onClose,
}: ExerciseDetailsProps) {
  const handleEdit = () => {
    if (onClose) onClose();
    if (onEdit) onEdit(exercise);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(exercise.id);
      if (onClose) onClose();
    }
  };

  return (
    <Paper p="md">
      <Group mt="md" mb="md">
        <Badge
          color={
            exercise.difficulty === "easy"
              ? "green"
              : exercise.difficulty === "medium"
              ? "yellow"
              : "red"
          }
        >
          {exercise.difficulty === "easy"
            ? "Easy"
            : exercise.difficulty === "medium"
            ? "Medium"
            : "Hard"}
        </Badge>
        {exercise.topic && <Badge color="blue">{exercise.topic}</Badge>}
      </Group>

      <Text size="sm" fw={500} mb="xs">
        ID: {exercise.id}
      </Text>

      <Text size="sm" fw={500} mb="xs">
        Created Date:
      </Text>
      <Text size="sm" mb="md">
        {new Date(exercise.created_at).toLocaleString()}
      </Text>

      <Text size="sm" fw={500} mb="xs">
        Content:
      </Text>
      <Paper p="xs" withBorder mb="xl">
        <Text>{exercise.transcript}</Text>
      </Paper>

      <Text size="sm" fw={500} mb="xs">
        Audio File:
      </Text>
      <audio
        controls
        src={exercise.audio_url}
        style={{ width: "100%", marginBottom: "1rem" }}
      />

      <Group justify="space-between">
        <Button variant="outline" onClick={handleEdit}>
          Edit Exercise
        </Button>
        <Button variant="filled" color="red" onClick={handleDelete}>
          Delete Exercise
        </Button>
      </Group>
    </Paper>
  );
}
