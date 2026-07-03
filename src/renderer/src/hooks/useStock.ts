import { useCallback, useEffect, useState } from 'react'
import { api } from '../lib/api'
import type { StockAdjustmentInput, StockLedgerRow } from '../../../../shared/types'

export function useStock() {
  const [currentStock, setCurrentStock] = useState(0)
  const [ledger, setLedger] = useState<StockLedgerRow[]>([])
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    setLoading(true)
    const [stock, ledgerRows] = await Promise.all([api.stock.current(), api.stock.ledger()])
    setCurrentStock(stock)
    setLedger(ledgerRows)
    setLoading(false)
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const addAdjustment = async (input: StockAdjustmentInput): Promise<void> => {
    await api.stock.addAdjustment(input)
    await reload()
  }

  return { currentStock, ledger, loading, addAdjustment }
}