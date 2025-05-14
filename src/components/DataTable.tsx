import React from "react";
import { Table, Text, Paper, Box, Group, Pagination } from "@mantine/core";

export interface Column<T> {
  key: string;
  title: string;
  render?: (item: T) => React.ReactNode;
  width?: number | string;
  align?: "left" | "center" | "right";
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
  page?: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
  actionColumn?: {
    title?: string;
    width?: number | string;
    align?: "left" | "center" | "right";
    render: (item: T) => React.ReactNode;
  };
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  emptyMessage = "Không có dữ liệu",
  page = 1,
  totalItems,
  itemsPerPage = 10,
  onPageChange,
  actionColumn,
}: DataTableProps<T>) {
  // Calculate pagination
  const totalPages = totalItems
    ? Math.ceil(totalItems / itemsPerPage)
    : Math.ceil(data.length / itemsPerPage);
  const showPagination = totalPages > 1;

  // Calculate start and end index for current page
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Get current page data
  const currentPageData = data.slice(startIndex, endIndex);

  return (
    <Paper shadow="xs" p="md" withBorder>
      <Box style={{ overflowX: "auto" }}>
        <Table
          striped
          highlightOnHover
          layout="fixed"
          style={{ tableLayout: "fixed", width: "100%" }}
        >
          <Table.Thead>
            <Table.Tr>
              {columns.map((column) => (
                <Table.Th
                  key={column.key}
                  style={{
                    width: column.width,
                    textAlign: column.align || "left",
                  }}
                >
                  {column.title}
                </Table.Th>
              ))}
              {actionColumn && (
                <Table.Th
                  style={{
                    width: actionColumn.width || "80px",
                    textAlign: actionColumn.align || "right",
                  }}
                >
                  {actionColumn.title || "Thao tác"}
                </Table.Th>
              )}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {currentPageData.length > 0 ? (
              currentPageData.map((item) => (
                <Table.Tr key={keyExtractor(item)}>
                  {columns.map((column) => (
                    <Table.Td
                      key={`${keyExtractor(item)}-${column.key}`}
                      style={{
                        textAlign: column.align || "left",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {column.render
                        ? column.render(item)
                        : String(item[column.key as keyof T] || "")}
                    </Table.Td>
                  ))}
                  {actionColumn && (
                    <Table.Td
                      style={{ textAlign: actionColumn.align || "right" }}
                    >
                      {actionColumn.render(item)}
                    </Table.Td>
                  )}
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={columns.length + (actionColumn ? 1 : 0)}>
                  <Text ta="center" c="dimmed" py="lg">
                    {emptyMessage}
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Box>

      {showPagination && (
        <Box mt="md">
          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              Hiển thị {currentPageData.length}{" "}
              {totalItems ? `trên ${totalItems}` : `trên ${data.length}`} mục
            </Text>
            <Pagination
              total={totalPages}
              value={page}
              onChange={onPageChange}
              size="sm"
            />
          </Group>
        </Box>
      )}
    </Paper>
  );
}

export default DataTable;
