import { ActionIcon, Badge, Menu } from "@mantine/core";
import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconTrash,
} from "@tabler/icons-react";
import DataTable, { Column } from "../../components/DataTable";
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
      title: "STT",
      render: (exercise) => exercise.index,
    },
    {
      key: "category",
      title: "Danh mục",
      render: (exercise) =>
        `${exercise.category?.type} ${exercise.category?.index}`,
    },
    {
      key: "difficulty",
      title: "Độ khó",
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
            ? "Dễ"
            : exercise.difficulty === "medium"
            ? "Trung bình"
            : "Khó"}
        </Badge>
      ),
    },
    {
      key: "created_at",
      title: "Ngày tạo",
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
      emptyMessage="Không tìm thấy bài tập nào"
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
                  Xem chi tiết
                </Menu.Item>
              )}
              {onEdit && (
                <Menu.Item
                  leftSection={<IconEdit size={14} />}
                  onClick={() => onEdit(exercise as ListeningExercise)}
                >
                  Chỉnh sửa
                </Menu.Item>
              )}
              <Menu.Item
                leftSection={<IconTrash size={14} />}
                color="red"
                onClick={() => onDelete(exercise.id)}
              >
                Xóa
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        ),
      }}
    />
  );
}
