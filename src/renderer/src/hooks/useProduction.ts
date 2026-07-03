import { useCallback, useEffect, useState } from 'react'
import { api } from '../lib/api'
import type { ProductionEntry, ProductionEntryInput } from '../../../../shared/types'

export function useProduction() {
  const [entries, setEntries] = useState<ProductionEntry[]>([])
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    setLoading(true)
    setEntries(await api.production.list())
    setLoading(false)
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const create = async (input: ProductionEntryInput): Promise<void> => {
    await api.production.create(input)
    await reload()
  }

  const update = async (id: number, input: ProductionEntryInput): Promise<void> => {
    await api.production.update(id, input)
    await reload()
  }

  const remove = async (id: number): Promise<void> => {
    await api.production.delete(id)
    await reload()
  }

  return { entries, loading, create, update, remove }
}