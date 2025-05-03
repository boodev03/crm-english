import { ActionIcon, Badge, Container, Menu } from "@mantine/core";
import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconTrash,
} from "@tabler/icons-react";
import { useState } from "react";
import DataTable from "../components/common/DataTable";
import TableHeader, { FilterOption } from "../components/common/TableHeader";

// Type for Student data
interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
  level: "Beginner" | "Intermediate" | "Advanced";
  enrollmentDate: string;
  classes: number;
}

// Sample data for demonstration
const mockStudents: Student[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice.j@example.com",
    phone: "+1 (123) 456-7890",
    status: "active",
    level: "Intermediate",
    enrollmentDate: "2023-02-15",
    classes: 12,
  },
  {
    id: "2",
    name: "Bob Williams",
    email: "bob.w@example.com",
    phone: "+1 (234) 567-8901",
    status: "active",
    level: "Beginner",
    enrollmentDate: "2023-03-20",
    classes: 8,
  },
  {
    id: "3",
    name: "Carol Martinez",
    email: "carol.m@example.com",
    phone: "+1 (345) 678-9012",
    status: "inactive",
    level: "Advanced",
    enrollmentDate: "2022-11-05",
    classes: 24,
  },
  {
    id: "4",
    name: "David Anderson",
    email: "david.a@example.com",
    phone: "+1 (456) 789-0123",
    status: "active",
    level: "Intermediate",
    enrollmentDate: "2023-01-10",
    classes: 15,
  },
  {
    id: "5",
    name: "Eva Thompson",
    email: "eva.t@example.com",
    phone: "+1 (567) 890-1234",
    status: "active",
    level: "Advanced",
    enrollmentDate: "2023-04-05",
    classes: 20,
  },
];

export function Students() {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [levelFilter, setLevelFilter] = useState<string[]>([]);

  // Define columns for the data table
  const columns = [
    { key: "name", title: "Tên học viên" },
    { key: "email", title: "Email" },
    { key: "phone", title: "Số điện thoại" },
    {
      key: "status",
      title: "Trạng thái",
      render: (student: Student) => (
        <Badge color={student.status === "active" ? "green" : "red"}>
          {student.status === "active" ? "Hoạt động" : "Không hoạt động"}
        </Badge>
      ),
    },
    {
      key: "level",
      title: "Trình độ",
      render: (student: Student) => {
        const colorMap: Record<string, string> = {
          Beginner: "blue",
          Intermediate: "yellow",
          Advanced: "violet",
        };
        return <Badge color={colorMap[student.level]}>{student.level}</Badge>;
      },
    },
    { key: "enrollmentDate", title: "Ngày đăng ký" },
    { key: "classes", title: "Số buổi học" },
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
      id: "level",
      label: "Trình độ",
      options: [
        { value: "Beginner", label: "Beginner" },
        { value: "Intermediate", label: "Intermediate" },
        { value: "Advanced", label: "Advanced" },
      ],
      value: levelFilter,
      onChange: setLevelFilter,
    },
  ];

  // Action handlers
  const handleAddStudent = () => {
    console.log("Add new student");
  };

  const handleEdit = (student: Student) => {
    console.log("Edit student:", student);
  };

  const handleDelete = (student: Student) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa học viên ${student.name}?`)) {
      setStudents(students.filter((s) => s.id !== student.id));
    }
  };

  const handleViewDetails = (student: Student) => {
    console.log("View student details:", student);
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

    // Apply status filter
    const matchesStatus =
      statusFilter.length === 0 || statusFilter.includes(student.status);

    // Apply level filter
    const matchesLevel =
      levelFilter.length === 0 || levelFilter.includes(student.level);

    return matchesSearch && matchesStatus && matchesLevel;
  });

  // Clear all filters
  const handleClearFilters = () => {
    setStatusFilter([]);
    setLevelFilter([]);
  };

  return (
    <Container size="xl" py="xl">
      <TableHeader
        title="Quản lý học viên"
        searchPlaceholder="Tìm kiếm học viên..."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filters={filters}
        onClearFilters={handleClearFilters}
        addButton={{
          label: "Thêm học viên",
          onClick: handleAddStudent,
        }}
      />

      <DataTable
        data={filteredData}
        columns={columns}
        keyExtractor={(student) => student.id}
        page={page}
        onPageChange={setPage}
        itemsPerPage={5}
        emptyMessage="Không tìm thấy học viên nào"
        actionColumn={{
          title: "Thao tác",
          width: 80,
          render: (student: Student) => (
            <Menu position="bottom-end" withArrow>
              <Menu.Target>
                <ActionIcon variant="subtle" color="gray">
                  <IconDotsVertical size={16} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<IconEye size={14} />}
                  onClick={() => handleViewDetails(student)}
                >
                  Xem chi tiết
                </Menu.Item>
                <Menu.Item
                  leftSection={<IconEdit size={14} />}
                  onClick={() => handleEdit(student)}
                >
                  Sửa
                </Menu.Item>
                <Menu.Item
                  leftSection={<IconTrash size={14} />}
                  color="red"
                  onClick={() => handleDelete(student)}
                >
                  Xóa
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          ),
        }}
      />
    </Container>
  );
}

export default Students;
