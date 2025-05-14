/* eslint-disable react-hooks/exhaustive-deps */
import {
  Badge,
  Button,
  Divider,
  Group,
  Modal,
  MultiSelect,
  Stack,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconUserPlus } from "@tabler/icons-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useStudents } from "../../hooks/useStudent";
import { enrollmentService } from "../../supabase/services/enrollment.service";

interface AddStudentToCourseProps {
  opened: boolean;
  onClose: () => void;
  courseId: string;
  onSuccess?: () => void;
  existingStudentIds?: string[];
}

export default function AddStudentToCourse({
  opened,
  onClose,
  courseId,
  onSuccess,
  existingStudentIds = [],
}: AddStudentToCourseProps) {
  const { students } = useStudents();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    initialValues: {
      studentIds: [] as string[],
    },
  });

  // Memoize available students to prevent unnecessary recalculations
  const availableStudents = useMemo(() => {
    if (!students) return [];

    return students
      .filter((student) => !existingStudentIds.includes(student.id))
      .map((student) => ({
        value: student.id,
        label: `${student.first_name} ${student.last_name}`,
        description: `${student.email} | ${student.phone}`,
      }));
  }, [students, existingStudentIds]);

  // Reset form when modal closes
  useEffect(() => {
    if (!opened) {
      form.reset();
    }
  }, [opened]);

  const handleSubmit = useCallback(
    async (values: typeof form.values) => {
      if (values.studentIds.length === 0) {
        notifications.show({
          title: "Chưa chọn học viên",
          message: "Vui lòng chọn ít nhất một học viên để thêm vào khóa học",
          color: "yellow",
        });
        return;
      }

      setIsSubmitting(true);
      try {
        // Create enrollments for each selected student
        const enrollmentPromises = values.studentIds.map((studentId) =>
          enrollmentService.createEnrollment({
            student_id: studentId,
            course_id: courseId,
          })
        );

        const results = await Promise.all(enrollmentPromises);
        const errors = results.filter((result) => result.error);

        if (errors.length > 0) {
          throw new Error("Có lỗi xảy ra khi thêm học viên vào khóa học");
        }

        notifications.show({
          title: "Thành công",
          message: `Đã thêm ${values.studentIds.length} học viên vào khóa học`,
          color: "green",
        });

        if (onSuccess) {
          onSuccess();
        }

        form.reset();
        onClose();
      } catch (error) {
        notifications.show({
          title: "Lỗi",
          message:
            error instanceof Error
              ? error.message
              : "Không thể thêm học viên vào khóa học",
          color: "red",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [courseId, form, onClose, onSuccess]
  );

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group>
          <IconUserPlus size={20} />
          <Text fw={600}>Thêm học viên vào khóa học</Text>
        </Group>
      }
      size="lg"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <MultiSelect
            data={availableStudents}
            searchable
            clearable
            placeholder="Chọn học viên..."
            label="Học viên"
            nothingFoundMessage="Không tìm thấy học viên phù hợp"
            {...form.getInputProps("studentIds")}
          />

          <Divider my="md" />

          <Group justify="space-between">
            <Badge size="lg">
              Đã chọn: {form.values.studentIds.length} học viên
            </Badge>
            <Group>
              <Button variant="outline" onClick={onClose}>
                Hủy
              </Button>
              <Button
                type="submit"
                loading={isSubmitting}
                disabled={form.values.studentIds.length === 0}
              >
                Thêm vào khóa học
              </Button>
            </Group>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
