import { getDb } from '../index'
import type { StockAdjustment, StockAdjustmentInput } from '../../../../shared/types'

function getAdjustmentById(id: number): StockAdjustment {
  const db = getDb()
  return db
    .prepare(
      `SELECT id, adjustment_date as adjustmentDate, quantity_delta as quantityDelta, reason, notes,
              created_at as createdAt
       FROM stock_adjustments WHERE id = ?`
    )
    .get(id) as StockAdjustment
}

export function createAdjustment(input: StockAdjustmentInput): StockAdjustment {
  const db = getDb()
  const insert = db.transaction(() => {
    const result = db
      .prepare(
        `INSERT INTO stock_adjustments (adjustment_date, quantity_delta, reason, notes)
         VALUES (?, ?, ?, ?)`
      )
      .run(input.adjustmentDate, input.quantityDelta, input.reason, input.notes ?? null)
    const id = result.lastInsertRowid as number
    db.prepare(
      `INSERT INTO stock_ledger (entry_date, entry_type, quantity, reference_table, reference_id)
       VALUES (?, 'ADJUSTMENT', ?, 'stock_adjustments', ?)`
    ).run(input.adjustmentDate, input.quantityDelta, id)
    return id
  })
  return getAdjustmentById(insert())
}