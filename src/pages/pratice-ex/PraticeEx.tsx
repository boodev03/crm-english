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
  // Use the hook for data fetching and mutations
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
        title: "Error",
        message: "Please select a category",
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
                // Close modal only after successful update
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
          // Use the upload service to get a real URL from Supabase storage
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
                  // Close modal only after successful creation
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
          console.error("Error uploading audio file:", error);
          alert("Error uploading audio file. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error during exercise submission:", error);
      alert("Error saving exercise. Please try again.");
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

  // Filter options
  const filters: FilterOption[] = [
    {
      id: "difficulty",
      label: "Difficulty",
      options: [
        { value: "easy", label: "Easy" },
        { value: "medium", label: "Medium" },
        { value: "hard", label: "Hard" },
      ],
      value: difficultyFilter,
      onChange: setDifficultyFilter,
    },
    {
      id: "category",
      label: "Category",
      options: [...new Set(exercises.map((ex) => ex.category?.type || ""))]
        .filter(Boolean)
        .map((category) => ({ value: category, label: category })),
      value: categoryFilter,
      onChange: setCategoryFilter,
    },
  ];

  // Filter and search data
  const filteredData = exercises.filter((exercise) => {
    // Apply search filter
    const matchesSearch =
      searchValue === "" ||
      Object.values(exercise).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(searchValue.toLowerCase())
      );

    // Apply difficulty filter
    const matchesDifficulty =
      difficultyFilter.length === 0 ||
      difficultyFilter.includes(exercise.difficulty);

    // Apply topic filter
    const matchesCategory =
      categoryFilter.length === 0 ||
      categoryFilter.includes(exercise.category?.type || "");

    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  // Clear all filters
  const handleClearFilters = () => {
    setDifficultyFilter([]);
    setCategoryFilter([]);
  };

  // Determine if we're in a loading state for any operation
  const isProcessing = isLoading || isCreating || isUpdating || isDeleting;

  return (
    <Container size="100%" py="xl">
      {isProcessing ? (
        <Box py="xl" style={{ textAlign: "center" }}>
          <Loader size="md" />
          <Text mt="md">
            {isLoading
              ? "Loading exercises..."
              : isCreating
              ? "Creating new exercise..."
              : isUpdating
              ? "Updating exercise..."
              : "Deleting exercise..."}
          </Text>
        </Box>
      ) : isError ? (
        <Box py="xl" style={{ textAlign: "center" }}>
          <Text c="red">
            An error occurred:{" "}
            {error instanceof Error ? error.message : "Unable to load data"}
          </Text>
        </Box>
      ) : (
        <>
          <TableHeader
            searchPlaceholder="Search exercises..."
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            filters={filters}
            onClearFilters={handleClearFilters}
            addButton={{
              label: "Add New Exercise",
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

      {/* Create/Edit Modal */}
      <Modal
        opened={isModalOpen}
        onClose={() => {
          // Only allow closing if not in the process of creating or updating
          if (!isCreating && !isUpdating) {
            setIsModalOpen(false);
            setIsEditMode(false);
            setSelectedExercise(null);
          }
        }}
        closeOnClickOutside={!isCreating && !isUpdating}
        closeOnEscape={!isCreating && !isUpdating}
        withCloseButton={!isCreating && !isUpdating}
        title={isEditMode ? "Edit Exercise" : "Create New Exercise"}
        size="lg"
      >
        <UploadExerciseForm
          onSubmit={handleSubmitNewExercise}
          initialData={isEditMode ? selectedExercise : undefined}
          isSubmitting={isCreating || isUpdating}
          categories={categories}
        />
      </Modal>

      {/* Details Modal */}
      <Modal
        opened={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Exercise Details"
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
