import { useMemo, useState } from 'react'
import { Button, Group, Modal, Stack, Table, Text, TextInput, Textarea, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { Link } from 'react-router-dom'
import { useCustomers } from '../hooks/useCustomers'
import { usePagedList } from '../hooks/usePagedList'
import { ConfirmModal } from '../components/common/ConfirmModal'
import { PaginationBar } from '../components/common/PaginationBar'
import { EmptyState } from '../components/common/EmptyState'
import { dash } from '../lib/format'
import type { Customer, CustomerInput } from '../../../../shared/types'

const EMPTY_FORM: CustomerInput = { name: '', phone: '', address: '' }

export function Customers(): React.JSX.Element {
  const { customers, loading, create, update, remove } = useCustomers()
  const [query, setQuery] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const form = useForm<CustomerInput>({
    initialValues: EMPTY_FORM,
    validate: {
      name: (value) => (value.trim() ? null : 'Customer name is required'),
      phone: (value) => (value.trim() ? null : 'Phone number is required'),
      address: (value) => (value.trim() ? null : 'Address is required')
    }
  })

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return customers
    return customers.filter(
      (customer) =>
        customer.phone?.toLowerCase().includes(q) || customer.name.toLowerCase().includes(q)
    )
  }, [customers, query])

  const { page, pageSize, pageItems, total, setPage, setPageSize } = usePagedList(filtered, 10)

  const closeModal = (): void => {
    setModalOpen(false)
    form.setValues(EMPTY_FORM)
    form.clearErrors()
    setEditingId(null)
  }

  const handleSubmit = async (values: CustomerInput): Promise<void> => {
    try {
      if (editingId) {
        await update(editingId, values)
        notifications.show({ color: 'green', message: 'Customer updated' })
      } else {
        await create(values)
        notifications.show({ color: 'green', message: 'Customer added' })
      }
      closeModal()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save customer'
      if (message.toLowerCase().includes('phone')) {
        form.setFieldError('phone', message)
      } else {
        notifications.show({ color: 'red', message })
      }
    }
  }

  const handleEdit = (customer: Customer): void => {
    setEditingId(customer.id)
    form.setValues({
      name: customer.name,
      phone: customer.phone ?? '',
      address: customer.address ?? ''
    })
    setModalOpen(true)
  }

  const handleDelete = async (id: number): Promise<void> => {
    try {
      await remove(id)
      notifications.show({ color: 'green', message: 'Customer deleted' })
    } catch (error) {
      notifications.show({
        color: 'red',
        message: error instanceof Error ? error.message : 'Failed to delete customer'
      })
    }
    setDeleteId(null)
  }

  return (
    <Stack>
      <Group justify="space-between">
        <Title order={2}>Customers</Title>
        <Button onClick={() => setModalOpen(true)}>+ Add Customer</Button>
      </Group>

      <TextInput
        placeholder="Search by phone or name"
        value={query}
        onChange={(event) => setQuery(event.currentTarget.value)}
        maw={320}
      />

      <Modal
        opened={modalOpen}
        onClose={closeModal}
        title={editingId ? 'Update Customer' : 'Add Customer'}
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="sm">
            <TextInput
              label="Name"
              placeholder="Enter customer name"
              {...form.getInputProps('name')}
            />
            <TextInput
              label="Phone"
              placeholder="Enter phone number"
              {...form.getInputProps('phone')}
            />
            <Textarea
              label="Address"
              placeholder="Enter address"
              autosize
              minRows={2}
              {...form.getInputProps('address')}
            />
            <Button type="submit">{editingId ? 'Update customer' : 'Add customer'}</Button>
          </Stack>
        </form>
      </Modal>

      {loading ? (
        <Text c="dimmed">Loading...</Text>
      ) : pageItems.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <Table striped>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Phone</Table.Th>
                <Table.Th>Address</Table.Th>
                <Table.Th />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {pageItems.map((customer) => (
                <Table.Tr key={customer.id}>
                  <Table.Td>{dash(customer.name)}</Table.Td>
                  <Table.Td>{dash(customer.phone)}</Table.Td>
                  <Table.Td>{dash(customer.address)}</Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <Button
                        size="xs"
                        variant="subtle"
                        component={Link}
                        to={`/customers/${customer.id}`}
                      >
                        View
                      </Button>
                      <Button size="xs" variant="subtle" onClick={() => handleEdit(customer)}>
                        Edit
                      </Button>
                      <Button
                        size="xs"
                        variant="subtle"
                        color="red"
                        onClick={() => setDeleteId(customer.id)}
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
        message="Delete this customer? This cannot be undone."
        onCancel={() => setDeleteId(null)}
        onConfirm={() => deleteId !== null && handleDelete(deleteId)}
      />
    </Stack>
  )
}
