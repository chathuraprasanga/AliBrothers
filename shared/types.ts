export interface ProductionEntry {
  id: number
  entryDate: string
  rollCount: number
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface ProductionEntryInput {
  entryDate: string
  rollCount: number
  notes?: string | null
}

export interface Customer {
  id: number
  name: string
  phone: string | null
  notes: string | null
}

export interface Sale {
  id: number
  saleDate: string
  customerId: number
  customerName: string
  customerPhone: string | null
  vehicleNumber: string | null
  rollCount: number
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface SaleInput {
  saleDate: string
  customerId?: number
  customerName: string
  customerPhone?: string | null
  vehicleNumber?: string | null
  rollCount: number
  notes?: string | null
}

export type AdjustmentReason = 'DAMAGE' | 'RECOUNT' | 'OTHER'

export interface StockAdjustment {
  id: number
  adjustmentDate: string
  quantityDelta: number
  reason: AdjustmentReason
  notes: string | null
  createdAt: string
}

export interface StockAdjustmentInput {
  adjustmentDate: string
  quantityDelta: number
  reason: AdjustmentReason
  notes?: string | null
}

export type LedgerEntryType = 'PRODUCTION' | 'SALE' | 'ADJUSTMENT'

export interface StockLedgerRow {
  id: number
  entryDate: string
  entryType: LedgerEntryType
  quantity: number
  runningBalance: number
  referenceTable: string
  referenceId: number
}

export interface DateRangeFilter {
  dateFrom: string
  dateTo: string
}

export interface SalesReportFilter extends DateRangeFilter {
  customerId?: number
}

export interface ProductionReportRow {
  entryDate: string
  rollCount: number
  notes: string | null
}

export interface ProductionReportResult {
  rows: ProductionReportRow[]
  totalRolls: number
  entryCount: number
}

export interface StockReportResult {
  openingBalance: number
  rows: StockLedgerRow[]
  totalIn: number
  totalOut: number
  closingBalance: number
}

export interface SalesReportRow {
  saleDate: string
  customerName: string
  customerPhone: string | null
  vehicleNumber: string | null
  rollCount: number
}

export interface SalesReportResult {
  rows: SalesReportRow[]
  totalRolls: number
  transactionCount: number
  uniqueCustomers: number
}

export interface CustomerSalesReportRow {
  customerId: number
  customerName: string
  customerPhone: string | null
  transactionCount: number
  totalRolls: number
  lastSaleDate: string
}

export interface CustomerSalesReportResult {
  rows: CustomerSalesReportRow[]
  grandTotalRolls: number
  customerCount: number
}

export const IPC = {
  productionList: 'production:list',
  productionCreate: 'production:create',
  productionUpdate: 'production:update',
  productionDelete: 'production:delete',

  salesList: 'sales:list',
  salesCreate: 'sales:create',
  salesUpdate: 'sales:update',
  salesDelete: 'sales:delete',
  customersSearch: 'customers:search',

  stockCurrent: 'stock:current',
  stockLedger: 'stock:ledger',
  stockAddAdjustment: 'stock:addAdjustment',

  reportsProduction: 'reports:production',
  reportsStock: 'reports:stock',
  reportsSales: 'reports:sales',
  reportsCustomerSales: 'reports:customerSales'
} as const