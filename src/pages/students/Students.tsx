import { ActionIcon, Container, Menu, Stack } from "@mantine/core";
import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconTrash,
} from "@tabler/icons-react";
import { useState } from "react";
import DataTable from "../../components/DataTable";
import TableHeader from "../../components/TableHeader";
import { Student } from "../../types/student";
import { useStudents } from "../../hooks/useStudent";
import AddNewStudent from "./AddNewStudent";
import StudentDetail from "./StudentDetail";
import EditStudent from "./EditStudent";
import dayjs from "dayjs";
import { studentService } from "../../supabase/services/student.service";
import { notifications } from "@mantine/notifications";
import Confirmation from "../../components/Confirmation";

export function Students() {
  const {
    students: fetchedStudents,
    isLoading,
    isError,
    refetch,
  } = useStudents();
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [addStudentDialogOpen, setAddStudentDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentDetailOpen, setStudentDetailOpen] = useState(false);
  const [editStudentOpen, setEditStudentOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Use fetched students or empty array if loading or error
  const students = fetchedStudents || [];

  // Define columns for the data table
  const columns = [
    {
      key: "name",
      title: "Tên học viên",
      render: (item: Student) => `${item.first_name} ${item.last_name}`,
    },
    { key: "email", title: "Email" },
    { key: "phone", title: "Số điện thoại" },
    {
      key: "created_at",
      title: "Ngày đăng ký",
      render: (item: Student) => dayjs(item.created_at).format("DD-MM-YYYY"),
    },
  ];

  // Action handlers
  const handleAddStudent = () => {
    setAddStudentDialogOpen(true);
  };

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setEditStudentOpen(true);
  };

  const handleDeleteClick = (student: Student) => {
    setSelectedStudent(student);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedStudent) return;

    setDeleteLoading(true);
    try {
      const { success, error } = await studentService.deleteStudent(
        selectedStudent.id
      );

      if (error) {
        throw error;
      }

      if (success) {
        notifications.show({
          title: "Thành công",
          message: "Xóa học viên thành công",
          color: "green",
        });
        refetch();
      }
    } catch (error) {
      notifications.show({
        title: "Lỗi",
        message:
          error instanceof Error ? error.message : "Không thể xóa học viên",
        color: "red",
      });
    } finally {
      setDeleteLoading(false);
      setDeleteConfirmOpen(false);
    }
  };

  const handleViewDetails = (student: Student) => {
    setSelectedStudent(student);
    setStudentDetailOpen(true);
  };

  // Filter and search data
  const filteredData = students.filter((student) => {
    // Apply search filter
    const matchesSearch =
      searchValue === "" ||
      Object.values(student).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(searchValue.toLowerCase())
      );

    return matchesSearch;
  });

  return (
    <Container size="xl" py="xl">
      <Stack gap={20}>
        <TableHeader
          title="Quản lý học viên"
          searchPlaceholder="Tìm kiếm học viên..."
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          addButton={{
            label: "Thêm học viên",
            onClick: handleAddStudent,
          }}
        />

        <DataTable
          data={filteredData}
          columns={columns}
          keyExtractor={(item: Student) => item.id}
          page={page}
          onPageChange={setPage}
          itemsPerPage={50}
          emptyMessage={
            isLoading
              ? "Đang tải dữ liệu..."
              : isError
              ? "Lỗi khi tải dữ liệu"
              : "Không tìm thấy học viên nào"
          }
          actionColumn={{
            title: "Thao tác",
            width: 80,
            render: (item: Student) => (
              <Menu position="bottom-end" withArrow>
                <Menu.Target>
                  <ActionIcon variant="subtle" color="gray">
                    <IconDotsVertical size={16} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    leftSection={<IconEye size={14} />}
                    onClick={() => handleViewDetails(item)}
                  >
                    Xem chi tiết
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconEdit size={14} />}
                    onClick={() => handleEdit(item)}
                  >
                    Sửa
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconTrash size={14} />}
                    color="red"
                    onClick={() => handleDeleteClick(item)}
                  >
                    Xóa
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ),
          }}
        />

        <AddNewStudent
          opened={addStudentDialogOpen}
          onClose={() => setAddStudentDialogOpen(false)}
          onSuccess={refetch}
        />

        <StudentDetail
          student={selectedStudent}
          opened={studentDetailOpen}
          onClose={() => setStudentDetailOpen(false)}
        />

        <EditStudent
          student={selectedStudent}
          opened={editStudentOpen}
          onClose={() => setEditStudentOpen(false)}
          onSuccess={refetch}
        />

        <Confirmation
          opened={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
          onConfirm={handleDelete}
          title="Xác nhận xóa học viên"
          message={
            selectedStudent
              ? `Bạn có chắc chắn muốn xóa học viên ${selectedStudent.first_name} ${selectedStudent.last_name}?`
              : "Bạn có chắc chắn muốn xóa học viên này?"
          }
          confirmLabel="Xóa"
          cancelLabel="Hủy"
          confirmColor="red"
          loading={deleteLoading}
        />
      </Stack>
    </Container>
  );
}

export default Students;
