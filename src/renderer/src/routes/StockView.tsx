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
import { notifications } from '@mantine/notifications'
import { useStock } from '../hooks/useStock'
import { today } from '../lib/api'
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
  const [form, setForm] = useState<StockAdjustmentInput>(EMPTY_ADJUSTMENT)

  const handleSubmit = async (): Promise<void> => {
    if (form.quantityDelta === 0) {
      notifications.show({ color: 'red', message: 'Adjustment quantity cannot be zero' })
      return
    }
    await addAdjustment(form)
    notifications.show({ color: 'green', message: 'Stock adjustment recorded' })
    setForm(EMPTY_ADJUSTMENT)
    setModalOpen(false)
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
      ) : (
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
            {ledger.map((row) => (
              <Table.Tr key={row.id}>
                <Table.Td>{row.entryDate}</Table.Td>
                <Table.Td>{row.entryType}</Table.Td>
                <Table.Td>{row.quantity > 0 ? `+${row.quantity}` : row.quantity}</Table.Td>
                <Table.Td>{row.runningBalance}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}

      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title="Add Stock Adjustment">
        <Stack>
          <DateInput
            label="Date"
            value={form.adjustmentDate}
            valueFormat="YYYY-MM-DD"
            onChange={(date) => date && setForm({ ...form, adjustmentDate: date })}
          />
          <NumberInput
            label="Quantity change"
            description="Positive to add rolls back, negative for damage/loss"
            value={form.quantityDelta}
            onChange={(value) => setForm({ ...form, quantityDelta: Number(value) || 0 })}
          />
          <Select
            label="Reason"
            data={REASON_OPTIONS}
            value={form.reason}
            onChange={(value) => value && setForm({ ...form, reason: value as AdjustmentReason })}
          />
          <Textarea
            label="Notes"
            placeholder="Optional"
            value={form.notes ?? ''}
            onChange={(event) => setForm({ ...form, notes: event.currentTarget.value })}
          />
          <Button onClick={handleSubmit}>Save Adjustment</Button>
        </Stack>
      </Modal>
    </Stack>
  )
}