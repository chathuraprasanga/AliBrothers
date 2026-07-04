import { Card, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { Link } from 'react-router-dom'

const REPORTS = [
  { to: '/reports/production', label: 'Production Report', description: 'Rolls produced per day' },
  { to: '/reports/stock', label: 'Stock Report', description: 'Stock movements and balances' },
  { to: '/reports/sales', label: 'Sales Report', description: 'Sales transactions by date' }
]

export function ReportsHome(): React.JSX.Element {
  return (
    <Stack>
      <Title order={2}>Reports</Title>
      <SimpleGrid cols={2}>
        {REPORTS.map((report) => (
          <Card key={report.to} component={Link} to={report.to} withBorder padding="lg">
            <Text fw={600}>{report.label}</Text>
            <Text size="sm" c="dimmed">
              {report.description}
            </Text>
          </Card>
        ))}
      </SimpleGrid>
    </Stack>
  )
}
