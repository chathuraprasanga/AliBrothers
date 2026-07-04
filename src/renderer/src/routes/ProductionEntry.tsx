import { useState } from 'react'
import {
  Button,
  Group,
  Modal,
  NumberInput,
  Stack,
  Table,
  Text,
  Textarea,
  Title
} from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { notifications } from '@mantine/notifications'
import { useProduction } from '../hooks/useProduction'
import { usePagedList } from '../hooks/usePagedList'
import { ConfirmModal } from '../components/common/ConfirmModal'
import { PaginationBar } from '../components/common/PaginationBar'
import { EmptyState } from '../components/common/EmptyState'
import { today } from '../lib/api'
import { dash } from '../lib/format'
import type {
  ProductionEntry as ProductionEntryRow,
  ProductionEntryInput
} from '../../../../shared/types'

const EMPTY_FORM: ProductionEntryInput = { entryDate: today(), rollCount: 0, notes: '' }

export function ProductionEntry(): React.JSX.Element {
  const { entries, loading, create, update, remove } = useProduction()
  const [form, setForm] = useState<ProductionEntryInput>(EMPTY_FORM)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const { page, pageSize, pageItems, total, setPage, setPageSize } = usePagedList(entries, 10)

  const closeModal = (): void => {
    setModalOpen(false)
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
    closeModal()
  }

  const handleEdit = (entry: ProductionEntryRow): void => {
    setEditingId(entry.id)
    setForm({ entryDate: entry.entryDate, rollCount: entry.rollCount, notes: entry.notes ?? '' })
    setModalOpen(true)
  }

  const handleDelete = async (id: number): Promise<void> => {
    await remove(id)
    notifications.show({ color: 'green', message: 'Production entry deleted' })
    if (editingId === id) closeModal()
    setDeleteId(null)
  }

  return (
    <Stack>
      <Group justify="space-between">
        <Title order={2}>Production Entry</Title>
        <Button onClick={() => setModalOpen(true)}>+ Add Entry</Button>
      </Group>

      <Modal
        opened={modalOpen}
        onClose={closeModal}
        title={editingId ? 'Update Entry' : 'Add Production Entry'}
      >
        <Stack>
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
        </Stack>
      </Modal>

      <Title order={4} mt="md">
        Recent Entries
      </Title>
      {loading ? (
        <Text c="dimmed">Loading...</Text>
      ) : pageItems.length === 0 ? (
        <EmptyState />
      ) : (
        <>
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
              {pageItems.map((entry) => (
                <Table.Tr key={entry.id}>
                  <Table.Td>{dash(entry.entryDate)}</Table.Td>
                  <Table.Td>{dash(entry.rollCount)}</Table.Td>
                  <Table.Td>{dash(entry.notes)}</Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <Button size="xs" variant="subtle" onClick={() => handleEdit(entry)}>
                        Edit
                      </Button>
                      <Button
                        size="xs"
                        variant="subtle"
                        color="red"
                        onClick={() => setDeleteId(entry.id)}
                      >
                        Delete
                      </Button>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
          <PaginationBar
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </>
      )}

      <ConfirmModal
        opened={deleteId !== null}
        message="Delete this production entry? This cannot be undone."
        onCancel={() => setDeleteId(null)}
        onConfirm={() => deleteId !== null && handleDelete(deleteId)}
      />
    </Stack>
  )
}
