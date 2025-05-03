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

export function DataTable<T extends Record<string, unknown>>({
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
  const totalPages = totalItems
    ? Math.ceil(totalItems / itemsPerPage)
    : Math.ceil(data.length / itemsPerPage);
  const showPagination = totalPages > 1;

  return (
    <Paper shadow="xs" p="md" withBorder>
      <Table striped highlightOnHover>
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
          {data.length > 0 ? (
            data.map((item) => (
              <Table.Tr key={keyExtractor(item)}>
                {columns.map((column) => (
                  <Table.Td
                    key={`${keyExtractor(item)}-${column.key}`}
                    style={{ textAlign: column.align || "left" }}
                  >
                    {column.render
                      ? column.render(item)
                      : String(item[column.key] || "")}
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

      {showPagination && (
        <Box mt="md">
          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              Hiển thị {data.length} {totalItems ? `trên ${totalItems}` : ""}{" "}
              mục
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
