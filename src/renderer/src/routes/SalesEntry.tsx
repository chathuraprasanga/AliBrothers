import { useEffect, useState } from 'react'
import {
  Button,
  Card,
  Group,
  Modal,
  NumberInput,
  Stack,
  Switch,
  Table,
  Text,
  TextInput,
  Textarea,
  Title
} from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useSales } from '../hooks/useSales'
import { usePagedList } from '../hooks/usePagedList'
import { ConfirmModal } from '../components/common/ConfirmModal'
import { PaginationBar } from '../components/common/PaginationBar'
import { EmptyState } from '../components/common/EmptyState'
import { api, today } from '../lib/api'
import { dash } from '../lib/format'
import type { Customer, Sale, SaleInput } from '../../../../shared/types'

interface SaleFormValues {
  saleDate: string
  vehicleNumber: string
  rollCount: number
  notes: string
  customerMode: 'existing' | 'new'
  customerId: number | null
  customerName: string
  customerPhone: string
  customerAddress: string
}

const EMPTY_FORM: SaleFormValues = {
  saleDate: today(),
  vehicleNumber: '',
  rollCount: 0,
  notes: '',
  customerMode: 'existing',
  customerId: null,
  customerName: '',
  customerPhone: '',
  customerAddress: ''
}

export function SalesEntry(): React.JSX.Element {
  const { sales, loading, create, update, remove } = useSales()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [lookupPhone, setLookupPhone] = useState('')
  const [foundCustomer, setFoundCustomer] = useState<Customer | null | undefined>(undefined)
  const [currentStock, setCurrentStock] = useState(0)
  const [editingOriginalRollCount, setEditingOriginalRollCount] = useState(0)
  const { page, pageSize, pageItems, total, setPage, setPageSize } = usePagedList(sales, 10)

  useEffect(() => {
    api.stock.current().then(setCurrentStock)
  }, [sales])

  const form = useForm<SaleFormValues>({
    initialValues: EMPTY_FORM,
    validate: {
      saleDate: (value) => (value ? null : 'Date is required'),
      vehicleNumber: (value) => (value?.trim() ? null : 'Vehicle number is required'),
      rollCount: (value) => {
        if (value <= 0) return 'Roll count must be greater than zero'
        const available = currentStock + editingOriginalRollCount
        if (value > available) return `Only ${available} rolls available in stock`
        return null
      },
      customerId: (value, values) =>
        values.customerMode === 'existing' && !value
          ? 'Search for a customer by phone first'
          : null,
      customerName: (value, values) =>
        values.customerMode === 'new' && !value.trim() ? 'Customer name is required' : null,
      customerPhone: (value, values) =>
        values.customerMode === 'new' && !value.trim() ? 'Phone number is required' : null,
      customerAddress: (value, values) =>
        values.customerMode === 'new' && !value.trim() ? 'Address is required' : null
    }
  })

  const closeModal = (): void => {
    setModalOpen(false)
    form.setValues(EMPTY_FORM)
    form.clearErrors()
    setEditingId(null)
    setEditingOriginalRollCount(0)
    setFoundCustomer(undefined)
    setLookupPhone('')
  }

  const handleModeChange = (checked: boolean): void => {
    const mode = checked ? 'new' : 'existing'
    form.setFieldValue('customerMode', mode)
    form.setFieldValue('customerId', null)
    form.clearFieldError('customerId')
    setFoundCustomer(undefined)
    setLookupPhone('')
  }

  const handleFindCustomer = async (): Promise<void> => {
    if (!lookupPhone.trim()) return
    const customer = await api.customers.findByPhone(lookupPhone.trim())
    setFoundCustomer(customer ?? null)
    form.setFieldValue('customerId', customer?.id ?? null)
    if (customer) form.clearFieldError('customerId')
  }

  const handleSubmit = async (values: SaleFormValues): Promise<void> => {
    try {
      let customerId = values.customerId
      if (values.customerMode === 'new') {
        const newCustomer = await api.customers.create({
          name: values.customerName,
          phone: values.customerPhone,
          address: values.customerAddress
        })
        customerId = newCustomer.id
      }
      if (!customerId) return

      const saleInput: SaleInput = {
        saleDate: values.saleDate,
        customerId,
        vehicleNumber: values.vehicleNumber,
        rollCount: values.rollCount,
        notes: values.notes
      }

      if (editingId) {
        await update(editingId, saleInput)
        notifications.show({ color: 'green', message: 'Sale updated' })
      } else {
        await create(saleInput)
        notifications.show({ color: 'green', message: 'Sale recorded' })
      }
      closeModal()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save sale'
      if (message.toLowerCase().includes('phone')) {
        form.setFieldError('customerPhone', message)
      } else {
        notifications.show({ color: 'red', message })
      }
    }
  }

  const handleEdit = (sale: Sale): void => {
    setEditingId(sale.id)
    setEditingOriginalRollCount(sale.rollCount)
    setFoundCustomer({
      id: sale.customerId,
      name: sale.customerName,
      phone: sale.customerPhone,
      address: sale.customerAddress,
      notes: null
    })
    setLookupPhone(sale.customerPhone ?? '')
    form.setValues({
      saleDate: sale.saleDate,
      vehicleNumber: sale.vehicleNumber ?? '',
      rollCount: sale.rollCount,
      notes: sale.notes ?? '',
      customerMode: 'existing',
      customerId: sale.customerId,
      customerName: sale.customerName,
      customerPhone: sale.customerPhone ?? '',
      customerAddress: sale.customerAddress ?? ''
    })
    setModalOpen(true)
  }

  const handleDelete = async (id: number): Promise<void> => {
    await remove(id)
    notifications.show({ color: 'green', message: 'Sale deleted' })
    if (editingId === id) closeModal()
    setDeleteId(null)
  }

  return (
    <Stack>
      <Group justify="space-between">
        <Title order={2}>Sales Entry</Title>
        <Button onClick={() => setModalOpen(true)}>+ Record Sale</Button>
      </Group>

      <Modal
        opened={modalOpen}
        onClose={closeModal}
        title={editingId ? 'Update Sale' : 'Record Sale'}
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="sm">
            <Group grow align="flex-start">
              <DateInput
                label="Date"
                valueFormat="YYYY-MM-DD"
                {...form.getInputProps('saleDate')}
              />
              <TextInput
                label="Vehicle number"
                placeholder="XXX-XXXX / XX-XXXX"
                {...form.getInputProps('vehicleNumber')}
              />
            </Group>

            <NumberInput label="Roll count" min={1} {...form.getInputProps('rollCount')} />

            <Switch
              label={form.values.customerMode === 'new' ? 'New customer' : 'Existing customer'}
              checked={form.values.customerMode === 'new'}
              onChange={(event) => handleModeChange(event.currentTarget.checked)}
            />

            {form.values.customerMode === 'existing' ? (
              <Stack gap="xs">
                <Group align="flex-end">
                  <TextInput
                    label="Customer phone"
                    placeholder="Enter phone number"
                    value={lookupPhone}
                    onChange={(event) => setLookupPhone(event.currentTarget.value)}
                    style={{ flex: 1 }}
                  />
                  <Button variant="default" onClick={handleFindCustomer}>
                    Find
                  </Button>
                </Group>
                {form.errors.customerId && (
                  <Text c="red" size="sm">
                    {form.errors.customerId}
                  </Text>
                )}
                {foundCustomer === null && (
                  <Text c="red" size="sm">
                    No customer found for this phone number.
                  </Text>
                )}
                {foundCustomer && (
                  <Card withBorder padding="sm">
                    <Text fw={600}>{foundCustomer.name}</Text>
                    <Text size="sm">{foundCustomer.phone}</Text>
                    <Text size="sm" c="dimmed">
                      {foundCustomer.address}
                    </Text>
                  </Card>
                )}
              </Stack>
            ) : (
              <Stack gap="sm">
                <TextInput
                  label="Customer name"
                  placeholder="Enter customer name"
                  {...form.getInputProps('customerName')}
                />
                <TextInput
                  label="Phone"
                  placeholder="Enter phone number"
                  {...form.getInputProps('customerPhone')}
                />
                <Textarea
                  label="Address"
                  placeholder="Enter address"
                  autosize
                  minRows={2}
                  {...form.getInputProps('customerAddress')}
                />
              </Stack>
            )}

            <Textarea label="Notes" placeholder="Optional" {...form.getInputProps('notes')} />

            <Button type="submit">{editingId ? 'Update sale' : 'Record sale'}</Button>
          </Stack>
        </form>
      </Modal>

      <Title order={4} mt="md">
        Recent Sales
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
                <Table.Th>Customer</Table.Th>
                <Table.Th>Phone</Table.Th>
                <Table.Th>Vehicle</Table.Th>
                <Table.Th>Roll count</Table.Th>
                <Table.Th />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {pageItems.map((sale) => (
                <Table.Tr key={sale.id}>
                  <Table.Td>{dash(sale.saleDate)}</Table.Td>
                  <Table.Td>{dash(sale.customerName)}</Table.Td>
                  <Table.Td>{dash(sale.customerPhone)}</Table.Td>
                  <Table.Td>{dash(sale.vehicleNumber)}</Table.Td>
                  <Table.Td>{dash(sale.rollCount)}</Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <Button size="xs" variant="subtle" onClick={() => handleEdit(sale)}>
                        Edit
                      </Button>
                      <Button
                        size="xs"
                        variant="subtle"
                        color="red"
                        onClick={() => setDeleteId(sale.id)}
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
        message="Delete this sale record? This cannot be undone."
        onCancel={() => setDeleteId(null)}
        onConfirm={() => deleteId !== null && handleDelete(deleteId)}
      />
    </Stack>
  )
}
