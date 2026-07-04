import { useState } from 'react'
import {
  Button,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  Table,
  Text,
  Textarea,
  Title
} from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useStock } from '../hooks/useStock'
import { usePagedList } from '../hooks/usePagedList'
import { PaginationBar } from '../components/common/PaginationBar'
import { EmptyState } from '../components/common/EmptyState'
import { today } from '../lib/api'
import { dash } from '../lib/format'
import type { AdjustmentReason, StockAdjustmentInput } from '../../../../shared/types'

const EMPTY_ADJUSTMENT: StockAdjustmentInput = {
  adjustmentDate: today(),
  quantityDelta: 0,
  reason: 'RECOUNT',
  notes: ''
}

const REASON_OPTIONS: { value: AdjustmentReason; label: string }[] = [
  { value: 'DAMAGE', label: 'Damage' },
  { value: 'RECOUNT', label: 'Recount' },
  { value: 'OTHER', label: 'Other' }
]

export function StockView(): React.JSX.Element {
  const { currentStock, ledger, loading, addAdjustment } = useStock()
  const [modalOpen, setModalOpen] = useState(false)
  const { page, pageSize, pageItems, total, setPage, setPageSize } = usePagedList(ledger, 10)

  const form = useForm<StockAdjustmentInput>({
    initialValues: EMPTY_ADJUSTMENT,
    validate: {
      adjustmentDate: (value) => (value ? null : 'Date is required'),
      quantityDelta: (value) => (value !== 0 ? null : 'Adjustment quantity cannot be zero'),
      reason: (value) => (value ? null : 'Reason is required')
    }
  })

  const closeModal = (): void => {
    setModalOpen(false)
    form.setValues(EMPTY_ADJUSTMENT)
    form.clearErrors()
  }

  const handleSubmit = async (values: StockAdjustmentInput): Promise<void> => {
    await addAdjustment(values)
    notifications.show({ color: 'green', message: 'Stock adjustment recorded' })
    closeModal()
  }

  return (
    <Stack>
      <Title order={2}>Stock</Title>

      <Group align="baseline">
        <Text size="xl" fw={700}>
          {currentStock}
        </Text>
        <Text c="dimmed">rolls currently in stock</Text>
        <Button ml="auto" onClick={() => setModalOpen(true)}>
          + Add Adjustment
        </Button>
      </Group>

      <Title order={4} mt="md">
        Ledger
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
                <Table.Th>Type</Table.Th>
                <Table.Th>Quantity</Table.Th>
                <Table.Th>Balance</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {pageItems.map((row) => (
                <Table.Tr key={row.id}>
                  <Table.Td>{dash(row.entryDate)}</Table.Td>
                  <Table.Td>{dash(row.entryType)}</Table.Td>
                  <Table.Td>{row.quantity > 0 ? `+${row.quantity}` : row.quantity}</Table.Td>
                  <Table.Td>{dash(row.runningBalance)}</Table.Td>
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

      <Modal opened={modalOpen} onClose={closeModal} title="Add Stock Adjustment">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <DateInput
              label="Date"
              valueFormat="YYYY-MM-DD"
              {...form.getInputProps('adjustmentDate')}
            />
            <NumberInput
              label="Quantity change"
              description="Positive to add rolls back, negative for damage/loss"
              {...form.getInputProps('quantityDelta')}
            />
            <Select
              label="Reason"
              data={REASON_OPTIONS}
              {...form.getInputProps('reason')}
              onChange={(value) => form.setFieldValue('reason', (value as AdjustmentReason) ?? '')}
            />
            <Textarea label="Notes" placeholder="Optional" {...form.getInputProps('notes')} />
            <Button type="submit">Save Adjustment</Button>
          </Stack>
        </form>
      </Modal>
    </Stack>
  )
}
