import { ipcMain } from 'electron'
import { IPC } from '../../../shared/types'
import type { DateRangeFilter, StockAdjustmentInput } from '../../../shared/types'
import { getCurrentStock, getStockLedger } from '../db/repositories/stockRepository'
import { createAdjustment } from '../db/repositories/adjustmentRepository'

export function registerStockHandlers(): void {
  ipcMain.handle(IPC.stockCurrent, () => getCurrentStock())

  ipcMain.handle(IPC.stockLedger, (_event, filters?: DateRangeFilter) => getStockLedger(filters))

  ipcMain.handle(IPC.stockAddAdjustment, (_event, input: StockAdjustmentInput) => createAdjustment(input))
}