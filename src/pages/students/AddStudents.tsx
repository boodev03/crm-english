/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FileInput, Group, Modal, Stack, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import * as XLSX from "xlsx";
import { register } from "../../supabase/auth/auth.service";
import { studentService } from "../../supabase/services/student.service";

const DEFAULT_PASSWORD = "12345678";

interface AddStudentsProps {
  opened: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddStudents({
  opened,
  onClose,
  onSuccess,
}: AddStudentsProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
  };

  const validateRow = async (row: any, rowNumber: number) => {
    // Check required fields
    if (!row.email || !row.first_name || !row.last_name || !row.phone) {
      return {
        row: rowNumber,
        message:
          "Thiếu thông tin bắt buộc (email, first_name, last_name, phone)",
      };
    }

    // Check if email already exists
    const { data: existingStudent } = await studentService.getStudentByEmail(
      row.email
    );
    if (existingStudent) {
      return {
        row: rowNumber,
        message: `Email ${row.email} đã tồn tại trong hệ thống`,
      };
    }

    return null;
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    setIsLoading(true);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          let successCount = 0;
          const errors: { row: number; message: string }[] = [];

          for (let i = 0; i < jsonData.length; i++) {
            const row = jsonData[i];
            const rowNumber = i + 2; // +2 because Excel rows start at 1 and we have header row

            // Validate row
            const error = await validateRow(row, rowNumber);
            if (error) {
              errors.push(error);
              continue;
            }

            try {
              const studentData = row as any;
              const password = DEFAULT_PASSWORD;

              // Create student account
              const { error: registerError } = await register({
                email: studentData.email,
                password: password,
                metadata: { role: "student" },
              });

              if (registerError) throw registerError;

              // Create student profile
              const { error: studentError } =
                await studentService.createStudent({
                  first_name: studentData.first_name,
                  last_name: studentData.last_name,
                  email: studentData.email,
                  phone: studentData.phone,
                });

              if (studentError) throw studentError;
              successCount++;
            } catch (error) {
              errors.push({
                row: rowNumber,
                message: `Lỗi khi import: ${
                  error instanceof Error ? error.message : "Unknown error"
                }`,
              });
            }
          }

          if (successCount > 0) {
            notifications.show({
              title: "Thành công",
              message: `Đã thêm thành công ${successCount} học viên`,
              color: "green",
            });
          }

          if (errors.length > 0) {
            const errorMessage = errors
              .map((error) => `Dòng ${error.row}: ${error.message}`)
              .join("\n");

            notifications.show({
              title: "Có lỗi",
              message: `Các dòng sau không thể import:\n${errorMessage}`,
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
        } finally {
          setIsLoading(false);
        }
      };

      reader.readAsArrayBuffer(selectedFile);
    } catch (error) {
      notifications.show({
        title: "Lỗi",
        message: "Có lỗi xảy ra khi xử lý file.",
        color: "red",
      });
      setIsLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Thêm học viên hàng loạt"
      size="lg"
      radius="md"
    >
      <Stack>
        <Text size="sm" c="dimmed">
          Tải lên file Excel hoặc CSV chứa thông tin học viên. File cần có các
          cột: first_name, last_name, email, phone
        </Text>

        <FileInput
          label="Chọn file"
          placeholder="Kéo thả file hoặc click để chọn"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileSelect}
        />

        <Group justify="flex-end" mt="md">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button
            onClick={handleImport}
            loading={isLoading}
            disabled={!selectedFile}
          >
            Import
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
