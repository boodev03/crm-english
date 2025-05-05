import { ActionIcon, Badge, Container, Menu } from "@mantine/core";
import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconTrash,
} from "@tabler/icons-react";
import { useState } from "react";
import DataTable, { Column } from "../../components/DataTable";
import { TableHeader, FilterOption } from "../../components/TableHeader";

interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
  specialization: string;
  joinedDate: string;
  [key: string]: unknown; // Add index signature to make Teacher compatible with Record<string, unknown>
}

// Sample data for demonstration
const mockTeachers: Teacher[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 (123) 456-7890",
    status: "active",
    specialization: "Grammar",
    joinedDate: "2023-01-15",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "+1 (234) 567-8901",
    status: "active",
    specialization: "Conversation",
    joinedDate: "2023-02-20",
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael.b@example.com",
    phone: "+1 (345) 678-9012",
    status: "inactive",
    specialization: "Business English",
    joinedDate: "2022-11-05",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.d@example.com",
    phone: "+1 (456) 789-0123",
    status: "active",
    specialization: "IELTS",
    joinedDate: "2023-03-10",
  },
  {
    id: "5",
    name: "David Wilson",
    email: "david.w@example.com",
    phone: "+1 (567) 890-1234",
    status: "active",
    specialization: "TOEFL",
    joinedDate: "2023-04-25",
  },
];

export function Teachers() {
  const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [specializationFilter, setSpecializationFilter] = useState<string[]>(
    []
  );

  // Define columns for the data table
  const columns: Column<Teacher>[] = [
    { key: "name", title: "Tên giáo viên" },
    { key: "email", title: "Email" },
    { key: "phone", title: "Số điện thoại" },
    {
      key: "status",
      title: "Trạng thái",
      render: (teacher) => (
        <Badge color={teacher.status === "active" ? "green" : "red"}>
          {teacher.status === "active" ? "Hoạt động" : "Không hoạt động"}
        </Badge>
      ),
    },
    { key: "specialization", title: "Chuyên môn" },
    { key: "joinedDate", title: "Ngày tham gia" },
  ];

  // Filter options
  const filters: FilterOption[] = [
    {
      id: "status",
      label: "Trạng thái",
      options: [
        { value: "active", label: "Hoạt động" },
        { value: "inactive", label: "Không hoạt động" },
      ],
      value: statusFilter,
      onChange: setStatusFilter,
    },
    {
      id: "specialization",
      label: "Chuyên môn",
      options: [
        { value: "Grammar", label: "Grammar" },
        { value: "Conversation", label: "Conversation" },
        { value: "Business English", label: "Business English" },
        { value: "IELTS", label: "IELTS" },
        { value: "TOEFL", label: "TOEFL" },
      ],
      value: specializationFilter,
      onChange: setSpecializationFilter,
    },
  ];

  // Action handlers
  const handleAddTeacher = () => {
    console.log("Add new teacher");
  };

  const handleEdit = (teacher: Teacher) => {
    console.log("Edit teacher:", teacher);
  };

  const handleDelete = (teacher: Teacher) => {
    if (
      window.confirm(`Bạn có chắc chắn muốn xóa giáo viên ${teacher.name}?`)
    ) {
      setTeachers(teachers.filter((t) => t.id !== teacher.id));
    }
  };

  const handleViewDetails = (teacher: Teacher) => {
    console.log("View teacher details:", teacher);
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

    // Apply status filter
    const matchesStatus =
      statusFilter.length === 0 || statusFilter.includes(teacher.status);

    // Apply specialization filter
    const matchesSpecialization =
      specializationFilter.length === 0 ||
      specializationFilter.includes(teacher.specialization);

    return matchesSearch && matchesStatus && matchesSpecialization;
  });

  // Clear all filters
  const handleClearFilters = () => {
    setStatusFilter([]);
    setSpecializationFilter([]);
  };

  return (
    <Container size="xl">
      <TableHeader
        title="Quản lý giáo viên"
        searchPlaceholder="Tìm kiếm giáo viên..."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filters={filters}
        onClearFilters={handleClearFilters}
        addButton={{
          label: "Thêm giáo viên",
          onClick: handleAddTeacher,
        }}
      />

      <div style={{ marginTop: "1rem" }}>
        <DataTable<Teacher>
          data={filteredData}
          columns={columns}
          keyExtractor={(teacher) => teacher.id}
          page={page}
          onPageChange={setPage}
          itemsPerPage={5}
          emptyMessage="Không tìm thấy giáo viên nào"
          actionColumn={{
            title: "Thao tác",
            width: 80,
            render: (teacher) => (
              <Menu position="bottom-end" withArrow>
                <Menu.Target>
                  <ActionIcon variant="subtle" color="gray">
                    <IconDotsVertical size={16} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    leftSection={<IconEye size={14} />}
                    onClick={() => handleViewDetails(teacher as Teacher)}
                  >
                    Xem chi tiết
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconEdit size={14} />}
                    onClick={() => handleEdit(teacher as Teacher)}
                  >
                    Sửa
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconTrash size={14} />}
                    color="red"
                    onClick={() => handleDelete(teacher as Teacher)}
                  >
                    Xóa
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ),
          }}
        />
      </div>
    </Container>
  );
}

export default Teachers;
