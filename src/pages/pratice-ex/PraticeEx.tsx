import { Box, Container, Loader, Modal, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { FilterOption, TableHeader } from "../../components/TableHeader";
import { useCategories } from "../../hooks/useCategories";
import { useListening } from "../../hooks/useListening";
import { uploadAudioFile } from "../../supabase/upload-service";
import { ListeningExercise } from "../../types/listening";
import { ExerciseDetails } from "./ExerciseDetails";
import { ExerciseTable } from "./ExerciseTable";
import { UploadExerciseForm } from "./UploadExerciseForm";

export default function PraticeEx() {
  const {
    exercises,
    isLoading,
    isError,
    error,
    createExercise,
    isCreating,
    updateExercise,
    isUpdating,
    deleteExercise,
    isDeleting,
  } = useListening();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] =
    useState<ListeningExercise | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [difficultyFilter, setDifficultyFilter] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const { categories } = useCategories();

  const handleSubmitNewExercise = async (
    exerciseData: Partial<ListeningExercise>,
    audioFile: File | null
  ) => {
    if (!exerciseData.category_id) {
      notifications.show({
        title: "Lỗi",
        message: "Vui lòng chọn danh mục",
        color: "red",
      });
      return;
    }
    try {
      if (isEditMode && selectedExercise) {
        await new Promise<void>((resolve, reject) => {
          updateExercise(
            {
              id: selectedExercise.id,
              updates: {
                transcript: exerciseData.transcript || "",
                difficulty:
                  (exerciseData.difficulty as "easy" | "medium" | "hard") ||
                  "medium",
              },
            },
            {
              onSuccess: () => {
                setIsModalOpen(false);
                setIsEditMode(false);
                setSelectedExercise(null);
                resolve();
              },
              onError: (error) => {
                reject(error);
              },
            }
          );
        });
      } else if (audioFile) {
        try {
          const audioUrl = await uploadAudioFile(audioFile);

          await new Promise<void>((resolve, reject) => {
            createExercise(
              {
                audio_url: audioUrl,
                transcript: exerciseData.transcript || "",
                difficulty:
                  (exerciseData.difficulty as "easy" | "medium" | "hard") ||
                  "medium",
                category_id: exerciseData.category_id || "",
              },
              {
                onSuccess: () => {
                  setIsModalOpen(false);
                  setIsEditMode(false);
                  setSelectedExercise(null);
                  resolve();
                },
                onError: (error) => {
                  reject(error);
                },
              }
            );
          });
        } catch (error) {
          console.error("Lỗi khi tải lên file âm thanh:", error);
          alert("Lỗi khi tải lên file âm thanh. Vui lòng thử lại.");
        }
      }
    } catch (error) {
      console.error("Lỗi khi lưu bài tập:", error);
      alert("Lỗi khi lưu bài tập. Vui lòng thử lại.");
    }
  };

  const handleDeleteExercise = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài tập này không?")) {
      deleteExercise(id);
    }
  };

  const handleEditExercise = (exercise: ListeningExercise) => {
    setSelectedExercise(exercise);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleViewDetails = (exercise: ListeningExercise) => {
    setSelectedExercise(exercise);
    setIsDetailsModalOpen(true);
  };

  const filters: FilterOption[] = [
    {
      id: "difficulty",
      label: "Độ khó",
      options: [
        { value: "easy", label: "Dễ" },
        { value: "medium", label: "Trung bình" },
        { value: "hard", label: "Khó" },
      ],
      value: difficultyFilter,
      onChange: setDifficultyFilter,
    },
    {
      id: "category",
      label: "Danh mục",
      options: [...new Set(exercises.map((ex) => ex.category?.type || ""))]
        .filter(Boolean)
        .map((category) => ({ value: category, label: category })),
      value: categoryFilter,
      onChange: setCategoryFilter,
    },
  ];

  const filteredData = exercises.filter((exercise) => {
    const matchesSearch =
      searchValue === "" ||
      Object.values(exercise).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(searchValue.toLowerCase())
      );

    const matchesDifficulty =
      difficultyFilter.length === 0 ||
      difficultyFilter.includes(exercise.difficulty);

    const matchesCategory =
      categoryFilter.length === 0 ||
      categoryFilter.includes(exercise.category?.type || "");

    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  const handleClearFilters = () => {
    setDifficultyFilter([]);
    setCategoryFilter([]);
  };

  const isProcessing = isLoading || isCreating || isUpdating || isDeleting;

  return (
    <Container size="100%" py="xl">
      {isProcessing ? (
        <Box py="xl" style={{ textAlign: "center" }}>
          <Loader size="md" />
          <Text mt="md">
            {isLoading
              ? "Đang tải bài tập..."
              : isCreating
              ? "Đang tạo bài tập mới..."
              : isUpdating
              ? "Đang cập nhật bài tập..."
              : "Đang xóa bài tập..."}
          </Text>
        </Box>
      ) : isError ? (
        <Box py="xl" style={{ textAlign: "center" }}>
          <Text c="red">
            Đã xảy ra lỗi:{" "}
            {error instanceof Error ? error.message : "Không thể tải dữ liệu"}
          </Text>
        </Box>
      ) : (
        <>
          <TableHeader
            searchPlaceholder="Tìm kiếm bài tập..."
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            filters={filters}
            onClearFilters={handleClearFilters}
            addButton={{
              label: "Thêm bài tập mới",
              onClick: () => {
                setIsEditMode(false);
                setSelectedExercise(null);
                setIsModalOpen(true);
              },
            }}
          />

          <div style={{ marginTop: "1rem" }}>
            <ExerciseTable
              exercises={filteredData}
              onDelete={handleDeleteExercise}
              onEdit={handleEditExercise}
              onViewDetails={handleViewDetails}
              page={page}
              onPageChange={setPage}
            />
          </div>
        </>
      )}

      <Modal
        opened={isModalOpen}
        onClose={() => {
          if (!isCreating && !isUpdating) {
            setIsModalOpen(false);
            setIsEditMode(false);
            setSelectedExercise(null);
          }
        }}
        closeOnClickOutside={!isCreating && !isUpdating}
        closeOnEscape={!isCreating && !isUpdating}
        withCloseButton={!isCreating && !isUpdating}
        title={isEditMode ? "Chỉnh sửa bài tập" : "Tạo bài tập mới"}
        size="lg"
      >
        <UploadExerciseForm
          onSubmit={handleSubmitNewExercise}
          initialData={isEditMode ? selectedExercise : undefined}
          isSubmitting={isCreating || isUpdating}
          categories={categories}
        />
      </Modal>

      <Modal
        opened={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Chi tiết bài tập"
        size="lg"
      >
        {selectedExercise && (
          <ExerciseDetails
            exercise={selectedExercise}
            onEdit={handleEditExercise}
            onDelete={handleDeleteExercise}
            onClose={() => setIsDetailsModalOpen(false)}
          />
        )}
      </Modal>
    </Container>
  );
}
