import { useEffect, useState } from 'react'
import { Button, Card, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { Link } from 'react-router-dom'
import { api, today } from '../lib/api'

export function Dashboard(): React.JSX.Element {
  const [todayProduction, setTodayProduction] = useState(0)
  const [todaySales, setTodaySales] = useState(0)
  const [currentStock, setCurrentStock] = useState(0)

  useEffect(() => {
    const todayDate = today()
    const range = { dateFrom: todayDate, dateTo: todayDate }
    api.production.list(range).then((entries) => setTodayProduction(entries.reduce((s, e) => s + e.rollCount, 0)))
    api.sales.list(range).then((sales) => setTodaySales(sales.reduce((s, sale) => s + sale.rollCount, 0)))
    api.stock.current().then(setCurrentStock)
  }, [])

  return (
    <Stack>
      <Title order={2}>Dashboard</Title>

      <SimpleGrid cols={3}>
        <Card withBorder padding="lg">
          <Text c="dimmed">Today&apos;s Production</Text>
          <Text size="xl" fw={700}>
            {todayProduction} rolls
          </Text>
        </Card>
        <Card withBorder padding="lg">
          <Text c="dimmed">Today&apos;s Sales</Text>
          <Text size="xl" fw={700}>
            {todaySales} rolls
          </Text>
        </Card>
        <Card withBorder padding="lg">
          <Text c="dimmed">Current Stock</Text>
          <Text size="xl" fw={700}>
            {currentStock} rolls
          </Text>
        </Card>
      </SimpleGrid>

      <Group mt="md">
        <Button component={Link} to="/production">
          + Add Production
        </Button>
        <Button component={Link} to="/sales">
          + Record Sale
        </Button>
        <Button variant="light" component={Link} to="/reports">
          View Reports
        </Button>
      </Group>
    </Stack>
  )
}