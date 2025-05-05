import {
  Box,
  Button,
  FileInput,
  Group,
  LoadingOverlay,
  Paper,
  Select,
  Text,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconUpload } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { ListeningCategory, ListeningExercise } from "../../types/listening";

interface UploadExerciseFormProps {
  onSubmit: (
    exercise: Partial<ListeningExercise>,
    audioFile: File | null
  ) => void;
  initialData?: ListeningExercise | null;
  isSubmitting?: boolean;
  categories: ListeningCategory[];
}

export function UploadExerciseForm({
  onSubmit,
  initialData,
  isSubmitting = false,
  categories,
}: UploadExerciseFormProps) {
  // Use Mantine form with validation
  const form = useForm({
    initialValues: {
      transcript: "",
      difficulty: "medium" as "easy" | "medium" | "hard",
      category_id: initialData?.category_id || "",
    },
    validate: {
      transcript: (value) => (value ? null : "Content is required"),
      category_id: (value) => (value ? null : "Category is required"),
    },
    touchTrigger: "change",
  });

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);

  // Initialize form with initialData if in edit mode
  useEffect(() => {
    if (initialData) {
      form.setValues({
        transcript: initialData.transcript || "",
        difficulty: initialData.difficulty || "medium",
        category_id: initialData.category_id || "",
      });
    }
  }, [form, initialData]);

  // Update form validity whenever form values or audioFile changes
  useEffect(() => {
    const formHasNoErrors = Object.keys(form.errors).length === 0;
    const transcriptIsValid = !!form.values.transcript;
    const audioIsValid = !!initialData || !!audioFile;
    const categoryIsValid = !!form.values.category_id;

    setIsFormValid(
      formHasNoErrors && transcriptIsValid && audioIsValid && categoryIsValid
    );
  }, [form.values, form.errors, audioFile, initialData]);

  const handleSubmit = form.onSubmit((values) => {
    // Still validate file separately since it's not part of the form state
    if (!initialData && !audioFile) {
      return; // FileInput will show validation message
    }

    const exerciseData = {
      transcript: values.transcript,
      difficulty: values.difficulty,
      category_id: values.category_id,
    };
    onSubmit(exerciseData, audioFile);
  });

  // Transform categories for Select component
  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: `${category.type} ${category.index}`,
  }));

  return (
    <Paper p="md" withBorder style={{ position: "relative" }}>
      <LoadingOverlay
        visible={isSubmitting}
        overlayProps={{ blur: 2 }}
        loaderProps={{ size: "md", color: "blue" }}
      />

      <Box component="form" onSubmit={handleSubmit}>
        <FileInput
          label="Audio File"
          placeholder={
            initialData ? "Upload new audio file" : "Upload audio file"
          }
          accept="audio/*"
          required={!initialData}
          value={audioFile}
          onChange={(file) => {
            setAudioFile(file);
            // Force validation on file change
            form.validate();
          }}
          leftSection={<IconUpload size={16} />}
          mb="md"
          disabled={isSubmitting}
          error={!initialData && !audioFile ? "Audio file is required" : null}
        />

        <Textarea
          label="Content"
          placeholder="Enter the exact transcript of the audio"
          required
          minRows={4}
          mb="md"
          disabled={isSubmitting}
          {...form.getInputProps("transcript")}
        />

        <Group grow mb="md">
          <Select
            label="Category"
            placeholder="Select a category"
            required
            data={categoryOptions}
            disabled={isSubmitting}
            {...form.getInputProps("category_id")}
          />

          <Select
            label="Difficulty"
            placeholder="Select difficulty level"
            required
            data={[
              { value: "easy", label: "Easy" },
              { value: "medium", label: "Medium" },
              { value: "hard", label: "Hard" },
            ]}
            disabled={isSubmitting}
            {...form.getInputProps("difficulty")}
          />
        </Group>

        {isSubmitting && (
          <Text size="sm" c="blue" fw={500} mb="md">
            Please wait while we process your exercise. Do not close this
            dialog.
          </Text>
        )}

        <Button
          leftSection={<IconUpload size={16} />}
          type="submit"
          loading={isSubmitting}
          disabled={isSubmitting || !isFormValid}
          fullWidth
        >
          {initialData ? "Update Exercise" : "Create New Exercise"}
        </Button>
      </Box>
    </Paper>
  );
}
