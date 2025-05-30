import React from "react";
import {
  Group,
  TextInput,
  Button,
  Stack,
  Text,
  MultiSelect,
  Popover,
} from "@mantine/core";
import { IconSearch, IconFilter, IconX, IconPlus } from "@tabler/icons-react";

export interface FilterOption {
  id: string;
  label: string;
  options: { value: string; label: string }[];
  value: string[];
  onChange: (value: string[]) => void;
}

interface TableHeaderProps {
  title?: string;
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters?: FilterOption[];
  onClearFilters?: () => void;
  addButton?: {
    label: string;
    onClick: () => void;
  };
  extraButton?: {
    label: string;
    onClick: () => void;
    leftSection?: React.ReactNode;
  };
}

export function TableHeader({
  title,
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  filters = [],
  onClearFilters,
  addButton,
  extraButton,
}: TableHeaderProps) {
  const [filterOpened, setFilterOpened] = React.useState(false);

  const hasActiveFilters = filters.some((filter) => filter.value.length > 0);
  const totalActiveFilters = filters.reduce(
    (acc, filter) => acc + filter.value.length,
    0
  );

  const handleClearFilters = () => {
    if (onClearFilters) {
      onClearFilters();
    } else {
      // Default implementation to clear all filters
      filters.forEach((filter) => filter.onChange([]));
    }
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        {title && (
          <Text fw={700} size="xl">
            {title}
          </Text>
        )}
        <Group>
          {extraButton && (
            <Button
              variant="light"
              onClick={extraButton.onClick}
              leftSection={extraButton.leftSection}
            >
              {extraButton.label}
            </Button>
          )}
          {addButton && (
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={addButton.onClick}
            >
              {addButton.label}
            </Button>
          )}
        </Group>
      </Group>

      <Group justify="space-between">
        <TextInput
          placeholder={searchPlaceholder}
          leftSection={<IconSearch size={16} />}
          value={searchValue}
          onChange={(e) => onSearchChange(e.currentTarget.value)}
          style={{ width: "300px" }}
        />

        {filters.length > 0 && (
          <Group>
            {hasActiveFilters && (
              <Button
                variant="subtle"
                leftSection={<IconX size={16} />}
                color="gray"
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
            )}

            <Popover
              opened={filterOpened}
              onChange={setFilterOpened}
              position="bottom-end"
              shadow="md"
            >
              <Popover.Target>
                <Button
                  variant="subtle"
                  leftSection={<IconFilter size={16} />}
                  color="gray"
                  onClick={() => setFilterOpened((o) => !o)}
                >
                  Filters {totalActiveFilters > 0 && `(${totalActiveFilters})`}
                </Button>
              </Popover.Target>
              <Popover.Dropdown>
                <Stack gap="md" style={{ minWidth: "250px" }}>
                  {filters.map((filter) => (
                    <div key={filter.id}>
                      <Text fw={500}>{filter.label}</Text>
                      <MultiSelect
                        data={filter.options}
                        value={filter.value}
                        onChange={filter.onChange}
                        placeholder={`Select ${filter.label.toLowerCase()}`}
                        clearable
                      />
                    </div>
                  ))}
                  <Group justify="flex-end">
                    <Button size="xs" onClick={() => setFilterOpened(false)}>
                      Apply
                    </Button>
                  </Group>
                </Stack>
              </Popover.Dropdown>
            </Popover>
          </Group>
        )}
      </Group>
    </Stack>
  );
}

export default TableHeader;
