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
  const form = useForm({
    initialValues: {
      transcript: "",
      difficulty: "medium" as "easy" | "medium" | "hard",
      category_id: initialData?.category_id || "",
    },
    validate: {
      transcript: (value) => (value ? null : "Nội dung là bắt buộc"),
      category_id: (value) => (value ? null : "Danh mục là bắt buộc"),
    },
    touchTrigger: "change",
  });

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (initialData) {
      form.setValues({
        transcript: initialData.transcript || "",
        difficulty: initialData.difficulty || "medium",
        category_id: initialData.category_id || "",
      });
    }
  }, [form, initialData]);

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
    if (!initialData && !audioFile) {
      return;
    }

    const exerciseData = {
      transcript: values.transcript,
      difficulty: values.difficulty,
      category_id: values.category_id,
    };
    onSubmit(exerciseData, audioFile);
  });

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
          label="Tệp âm thanh"
          placeholder={
            initialData ? "Tải lên tệp âm thanh mới" : "Tải lên tệp âm thanh"
          }
          accept="audio/*"
          required={!initialData}
          value={audioFile}
          onChange={(file) => {
            setAudioFile(file);
            form.validate();
          }}
          leftSection={<IconUpload size={16} />}
          mb="md"
          disabled={isSubmitting}
          error={!initialData && !audioFile ? "Tệp âm thanh là bắt buộc" : null}
        />

        <Textarea
          label="Nội dung"
          placeholder="Nhập chính xác nội dung của đoạn âm thanh"
          required
          minRows={4}
          mb="md"
          disabled={isSubmitting}
          {...form.getInputProps("transcript")}
        />

        <Group grow mb="md">
          <Select
            label="Danh mục"
            placeholder="Chọn danh mục"
            required
            data={categoryOptions}
            disabled={isSubmitting}
            {...form.getInputProps("category_id")}
          />

          <Select
            label="Độ khó"
            placeholder="Chọn mức độ khó"
            required
            data={[
              { value: "easy", label: "Dễ" },
              { value: "medium", label: "Trung bình" },
              { value: "hard", label: "Khó" },
            ]}
            disabled={isSubmitting}
            {...form.getInputProps("difficulty")}
          />
        </Group>

        {isSubmitting && (
          <Text size="sm" c="blue" fw={500} mb="md">
            Vui lòng đợi trong khi chúng tôi xử lý bài tập của bạn. Không đóng
            hộp thoại này.
          </Text>
        )}

        <Button
          leftSection={<IconUpload size={16} />}
          type="submit"
          loading={isSubmitting}
          disabled={isSubmitting || !isFormValid}
          fullWidth
        >
          {initialData ? "Cập nhật bài tập" : "Tạo bài tập mới"}
        </Button>
      </Box>
    </Paper>
  );
}
