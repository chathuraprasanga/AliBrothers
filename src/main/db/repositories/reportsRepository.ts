import { getDb } from '../index'
import type {
  CustomerSalesReportResult,
  DateRangeFilter,
  ProductionReportResult,
  SalesReportFilter,
  SalesReportResult,
  StockLedgerRow,
  StockReportResult
} from '../../../../shared/types'

export function getProductionReport(filters: DateRangeFilter): ProductionReportResult {
  const db = getDb()
  const rows = db
    .prepare(
      `SELECT entry_date as entryDate, roll_count as rollCount, notes
       FROM production_entries
       WHERE deleted_at IS NULL AND entry_date BETWEEN ? AND ?
       ORDER BY entry_date`
    )
    .all(filters.dateFrom, filters.dateTo) as ProductionReportResult['rows']

  const totalRolls = rows.reduce((sum, row) => sum + row.rollCount, 0)
  return { rows, totalRolls, entryCount: rows.length }
}

export function getStockReport(filters: DateRangeFilter): StockReportResult {
  const db = getDb()

  const openingRow = db
    .prepare(`SELECT COALESCE(SUM(quantity), 0) as opening FROM stock_ledger WHERE entry_date < ?`)
    .get(filters.dateFrom) as { opening: number }
  const openingBalance = openingRow.opening

  const movementRows = db
    .prepare(
      `SELECT id, entry_date as entryDate, entry_type as entryType, quantity,
              reference_table as referenceTable, reference_id as referenceId
       FROM stock_ledger
       WHERE entry_date BETWEEN ? AND ?
       ORDER BY entry_date, id`
    )
    .all(filters.dateFrom, filters.dateTo) as Omit<StockLedgerRow, 'runningBalance'>[]

  let runningBalance = openingBalance
  const rows: StockLedgerRow[] = movementRows.map((row) => {
    runningBalance += row.quantity
    return { ...row, runningBalance }
  })

  const totalIn = rows.filter((r) => r.quantity > 0).reduce((sum, r) => sum + r.quantity, 0)
  const totalOut = rows.filter((r) => r.quantity < 0).reduce((sum, r) => sum + Math.abs(r.quantity), 0)

  return { openingBalance, rows, totalIn, totalOut, closingBalance: runningBalance }
}

export function getSalesReport(filters: SalesReportFilter): SalesReportResult {
  const db = getDb()
  let query = `
    SELECT s.sale_date as saleDate, c.name as customerName, c.phone as customerPhone,
           s.vehicle_number as vehicleNumber, s.roll_count as rollCount, s.customer_id as customerId
    FROM sales s
    JOIN customers c ON c.id = s.customer_id
    WHERE s.deleted_at IS NULL AND s.sale_date BETWEEN ? AND ?
  `
  const params: (string | number)[] = [filters.dateFrom, filters.dateTo]
  if (filters.customerId) {
    query += ' AND s.customer_id = ?'
    params.push(filters.customerId)
  }
  query += ' ORDER BY s.sale_date'

  const rawRows = db.prepare(query).all(...params) as (SalesReportResult['rows'][number] & {
    customerId: number
  })[]

  const rows = rawRows.map(({ customerId: _customerId, ...rest }) => rest)
  const totalRolls = rows.reduce((sum, row) => sum + row.rollCount, 0)
  const uniqueCustomers = new Set(rawRows.map((row) => row.customerId)).size

  return { rows, totalRolls, transactionCount: rows.length, uniqueCustomers }
}

export function getCustomerSalesReport(filters: DateRangeFilter): CustomerSalesReportResult {
  const db = getDb()
  const rows = db
    .prepare(
      `SELECT c.id as customerId, c.name as customerName, c.phone as customerPhone,
              COUNT(*) as transactionCount, SUM(s.roll_count) as totalRolls, MAX(s.sale_date) as lastSaleDate
       FROM sales s
       JOIN customers c ON c.id = s.customer_id
       WHERE s.deleted_at IS NULL AND s.sale_date BETWEEN ? AND ?
       GROUP BY c.id
       ORDER BY totalRolls DESC`
    )
    .all(filters.dateFrom, filters.dateTo) as CustomerSalesReportResult['rows']

  const grandTotalRolls = rows.reduce((sum, row) => sum + row.totalRolls, 0)
  return { rows, grandTotalRolls, customerCount: rows.length }
}