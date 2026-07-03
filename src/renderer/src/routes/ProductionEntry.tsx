import { useState } from 'react'
import { Button, Group, NumberInput, Stack, Table, Text, Textarea, Title } from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { notifications } from '@mantine/notifications'
import { useProduction } from '../hooks/useProduction'
import { today } from '../lib/api'
import type { ProductionEntry as ProductionEntryRow, ProductionEntryInput } from '../../../../shared/types'

const EMPTY_FORM: ProductionEntryInput = { entryDate: today(), rollCount: 0, notes: '' }

export function ProductionEntry(): React.JSX.Element {
  const { entries, loading, create, update, remove } = useProduction()
  const [form, setForm] = useState<ProductionEntryInput>(EMPTY_FORM)
  const [editingId, setEditingId] = useState<number | null>(null)

  const resetForm = (): void => {
    setForm(EMPTY_FORM)
    setEditingId(null)
  }

  const handleSubmit = async (): Promise<void> => {
    if (form.rollCount <= 0) {
      notifications.show({ color: 'red', message: 'Roll count must be greater than zero' })
      return
    }
    if (editingId) {
      await update(editingId, form)
      notifications.show({ color: 'green', message: 'Production entry updated' })
    } else {
      await create(form)
      notifications.show({ color: 'green', message: 'Production entry added' })
    }
    resetForm()
  }

  const handleEdit = (entry: ProductionEntryRow): void => {
    setEditingId(entry.id)
    setForm({ entryDate: entry.entryDate, rollCount: entry.rollCount, notes: entry.notes ?? '' })
  }

  const handleDelete = async (id: number): Promise<void> => {
    await remove(id)
    notifications.show({ color: 'green', message: 'Production entry deleted' })
    if (editingId === id) resetForm()
  }

  return (
    <Stack>
      <Title order={2}>Production Entry</Title>

      <Group align="flex-end">
        <DateInput
          label="Date"
          value={form.entryDate}
          valueFormat="YYYY-MM-DD"
          onChange={(date) => date && setForm({ ...form, entryDate: date })}
        />
        <NumberInput
          label="Roll count"
          min={1}
          value={form.rollCount}
          onChange={(value) => setForm({ ...form, rollCount: Number(value) || 0 })}
        />
        <Textarea
          label="Notes"
          placeholder="Optional"
          value={form.notes ?? ''}
          onChange={(event) => setForm({ ...form, notes: event.currentTarget.value })}
        />
        <Button onClick={handleSubmit}>{editingId ? 'Update entry' : 'Add entry'}</Button>
        {editingId && (
          <Button variant="subtle" onClick={resetForm}>
            Cancel
          </Button>
        )}
      </Group>

      <Title order={4} mt="md">
        Recent Entries
      </Title>
      {loading ? (
        <Text c="dimmed">Loading...</Text>
      ) : (
        <Table striped>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Date</Table.Th>
              <Table.Th>Roll count</Table.Th>
              <Table.Th>Notes</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {entries.map((entry) => (
              <Table.Tr key={entry.id}>
                <Table.Td>{entry.entryDate}</Table.Td>
                <Table.Td>{entry.rollCount}</Table.Td>
                <Table.Td>{entry.notes}</Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <Button size="xs" variant="subtle" onClick={() => handleEdit(entry)}>
                      Edit
                    </Button>
                    <Button size="xs" variant="subtle" color="red" onClick={() => handleDelete(entry.id)}>
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