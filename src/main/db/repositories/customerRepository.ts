import type Database from 'better-sqlite3'
import { getDb } from '../index'
import type { Customer } from '../../../../shared/types'

export function searchCustomers(query: string): Customer[] {
  const db = getDb()
  const like = `%${query}%`
  return db
    .prepare(
      `SELECT id, name, phone, notes FROM customers WHERE name LIKE ? OR phone LIKE ? ORDER BY name LIMIT 20`
    )
    .all(like, like) as Customer[]
}

/** Reuses an existing customer by phone number when possible, otherwise creates a new one. */
export function findOrCreateCustomer(
  db: Database.Database,
  name: string,
  phone: string | null | undefined
): number {
  if (phone) {
    const existing = db.prepare(`SELECT id FROM customers WHERE phone = ?`).get(phone) as
      | { id: number }
      | undefined
    if (existing) {
      db.prepare(`UPDATE customers SET name = ?, updated_at = datetime('now') WHERE id = ?`).run(
        name,
        existing.id
      )
      return existing.id
    }
  }
  const result = db.prepare(`INSERT INTO customers (name, phone) VALUES (?, ?)`).run(name, phone ?? null)
  return result.lastInsertRowid as number
}
