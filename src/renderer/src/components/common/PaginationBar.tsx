import { Group, Pagination, Select, Text } from '@mantine/core'

const PAGE_SIZE_OPTIONS = ['10', '20', '30']

interface PaginationBarProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export function PaginationBar({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange
}: PaginationBarProps): React.JSX.Element {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  return (
    <Group justify="space-between" mt="sm">
      <Group gap="xs">
        <Text size="sm" c="dimmed">
          Rows per page
        </Text>
        <Select
          data={PAGE_SIZE_OPTIONS}
          value={String(pageSize)}
          onChange={(value) => value && onPageSizeChange(Number(value))}
          w={80}
          allowDeselect={false}
        />
      </Group>
      <Pagination value={page} onChange={onPageChange} total={totalPages} />
    </Group>
  )
}
