import { getDb } from '../index'
import type { DateRangeFilter, ProductionEntry, ProductionEntryInput } from '../../../../shared/types'

function getProductionEntryById(id: number): ProductionEntry {
  const db = getDb()
  return db
    .prepare(
      `SELECT id, entry_date as entryDate, roll_count as rollCount, notes,
              created_at as createdAt, updated_at as updatedAt
       FROM production_entries WHERE id = ?`
    )
    .get(id) as ProductionEntry
}

export function listProductionEntries(filters?: DateRangeFilter): ProductionEntry[] {
  const db = getDb()
  let query = `
    SELECT id, entry_date as entryDate, roll_count as rollCount, notes,
           created_at as createdAt, updated_at as updatedAt
    FROM production_entries
    WHERE deleted_at IS NULL
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
  query += ' ORDER BY entry_date DESC, id DESC'
  return db.prepare(query).all(...params) as ProductionEntry[]
}

export function createProductionEntry(input: ProductionEntryInput): ProductionEntry {
  const db = getDb()
  const insert = db.transaction(() => {
    const result = db
      .prepare(`INSERT INTO production_entries (entry_date, roll_count, notes) VALUES (?, ?, ?)`)
      .run(input.entryDate, input.rollCount, input.notes ?? null)
    const id = result.lastInsertRowid as number
    db.prepare(
      `INSERT INTO stock_ledger (entry_date, entry_type, quantity, reference_table, reference_id)
       VALUES (?, 'PRODUCTION', ?, 'production_entries', ?)`
    ).run(input.entryDate, input.rollCount, id)
    return id
  })
  return getProductionEntryById(insert())
}

export function updateProductionEntry(id: number, input: ProductionEntryInput): ProductionEntry {
  const db = getDb()
  const update = db.transaction(() => {
    db.prepare(
      `UPDATE production_entries SET entry_date = ?, roll_count = ?, notes = ?, updated_at = datetime('now')
       WHERE id = ?`
    ).run(input.entryDate, input.rollCount, input.notes ?? null, id)
    db.prepare(
      `UPDATE stock_ledger SET entry_date = ?, quantity = ?
       WHERE reference_table = 'production_entries' AND reference_id = ?`
    ).run(input.entryDate, input.rollCount, id)
  })
  update()
  return getProductionEntryById(id)
}

export function deleteProductionEntry(id: number): void {
  const db = getDb()
  const del = db.transaction(() => {
    db.prepare(`UPDATE production_entries SET deleted_at = datetime('now') WHERE id = ?`).run(id)
    db.prepare(
      `DELETE FROM stock_ledger WHERE reference_table = 'production_entries' AND reference_id = ?`
    ).run(id)
  })
  del()
}
