import { ActionIcon, Container, Menu, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconDotsVertical, IconTrash } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useState } from "react";
import Confirmation from "../../components/Confirmation";
import DataTable from "../../components/DataTable";
import TableHeader from "../../components/TableHeader";
import { enrollmentService } from "../../supabase/services/enrollment.service";
import { Course } from "../../types/courses";
import { Student } from "../../types/student";

interface CourseStudentListProps {
  course: Course;
  refetch: () => void;
}

export default function CourseStudentList({
  course,
  refetch,
}: CourseStudentListProps) {
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [selectedEnrollment, setSelectedEnrollment] = useState<string | null>(
    null
  );
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Get enrolled students from course
  const enrolledStudents =
    course.enrollments?.map((enrollment) => enrollment.student) || [];

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
      key: "status",
      title: "Trạng thái",
      render: (item: Student) => {
        const enrollment = course.enrollments?.find(
          (e) => e.student_id === item.id
        );
        return (
          <span
            style={{
              color: enrollment?.status === "paid" ? "green" : "orange",
              fontWeight: 500,
            }}
          >
            {enrollment?.status === "paid"
              ? "Đã thanh toán"
              : "Chưa thanh toán"}
          </span>
        );
      },
    },
    {
      key: "enrolled_at",
      title: "Ngày đăng ký",
      render: (item: Student) => {
        const enrollment = course.enrollments?.find(
          (e) => e.student_id === item.id
        );
        return enrollment
          ? dayjs(enrollment.created_at).format("DD-MM-YYYY")
          : "-";
      },
    },
  ];

  // Action handlers
  const handleDeleteClick = (studentId: string) => {
    setSelectedEnrollment(studentId);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedEnrollment) return;

    setDeleteLoading(true);
    try {
      const enrollment = course.enrollments?.find(
        (e) => e.student_id === selectedEnrollment
      );
      if (!enrollment) throw new Error("Không tìm thấy thông tin đăng ký");

      const { success, error } = await enrollmentService.deleteEnrollment(
        enrollment.id
      );

      if (error) {
        throw error;
      }

      if (success) {
        notifications.show({
          title: "Thành công",
          message: "Xóa học viên khỏi khóa học thành công",
          color: "green",
        });
      }

      refetch();
    } catch (error) {
      notifications.show({
        title: "Lỗi",
        message:
          error instanceof Error
            ? error.message
            : "Không thể xóa học viên khỏi khóa học",
        color: "red",
      });
    } finally {
      setDeleteLoading(false);
      setDeleteConfirmOpen(false);
    }
  };

  // Filter and search data
  const filteredData = enrolledStudents.filter((student) => {
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
    <Container size="xl">
      <Stack gap={20}>
        <TableHeader
          title="Danh sách học viên"
          searchPlaceholder="Tìm kiếm học viên..."
          searchValue={searchValue}
          onSearchChange={setSearchValue}
        />

        <DataTable
          data={filteredData}
          columns={columns}
          keyExtractor={(item: Student) => item.id}
          page={page}
          onPageChange={setPage}
          itemsPerPage={10}
          emptyMessage={
            enrolledStudents.length === 0
              ? "Chưa có học viên nào trong khóa học này"
              : "Không tìm thấy học viên phù hợp"
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
                    leftSection={<IconTrash size={14} />}
                    color="red"
                    onClick={() => handleDeleteClick(item.id)}
                  >
                    Xóa khỏi khóa học
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ),
          }}
        />
      </Stack>

      <Confirmation
        opened={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa học viên này khỏi khóa học?"
        loading={deleteLoading}
      />
    </Container>
  );
}
