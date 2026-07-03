import { ipcMain } from 'electron'
import { IPC } from '../../../shared/types'
import type { DateRangeFilter, ProductionEntryInput } from '../../../shared/types'
import {
  createProductionEntry,
  deleteProductionEntry,
  listProductionEntries,
  updateProductionEntry
} from '../db/repositories/productionRepository'

export function registerProductionHandlers(): void {
  ipcMain.handle(IPC.productionList, (_event, filters?: DateRangeFilter) => listProductionEntries(filters))

  ipcMain.handle(IPC.productionCreate, (_event, input: ProductionEntryInput) => createProductionEntry(input))

  ipcMain.handle(IPC.productionUpdate, (_event, id: number, input: ProductionEntryInput) =>
    updateProductionEntry(id, input)
  )

  ipcMain.handle(IPC.productionDelete, (_event, id: number) => deleteProductionEntry(id))
}