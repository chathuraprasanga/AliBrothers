import { getDb } from '../index'
import { findOrCreateCustomer } from './customerRepository'
import type { DateRangeFilter, Sale, SaleInput } from '../../../../shared/types'

const SALE_SELECT = `
  SELECT s.id, s.sale_date as saleDate, s.customer_id as customerId, c.name as customerName,
         c.phone as customerPhone, s.vehicle_number as vehicleNumber, s.roll_count as rollCount,
         s.notes, s.created_at as createdAt, s.updated_at as updatedAt
  FROM sales s
  JOIN customers c ON c.id = s.customer_id
`

function getSaleById(id: number): Sale {
  const db = getDb()
  return db.prepare(`${SALE_SELECT} WHERE s.id = ?`).get(id) as Sale
}

export function listSales(filters?: DateRangeFilter): Sale[] {
  const db = getDb()
  let query = `${SALE_SELECT} WHERE s.deleted_at IS NULL`
  const params: string[] = []
  if (filters?.dateFrom) {
    query += ' AND s.sale_date >= ?'
    params.push(filters.dateFrom)
  }
  if (filters?.dateTo) {
    query += ' AND s.sale_date <= ?'
    params.push(filters.dateTo)
  }
  query += ' ORDER BY s.sale_date DESC, s.id DESC'
  return db.prepare(query).all(...params) as Sale[]
}

export function createSale(input: SaleInput): Sale {
  const db = getDb()
  const insert = db.transaction(() => {
    const customerId = input.customerId ?? findOrCreateCustomer(db, input.customerName, input.customerPhone)
    const result = db
      .prepare(
        `INSERT INTO sales (sale_date, customer_id, vehicle_number, roll_count, notes)
         VALUES (?, ?, ?, ?, ?)`
      )
      .run(input.saleDate, customerId, input.vehicleNumber ?? null, input.rollCount, input.notes ?? null)
    const id = result.lastInsertRowid as number
    db.prepare(
      `INSERT INTO stock_ledger (entry_date, entry_type, quantity, reference_table, reference_id)
       VALUES (?, 'SALE', ?, 'sales', ?)`
    ).run(input.saleDate, -input.rollCount, id)
    return id
  })
  return getSaleById(insert())
}

export function updateSale(id: number, input: SaleInput): Sale {
  const db = getDb()
  const update = db.transaction(() => {
    const customerId = input.customerId ?? findOrCreateCustomer(db, input.customerName, input.customerPhone)
    db.prepare(
      `UPDATE sales SET sale_date = ?, customer_id = ?, vehicle_number = ?, roll_count = ?, notes = ?,
              updated_at = datetime('now')
       WHERE id = ?`
    ).run(input.saleDate, customerId, input.vehicleNumber ?? null, input.rollCount, input.notes ?? null, id)
    db.prepare(
      `UPDATE stock_ledger SET entry_date = ?, quantity = ?
       WHERE reference_table = 'sales' AND reference_id = ?`
    ).run(input.saleDate, -input.rollCount, id)
  })
  update()
  return getSaleById(id)
}

export function deleteSale(id: number): void {
  const db = getDb()
  const del = db.transaction(() => {
    db.prepare(`UPDATE sales SET deleted_at = datetime('now') WHERE id = ?`).run(id)
    db.prepare(`DELETE FROM stock_ledger WHERE reference_table = 'sales' AND reference_id = ?`).run(id)
  })
  del()
}