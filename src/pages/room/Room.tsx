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
import { Room } from "../../types/room";
import { useRooms } from "../../hooks/useRoom";
import AddNewRoom from "./AddNewRoom";
import RoomDetail from "./RoomDetail";
import EditRoom from "./EditRoom";
import dayjs from "dayjs";
import { roomService } from "../../supabase/services/room.service";
import { notifications } from "@mantine/notifications";
import Confirmation from "../../components/Confirmation";

export function Rooms() {
  const { data: fetchedRooms, isLoading, isError, refetch } = useRooms();
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [addRoomDialogOpen, setAddRoomDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [roomDetailOpen, setRoomDetailOpen] = useState(false);
  const [editRoomOpen, setEditRoomOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const rooms = fetchedRooms || [];

  const columns = [
    { key: "room_name", title: "Tên phòng" },
    { key: "description", title: "Mô tả" },
    {
      key: "created_at",
      title: "Ngày tạo",
      render: (item: Room) => dayjs(item.created_at).format("DD-MM-YYYY"),
    },
  ];

  const handleAddRoom = () => {
    setAddRoomDialogOpen(true);
  };

  const handleEdit = (room: Room) => {
    setSelectedRoom(room);
    setEditRoomOpen(true);
  };

  const handleDeleteClick = (room: Room) => {
    setSelectedRoom(room);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedRoom) return;

    setDeleteLoading(true);
    try {
      const { success, error } = await roomService.deleteRoom(selectedRoom.id);

      if (error) {
        throw error;
      }

      if (success) {
        notifications.show({
          title: "Thành công",
          message: "Xóa phòng thành công",
          color: "green",
        });
        refetch();
      }
    } catch (error) {
      notifications.show({
        title: "Lỗi",
        message: error instanceof Error ? error.message : "Không thể xóa phòng",
        color: "red",
      });
    } finally {
      setDeleteLoading(false);
      setDeleteConfirmOpen(false);
    }
  };

  const handleViewDetails = (room: Room) => {
    setSelectedRoom(room);
    setRoomDetailOpen(true);
  };

  const filteredData = rooms.filter((room) => {
    const matchesSearch =
      searchValue === "" ||
      Object.values(room).some(
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
          title="Quản lý phòng học"
          searchPlaceholder="Tìm kiếm phòng..."
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          addButton={{
            label: "Thêm phòng",
            onClick: handleAddRoom,
          }}
        />

        <DataTable
          data={filteredData}
          columns={columns}
          keyExtractor={(item: Room) => item.id}
          page={page}
          onPageChange={setPage}
          itemsPerPage={10}
          emptyMessage={
            isLoading
              ? "Đang tải dữ liệu..."
              : isError
              ? "Lỗi khi tải dữ liệu"
              : "Không tìm thấy phòng nào"
          }
          actionColumn={{
            title: "Thao tác",
            width: 80,
            render: (item: Room) => (
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

        <AddNewRoom
          opened={addRoomDialogOpen}
          onClose={() => setAddRoomDialogOpen(false)}
          onSuccess={refetch}
        />

        <RoomDetail
          room={selectedRoom}
          opened={roomDetailOpen}
          onClose={() => setRoomDetailOpen(false)}
        />

        <EditRoom
          room={selectedRoom}
          opened={editRoomOpen}
          onClose={() => setEditRoomOpen(false)}
          onSuccess={refetch}
        />

        <Confirmation
          opened={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
          onConfirm={handleDelete}
          title="Xác nhận xóa phòng"
          message={
            selectedRoom
              ? `Bạn có chắc chắn muốn xóa phòng ${selectedRoom.room_name}?`
              : "Bạn có chắc chắn muốn xóa phòng này?"
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

export default Rooms;
