import { ipcMain } from 'electron'
import { IPC } from '../../../shared/types'
import { searchCustomers } from '../db/repositories/customerRepository'

export function registerCustomerHandlers(): void {
  ipcMain.handle(IPC.customersSearch, (_event, query: string) => searchCustomers(query))
}