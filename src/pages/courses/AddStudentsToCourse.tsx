/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FileButton, Group, Modal, Stack, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconFileImport, IconUserPlus } from "@tabler/icons-react";
import { useCallback, useState } from "react";
import * as XLSX from "xlsx";
import { enrollmentService } from "../../supabase/services/enrollment.service";
import { studentService } from "../../supabase/services/student.service";
import AddStudentToCourse from "./AddStudentToCourse";
import { Course } from "../../types/courses";

interface AddStudentsToCourseProps {
  opened: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  courses: Course;
}

export default function AddStudentsToCourse({
  opened,
  onClose,
  onSuccess,
  courses,
}: AddStudentsToCourseProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);

  const handleFileSelect = useCallback((file: File | null) => {
    if (!file) return;
    setFile(file);
  }, []);

  const handleImport = useCallback(async () => {
    if (!file) return;
    setIsSubmitting(true);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = e.target?.result;
          if (!data) throw new Error("Không thể đọc file");

          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          let successCount = 0;
          const errors: { row: number; message: string }[] = [];

          for (let i = 0; i < jsonData.length; i++) {
            const row = jsonData[i] as any;
            const rowNumber = i + 2; // +2 because Excel rows start at 1 and we have header row

            // Check if student exists
            const { data: existingStudent } =
              await studentService.getStudentByEmail(row.email);

            if (!existingStudent) {
              errors.push({
                row: rowNumber,
                message: `Email ${row.email} không tồn tại trong hệ thống`,
              });
              continue;
            }

            // Check if student is already enrolled
            const isAlreadyEnrolled = courses.enrollments?.some(
              (enrollment) => enrollment.student_id === existingStudent.id
            );

            if (isAlreadyEnrolled) {
              errors.push({
                row: rowNumber,
                message: `Học viên với email ${row.email} đã được thêm vào khóa học này`,
              });
              continue;
            }

            try {
              // Enroll student to course
              const { error: enrollmentError } =
                await enrollmentService.createEnrollment({
                  student_id: existingStudent.id,
                  course_id: courses.id,
                });

              if (enrollmentError) throw enrollmentError;
              successCount++;
            } catch (error) {
              errors.push({
                row: rowNumber,
                message: `Lỗi khi thêm vào khóa học: ${
                  error instanceof Error ? error.message : "Unknown error"
                }`,
              });
            }
          }

          if (successCount > 0) {
            notifications.show({
              title: "Thành công",
              message: `Đã thêm thành công ${successCount} học viên vào khóa học`,
              color: "green",
            });
          }

          if (errors.length > 0) {
            const errorMessage = errors
              .map((error) => `Dòng ${error.row}: ${error.message}`)
              .join("\n");

            notifications.show({
              title: "Có lỗi",
              message: `Các dòng sau không thể thêm:\n${errorMessage}`,
              color: "yellow",
            });
          }

          if (onSuccess) onSuccess();
          onClose();
        } catch (error) {
          notifications.show({
            title: "Lỗi",
            message: "Không thể đọc file. Vui lòng kiểm tra định dạng file.",
            color: "red",
          });
        }
      };

      reader.readAsBinaryString(file);
    } catch (error) {
      notifications.show({
        title: "Lỗi",
        message: "Có lỗi xảy ra khi xử lý file.",
        color: "red",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [file, courses, onClose, onSuccess]);

  return (
    <>
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
        <Stack>
          <Button
            onClick={() => setShowAddStudentModal(true)}
            leftSection={<IconUserPlus size={16} />}
          >
            Thêm thủ công
          </Button>

          <Text ta="center" fw={500}>
            Hoặc
          </Text>

          <FileButton onChange={handleFileSelect} accept=".xlsx,.xls,.csv">
            {(props) => (
              <Button {...props} leftSection={<IconFileImport size={16} />}>
                Chọn file
              </Button>
            )}
          </FileButton>

          {file && (
            <>
              <Text size="sm" ta="center">
                Đã chọn file: {file.name}
              </Text>
              <Button
                onClick={handleImport}
                leftSection={<IconFileImport size={16} />}
                loading={isSubmitting}
                variant="outline"
              >
                Nhập
              </Button>
            </>
          )}
        </Stack>
      </Modal>

      <AddStudentToCourse
        opened={showAddStudentModal}
        onClose={() => setShowAddStudentModal(false)}
        courseId={courses.id}
        onSuccess={() => {
          if (onSuccess) onSuccess();
          setShowAddStudentModal(false);
        }}
      />
    </>
  );
}
