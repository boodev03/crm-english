import { ActionIcon, Badge, Container, Menu, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { User } from "@supabase/supabase-js";
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
import { useUserAccounts } from "../../hooks/useUserAccounts";
import AddNewAccount from "./AddNewAccount";

export function UserAccounts() {
  const {
    userAccounts: fetchedUserAccounts,
    isLoading,
    isError,
    refetch,
  } = useUserAccounts();
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [addAccountOpen, setAddAccountOpen] = useState(false);

  // Use fetched user accounts or empty array if loading or error
  const userAccounts = fetchedUserAccounts || [];

  // Define columns for the data table
  const columns = [
    { key: "email", title: "Email" },
    {
      key: "role",
      title: "Vai trò",
      render: (item: User) => (
        <Badge variant="light">
          {item.user_metadata?.role || "Người dùng"}
        </Badge>
      ),
    },
    {
      key: "last_sign_in_at",
      title: "Đăng nhập cuối",
      render: (item: User) =>
        item.last_sign_in_at
          ? dayjs(item.last_sign_in_at).format("DD-MM-YYYY HH:mm")
          : "Chưa đăng nhập",
    },
    {
      key: "created_at",
      title: "Ngày tạo",
      render: (item: User) => dayjs(item.created_at).format("DD-MM-YYYY"),
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (item: User) => (
        <Badge color={item.email_confirmed_at ? "green" : "orange"}>
          {item.email_confirmed_at ? "Đã xác thực" : "Chưa xác thực"}
        </Badge>
      ),
    },
  ];

  // Action handlers
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    // TODO: Implement edit user modal
    console.log("Edit user:", user);
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedUser) return;

    setDeleteLoading(true);
    try {
      // TODO: Implement delete user API call
      // const { success, error } = await userService.deleteUser(selectedUser.id);

      notifications.show({
        title: "Cảnh báo",
        message: "Chức năng xóa người dùng chưa được triển khai",
        color: "orange",
      });
    } catch (error) {
      notifications.show({
        title: "Lỗi",
        message:
          error instanceof Error ? error.message : "Không thể xóa người dùng",
        color: "red",
      });
    } finally {
      setDeleteLoading(false);
      setDeleteConfirmOpen(false);
    }
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    // TODO: Implement view user details modal
    console.log("View user details:", user);
  };

  // Filter and search data
  const filteredData = userAccounts.filter((user) => {
    // Apply search filter
    const matchesSearch =
      searchValue === "" ||
      (user.email &&
        user.email.toLowerCase().includes(searchValue.toLowerCase())) ||
      (user.app_metadata?.role &&
        user.app_metadata.role
          .toLowerCase()
          .includes(searchValue.toLowerCase()));

    return matchesSearch;
  });

  return (
    <Container size="xl" py="xl">
      <Stack gap={20}>
        <TableHeader
          title="Quản lý tài khoản người dùng"
          searchPlaceholder="Tìm kiếm theo email hoặc vai trò..."
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          addButton={{
            label: "Thêm tài khoản",
            onClick: () => setAddAccountOpen(true),
          }}
        />

        <DataTable
          data={filteredData}
          columns={columns}
          keyExtractor={(item: User) => item.id}
          page={page}
          onPageChange={setPage}
          itemsPerPage={50}
          emptyMessage={
            isLoading
              ? "Đang tải dữ liệu..."
              : isError
              ? "Lỗi khi tải dữ liệu"
              : "Không tìm thấy tài khoản nào"
          }
          actionColumn={{
            title: "Thao tác",
            width: 80,
            render: (item: User) => (
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
                    Chỉnh sửa vai trò
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconTrash size={14} />}
                    color="red"
                    onClick={() => handleDeleteClick(item)}
                  >
                    Vô hiệu hóa
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
          title="Xác nhận vô hiệu hóa tài khoản"
          message={
            selectedUser
              ? `Bạn có chắc chắn muốn vô hiệu hóa tài khoản ${selectedUser.email}?`
              : "Bạn có chắc chắn muốn vô hiệu hóa tài khoản này?"
          }
          confirmLabel="Vô hiệu hóa"
          cancelLabel="Hủy"
          confirmColor="red"
          loading={deleteLoading}
        />

        <AddNewAccount
          opened={addAccountOpen}
          onClose={() => setAddAccountOpen(false)}
          onSuccess={() => {
            setAddAccountOpen(false);
            if (typeof refetch === "function") refetch();
          }}
        />
      </Stack>
    </Container>
  );
}

export default UserAccounts;
