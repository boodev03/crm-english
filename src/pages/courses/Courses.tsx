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
import { Course } from "../../types/courses";
import { useCourses } from "../../hooks/useCourses";
import { courseService } from "../../supabase/services/course.service";
import { notifications } from "@mantine/notifications";
import Confirmation from "../../components/Confirmation";
import dayjs from "dayjs";
import AddNewCourse from "./AddNewCourse";
import { useNavigate } from "react-router-dom";

export default function Courses() {
  const { courses: fetchedCourses, isLoading, isError, refetch } = useCourses();
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [addCourseOpen, setAddCourseOpen] = useState(false);

  // Use fetched courses or empty array if loading or error
  const courses = fetchedCourses || [];
  const navigate = useNavigate();
  // Define columns for the data table
  const columns = [
    { key: "course_name", title: "Tên khóa học" },
    {
      key: "start_time",
      title: "Ngày bắt đầu",
      render: (item: Course) => dayjs(item.start_time).format("DD-MM-YYYY"),
    },
    {
      key: "end_time",
      title: "Ngày kết thúc",
      render: (item: Course) => dayjs(item.end_time).format("DD-MM-YYYY"),
    },
    {
      key: "tuition",
      title: "Học phí",
      render: (item: Course) => `${item.tuition.toLocaleString()} VND`,
    },
    {
      key: "teacher",
      title: "Giáo viên",
      render: (item: Course) =>
        item.teacher?.first_name + " " + item.teacher?.last_name ||
        "Chưa phân công",
    },
  ];

  // Action handlers
  const handleAddCourse = () => {
    setAddCourseOpen(true);
  };

  const handleEdit = (course: Course) => {
    setSelectedCourse(course);
    // Implement edit course functionality
  };

  const handleDeleteClick = (course: Course) => {
    setSelectedCourse(course);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedCourse) return;

    setDeleteLoading(true);
    try {
      const { success, error } = await courseService.deleteCourse(
        selectedCourse.id
      );

      if (error) {
        throw error;
      }

      if (success) {
        notifications.show({
          title: "Thành công",
          message: "Xóa khóa học thành công",
          color: "green",
        });
        refetch();
      }
    } catch (error) {
      notifications.show({
        title: "Lỗi",
        message:
          error instanceof Error ? error.message : "Không thể xóa khóa học",
        color: "red",
      });
    } finally {
      setDeleteLoading(false);
      setDeleteConfirmOpen(false);
    }
  };

  const handleViewDetails = (course: Course) => {
    navigate(`/courses/${course.id}`);
  };

  // Filter and search data
  const filteredData = courses.filter((course) => {
    // Apply search filter
    const matchesSearch =
      searchValue === "" ||
      Object.values(course).some(
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
          title="Quản lý khóa học"
          searchPlaceholder="Tìm kiếm khóa học..."
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          addButton={{
            label: "Thêm khóa học",
            onClick: handleAddCourse,
          }}
        />

        <DataTable
          data={filteredData}
          columns={columns}
          keyExtractor={(item: Course) => item.id}
          page={page}
          onPageChange={setPage}
          itemsPerPage={50}
          emptyMessage={
            isLoading
              ? "Đang tải dữ liệu..."
              : isError
              ? "Lỗi khi tải dữ liệu"
              : "Không tìm thấy khóa học nào"
          }
          actionColumn={{
            title: "Thao tác",
            width: 80,
            render: (item: Course) => (
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

        <Confirmation
          opened={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
          onConfirm={handleDelete}
          title="Xác nhận xóa khóa học"
          message={
            selectedCourse
              ? `Bạn có chắc chắn muốn xóa khóa học ${selectedCourse.course_name}?`
              : "Bạn có chắc chắn muốn xóa khóa học này?"
          }
          confirmLabel="Xóa"
          cancelLabel="Hủy"
          confirmColor="red"
          loading={deleteLoading}
        />

        <AddNewCourse
          opened={addCourseOpen}
          onClose={() => setAddCourseOpen(false)}
          onSuccess={() => refetch()}
        />
      </Stack>
    </Container>
  );
}
