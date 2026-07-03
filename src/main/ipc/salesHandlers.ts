import { ipcMain } from 'electron'
import { IPC } from '../../../shared/types'
import type { DateRangeFilter, SaleInput } from '../../../shared/types'
import { createSale, deleteSale, listSales, updateSale } from '../db/repositories/salesRepository'

export function registerSalesHandlers(): void {
  ipcMain.handle(IPC.salesList, (_event, filters?: DateRangeFilter) => listSales(filters))

  ipcMain.handle(IPC.salesCreate, (_event, input: SaleInput) => createSale(input))

  ipcMain.handle(IPC.salesUpdate, (_event, id: number, input: SaleInput) => updateSale(id, input))

  ipcMain.handle(IPC.salesDelete, (_event, id: number) => deleteSale(id))
}