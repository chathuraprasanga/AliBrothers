import { getDb } from '../index'
import type { DateRangeFilter, StockLedgerRow } from '../../../../shared/types'

export function getCurrentStock(): number {
  const db = getDb()
  const row = db.prepare(`SELECT stock_count as stockCount FROM current_stock WHERE product_type_id = 1`).get() as
    | { stockCount: number }
    | undefined
  return row?.stockCount ?? 0
}

export function getStockLedger(filters?: DateRangeFilter): StockLedgerRow[] {
  const db = getDb()
  let query = `
    SELECT id, entry_date as entryDate, entry_type as entryType, quantity,
           reference_table as referenceTable, reference_id as referenceId,
           SUM(quantity) OVER (ORDER BY entry_date, id) AS runningBalance
    FROM stock_ledger
    WHERE 1 = 1
  `
  const params: string[] = []
  if (filters?.dateFrom) {
    query += ' AND entry_date >= ?'
    params.push(filters.dateFrom)
  }
  if (filters?.dateTo) {
    query += ' AND entry_date <= ?'
    params.push(filters.dateTo)
  }
  query += ' ORDER BY entry_date, id'
  return db.prepare(query).all(...params) as StockLedgerRow[]
}