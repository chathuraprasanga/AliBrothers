import { useRef, useState } from 'react'
import { Autocomplete, Group, TextInput } from '@mantine/core'
import { api } from '../../lib/api'
import type { Customer } from '../../../../../shared/types'

interface CustomerFields {
  customerId?: number
  customerName: string
  customerPhone: string
}

interface CustomerComboboxProps {
  value: CustomerFields
  onChange: (value: CustomerFields) => void
}

export function CustomerCombobox({ value, onChange }: CustomerComboboxProps): React.JSX.Element {
  const [options, setOptions] = useState<string[]>([])
  const customersByLabel = useRef(new Map<string, Customer>())

  const search = async (query: string): Promise<void> => {
    if (!query.trim()) {
      setOptions([])
      return
    }
    const results = await api.customers.search(query)
    customersByLabel.current = new Map(
      results.map((customer) => [`${customer.name}${customer.phone ? ` — ${customer.phone}` : ''}`, customer])
    )
    setOptions([...customersByLabel.current.keys()])
  }

  const handleNameChange = (name: string): void => {
    const matched = customersByLabel.current.get(name)
    if (matched) {
      onChange({ customerId: matched.id, customerName: matched.name, customerPhone: matched.phone ?? '' })
    } else {
      onChange({ customerId: undefined, customerName: name, customerPhone: value.customerPhone })
    }
    search(name)
  }

  return (
    <Group grow align="flex-start">
      <Autocomplete
        label="Customer name"
        placeholder="Search or add new customer"
        data={options}
        value={value.customerName}
        onChange={handleNameChange}
        required
      />
      <TextInput
        label="Phone"
        placeholder="Customer phone number"
        value={value.customerPhone}
        onChange={(event) =>
          onChange({ ...value, customerId: undefined, customerPhone: event.currentTarget.value })
        }
      />
    </Group>
  )
}