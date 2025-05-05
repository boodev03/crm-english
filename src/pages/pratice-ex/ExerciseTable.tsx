import { Badge, Menu, ActionIcon } from "@mantine/core";
import {
  IconEdit,
  IconTrash,
  IconEye,
  IconDotsVertical,
} from "@tabler/icons-react";
import DataTable, { Column } from "../../components/common/DataTable";
import {
  ListeningExercise,
  ListeningExerciseWithIndex,
} from "../../types/listening";

interface ExerciseTableProps {
  exercises: ListeningExerciseWithIndex[];
  onDelete: (id: string) => void;
  onEdit?: (exercise: ListeningExercise) => void;
  onViewDetails?: (exercise: ListeningExercise) => void;
  page: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
}

export function ExerciseTable({
  exercises,
  onDelete,
  onEdit,
  onViewDetails,
  page,
  onPageChange,
  itemsPerPage = 10,
}: ExerciseTableProps) {
  // Define columns for the data table
  const columns: Column<
    ListeningExerciseWithIndex & Record<string, unknown>
  >[] = [
    {
      key: "index",
      title: "Index",
      render: (exercise) => exercise.index,
    },
    {
      key: "category",
      title: "Category",
      render: (exercise) =>
        `${exercise.category?.type} ${exercise.category?.index}`,
    },
    {
      key: "difficulty",
      title: "Difficulty",
      render: (exercise) => (
        <Badge
          size="sm"
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
      ),
    },
    {
      key: "created_at",
      title: "Created Date",
      render: (exercise) => new Date(exercise.created_at).toLocaleDateString(),
    },
  ];

  return (
    <DataTable<ListeningExerciseWithIndex & Record<string, unknown>>
      data={
        exercises as (ListeningExerciseWithIndex & Record<string, unknown>)[]
      }
      columns={columns}
      keyExtractor={(exercise) => exercise.id}
      page={page}
      onPageChange={onPageChange}
      itemsPerPage={itemsPerPage}
      emptyMessage="No exercises found"
      actionColumn={{
        width: 80,
        render: (exercise) => (
          <Menu position="bottom-end" withArrow>
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray">
                <IconDotsVertical size={16} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              {onViewDetails && (
                <Menu.Item
                  leftSection={<IconEye size={14} />}
                  onClick={() => onViewDetails(exercise as ListeningExercise)}
                >
                  View Details
                </Menu.Item>
              )}
              {onEdit && (
                <Menu.Item
                  leftSection={<IconEdit size={14} />}
                  onClick={() => onEdit(exercise as ListeningExercise)}
                >
                  Edit
                </Menu.Item>
              )}
              <Menu.Item
                leftSection={<IconTrash size={14} />}
                color="red"
                onClick={() => onDelete(exercise.id)}
              >
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        ),
      }}
    />
  );
}
