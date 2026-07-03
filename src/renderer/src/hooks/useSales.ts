import { useCallback, useEffect, useState } from 'react'
import { api } from '../lib/api'
import type { Sale, SaleInput } from '../../../../shared/types'

export function useSales() {
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    setLoading(true)
    setSales(await api.sales.list())
    setLoading(false)
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const create = async (input: SaleInput): Promise<void> => {
    await api.sales.create(input)
    await reload()
  }

  const update = async (id: number, input: SaleInput): Promise<void> => {
    await api.sales.update(id, input)
    await reload()
  }

  const remove = async (id: number): Promise<void> => {
    await api.sales.delete(id)
    await reload()
  }

  return { sales, loading, create, update, remove }
}