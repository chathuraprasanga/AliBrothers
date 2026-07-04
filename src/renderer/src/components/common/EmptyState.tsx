import { Stack, Text } from '@mantine/core'
import { IconDatabase } from '@tabler/icons-react'

interface EmptyStateProps {
  message?: string
}

export function EmptyState({ message = 'No Data' }: EmptyStateProps): React.JSX.Element {
  return (
    <Stack align="center" justify="center" gap="xs" py="xl">
      <IconDatabase size={40} stroke={1.5} color="var(--mantine-color-gray-5)" />
      <Text c="dimmed">{message}</Text>
    </Stack>
  )
}
