import { useEffect, useState } from 'react'
import { Button, Card, Group, Stack, Text, Title } from '@mantine/core'
import { Link, useParams } from 'react-router-dom'
import { api } from '../lib/api'
import { dash } from '../lib/format'
import type { Customer } from '../../../../shared/types'

export function CustomerDetail(): React.JSX.Element {
  const { id } = useParams<{ id: string }>()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    api.customers.get(Number(id)).then((result) => {
      setCustomer(result ?? null)
      setLoading(false)
    })
  }, [id])

  return (
    <Stack>
      <Group justify="space-between">
        <Title order={2}>Customer Details</Title>
        <Button component={Link} to="/customers" variant="subtle">
          ← Back
        </Button>
      </Group>

      {loading ? (
        <Text c="dimmed">Loading...</Text>
      ) : !customer ? (
        <Text c="dimmed">Customer not found.</Text>
      ) : (
        <Card withBorder padding="lg" maw={480}>
          <Stack gap="sm">
            <div>
              <Text size="sm" c="dimmed">
                Name
              </Text>
              <Text fw={600}>{dash(customer.name)}</Text>
            </div>
            <div>
              <Text size="sm" c="dimmed">
                Phone
              </Text>
              <Text>{dash(customer.phone)}</Text>
            </div>
            <div>
              <Text size="sm" c="dimmed">
                Address
              </Text>
              <Text>{dash(customer.address)}</Text>
            </div>
          </Stack>
        </Card>
      )}
    </Stack>
  )
}
