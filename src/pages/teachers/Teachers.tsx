import { ActionIcon, Container, Menu, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconTrash,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import { useState } from "react";
import Confirmation from "../../components/Confirmation";
import DataTable from "../../components/DataTable";
import TableHeader from "../../components/TableHeader";
import { useTeachers } from "../../hooks/useTeacher";
import { teacherService } from "../../supabase/services/teacher.service";
import AddNewTeacher from "./AddNewTeacher";
import EditTeacher from "./EditTeacher";
import TeacherDetail from "./TeacherDetail";
import { Teacher } from "../../types/teacher";

export function Teachers() {
  const {
    teachers: fetchedTeachers,
    isLoading,
    isError,
    refetch,
  } = useTeachers();
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [addTeacherOpen, setAddTeacherOpen] = useState(false);
  const [editTeacherOpen, setEditTeacherOpen] = useState(false);
  const [viewTeacherOpen, setViewTeacherOpen] = useState(false);

  // Use fetched teachers or empty array if loading or error
  const teachers = fetchedTeachers || [];

  // Define columns for the data table
  const columns = [
    {
      key: "name",
      title: "Tên giáo viên",
      render: (item: Teacher) => `${item.first_name} ${item.last_name}`,
    },
    { key: "email", title: "Email" },
    { key: "phone", title: "Số điện thoại" },
    {
      key: "created_at",
      title: "Ngày tham gia",
      render: (item: Teacher) => dayjs(item.created_at).format("DD-MM-YYYY"),
    },
  ];

  // Action handlers
  const handleAddTeacher = () => {
    setAddTeacherOpen(true);
  };

  const handleEdit = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setEditTeacherOpen(true);
  };

  const handleDeleteClick = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedTeacher) return;

    setDeleteLoading(true);
    try {
      const { error } = await teacherService.deleteTeacher(selectedTeacher.id);

      if (error) {
        throw error;
      }

      notifications.show({
        title: "Thành công",
        message: "Xóa giáo viên thành công",
        color: "green",
      });
      refetch();
    } catch (error) {
      notifications.show({
        title: "Lỗi",
        message:
          error instanceof Error ? error.message : "Không thể xóa giáo viên",
        color: "red",
      });
    } finally {
      setDeleteLoading(false);
      setDeleteConfirmOpen(false);
    }
  };

  const handleViewDetails = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setViewTeacherOpen(true);
  };

  // Filter and search data
  const filteredData = teachers.filter((teacher) => {
    // Apply search filter
    const matchesSearch =
      searchValue === "" ||
      Object.values(teacher).some(
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
          title="Quản lý giáo viên"
          searchPlaceholder="Tìm kiếm giáo viên..."
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          addButton={{
            label: "Thêm giáo viên",
            onClick: handleAddTeacher,
          }}
        />

        <DataTable
          data={filteredData}
          columns={columns}
          keyExtractor={(item: Teacher) => item.id}
          page={page}
          onPageChange={setPage}
          itemsPerPage={50}
          emptyMessage={
            isLoading
              ? "Đang tải dữ liệu..."
              : isError
              ? "Lỗi khi tải dữ liệu"
              : "Không tìm thấy giáo viên nào"
          }
          actionColumn={{
            title: "Thao tác",
            width: 80,
            render: (item: Teacher) => (
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
      </Stack>

      <Confirmation
        opened={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Xác nhận xóa"
        message={`Bạn có chắc chắn muốn xóa giáo viên này?`}
        loading={deleteLoading}
      />

      <AddNewTeacher
        opened={addTeacherOpen}
        onClose={() => setAddTeacherOpen(false)}
        onSuccess={() => refetch()}
      />

      <EditTeacher
        teacher={selectedTeacher}
        opened={editTeacherOpen}
        onClose={() => setEditTeacherOpen(false)}
        onSuccess={() => refetch()}
      />

      <TeacherDetail
        teacher={selectedTeacher}
        opened={viewTeacherOpen}
        onClose={() => setViewTeacherOpen(false)}
      />
    </Container>
  );
}

export default Teachers;
