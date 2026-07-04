import { getDb } from '../index'
import type { Customer, CustomerInput } from '../../../../shared/types'

const CUSTOMER_SELECT = `SELECT id, name, phone, address, notes FROM customers`

export function getCustomerById(id: number): Customer {
  const db = getDb()
  return db.prepare(`${CUSTOMER_SELECT} WHERE id = ?`).get(id) as Customer
}

export function listCustomers(): Customer[] {
  const db = getDb()
  return db.prepare(`${CUSTOMER_SELECT} ORDER BY name`).all() as Customer[]
}

export function searchCustomers(query: string): Customer[] {
  const db = getDb()
  const like = `%${query}%`
  return db
    .prepare(`${CUSTOMER_SELECT} WHERE name LIKE ? OR phone LIKE ? ORDER BY name LIMIT 20`)
    .all(like, like) as Customer[]
}

export function findCustomerByPhone(phone: string): Customer | undefined {
  const db = getDb()
  return db.prepare(`${CUSTOMER_SELECT} WHERE phone = ?`).get(phone) as Customer | undefined
}

export function createCustomer(input: CustomerInput): Customer {
  const db = getDb()
  const existing = db.prepare(`SELECT id FROM customers WHERE phone = ?`).get(input.phone) as
    { id: number } | undefined
  if (existing) {
    throw new Error('A customer with this phone number already exists')
  }
  const result = db
    .prepare(`INSERT INTO customers (name, phone, address) VALUES (?, ?, ?)`)
    .run(input.name, input.phone, input.address)
  return getCustomerById(result.lastInsertRowid as number)
}

export function updateCustomer(id: number, input: CustomerInput): Customer {
  const db = getDb()
  const existing = db
    .prepare(`SELECT id FROM customers WHERE phone = ? AND id != ?`)
    .get(input.phone, id) as { id: number } | undefined
  if (existing) {
    throw new Error('A customer with this phone number already exists')
  }
  db.prepare(
    `UPDATE customers SET name = ?, phone = ?, address = ?, updated_at = datetime('now') WHERE id = ?`
  ).run(input.name, input.phone, input.address, id)
  return getCustomerById(id)
}

export function deleteCustomer(id: number): void {
  const db = getDb()
  try {
    db.prepare(`DELETE FROM customers WHERE id = ?`).run(id)
  } catch (error) {
    if (error instanceof Error && error.message.includes('FOREIGN KEY constraint failed')) {
      throw new Error('Cannot delete this customer — they have existing sales records')
    }
    throw error
  }
}
