import { useCallback, useEffect, useState } from 'react'
import { api } from '../lib/api'
import type { Customer, CustomerInput } from '../../../../shared/types'

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    setLoading(true)
    setCustomers(await api.customers.list())
    setLoading(false)
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const create = async (input: CustomerInput): Promise<void> => {
    await api.customers.create(input)
    await reload()
  }

  const update = async (id: number, input: CustomerInput): Promise<void> => {
    await api.customers.update(id, input)
    await reload()
  }

  const remove = async (id: number): Promise<void> => {
    await api.customers.delete(id)
    await reload()
  }

  return { customers, loading, create, update, remove }
}
