import { ipcMain } from 'electron'
import { IPC } from '../../../shared/types'
import type { DateRangeFilter, SalesReportFilter } from '../../../shared/types'
import {
  getProductionReport,
  getSalesReport,
  getStockReport
} from '../db/repositories/reportsRepository'

export function registerReportHandlers(): void {
  ipcMain.handle(IPC.reportsProduction, (_event, filters: DateRangeFilter) =>
    getProductionReport(filters)
  )

  ipcMain.handle(IPC.reportsStock, (_event, filters: DateRangeFilter) => getStockReport(filters))

  ipcMain.handle(IPC.reportsSales, (_event, filters: SalesReportFilter) => getSalesReport(filters))
}
