import { useState } from 'react'
import { Button, Group, NumberInput, Stack, Table, Text, TextInput, Textarea, Title } from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { notifications } from '@mantine/notifications'
import { useSales } from '../hooks/useSales'
import { CustomerCombobox } from '../components/common/CustomerCombobox'
import { today } from '../lib/api'
import type { Sale, SaleInput } from '../../../../shared/types'

const EMPTY_FORM: SaleInput = {
  saleDate: today(),
  customerName: '',
  customerPhone: '',
  vehicleNumber: '',
  rollCount: 0,
  notes: ''
}

export function SalesEntry(): React.JSX.Element {
  const { sales, loading, create, update, remove } = useSales()
  const [form, setForm] = useState<SaleInput>(EMPTY_FORM)
  const [editingId, setEditingId] = useState<number | null>(null)

  const resetForm = (): void => {
    setForm(EMPTY_FORM)
    setEditingId(null)
  }

  const handleSubmit = async (): Promise<void> => {
    if (!form.customerName.trim()) {
      notifications.show({ color: 'red', message: 'Customer name is required' })
      return
    }
    if (form.rollCount <= 0) {
      notifications.show({ color: 'red', message: 'Roll count must be greater than zero' })
      return
    }
    if (editingId) {
      await update(editingId, form)
      notifications.show({ color: 'green', message: 'Sale updated' })
    } else {
      await create(form)
      notifications.show({ color: 'green', message: 'Sale recorded' })
    }
    resetForm()
  }

  const handleEdit = (sale: Sale): void => {
    setEditingId(sale.id)
    setForm({
      saleDate: sale.saleDate,
      customerId: sale.customerId,
      customerName: sale.customerName,
      customerPhone: sale.customerPhone ?? '',
      vehicleNumber: sale.vehicleNumber ?? '',
      rollCount: sale.rollCount,
      notes: sale.notes ?? ''
    })
  }

  const handleDelete = async (id: number): Promise<void> => {
    await remove(id)
    notifications.show({ color: 'green', message: 'Sale deleted' })
    if (editingId === id) resetForm()
  }

  return (
    <Stack>
      <Title order={2}>Sales Entry</Title>

      <Stack gap="sm" maw={640}>
        <Group>
          <DateInput
            label="Date"
            value={form.saleDate}
            valueFormat="YYYY-MM-DD"
            onChange={(date) => date && setForm({ ...form, saleDate: date })}
          />
          <TextInput
            label="Vehicle number"
            placeholder="Optional"
            value={form.vehicleNumber ?? ''}
            onChange={(event) => setForm({ ...form, vehicleNumber: event.currentTarget.value })}
          />
          <NumberInput
            label="Roll count"
            min={1}
            value={form.rollCount}
            onChange={(value) => setForm({ ...form, rollCount: Number(value) || 0 })}
          />
        </Group>

        <CustomerCombobox
          value={{
            customerId: form.customerId,
            customerName: form.customerName,
            customerPhone: form.customerPhone ?? ''
          }}
          onChange={(fields) => setForm({ ...form, ...fields })}
        />

        <Textarea
          label="Notes"
          placeholder="Optional"
          value={form.notes ?? ''}
          onChange={(event) => setForm({ ...form, notes: event.currentTarget.value })}
        />

        <Group>
          <Button onClick={handleSubmit}>{editingId ? 'Update sale' : 'Record sale'}</Button>
          {editingId && (
            <Button variant="subtle" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </Group>
      </Stack>

      <Title order={4} mt="md">
        Recent Sales
      </Title>
      {loading ? (
        <Text c="dimmed">Loading...</Text>
      ) : (
        <Table striped>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Date</Table.Th>
              <Table.Th>Customer</Table.Th>
              <Table.Th>Phone</Table.Th>
              <Table.Th>Vehicle</Table.Th>
              <Table.Th>Roll count</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {sales.map((sale) => (
              <Table.Tr key={sale.id}>
                <Table.Td>{sale.saleDate}</Table.Td>
                <Table.Td>{sale.customerName}</Table.Td>
                <Table.Td>{sale.customerPhone}</Table.Td>
                <Table.Td>{sale.vehicleNumber}</Table.Td>
                <Table.Td>{sale.rollCount}</Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <Button size="xs" variant="subtle" onClick={() => handleEdit(sale)}>
                      Edit
                    </Button>
                    <Button size="xs" variant="subtle" color="red" onClick={() => handleDelete(sale.id)}>
                      Delete
                    </Button>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </Stack>
  )
}