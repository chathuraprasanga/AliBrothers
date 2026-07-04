import { ipcMain } from 'electron'
import { IPC } from '../../../shared/types'
import type { CustomerInput } from '../../../shared/types'
import {
  createCustomer,
  deleteCustomer,
  findCustomerByPhone,
  getCustomerById,
  listCustomers,
  searchCustomers,
  updateCustomer
} from '../db/repositories/customerRepository'

export function registerCustomerHandlers(): void {
  ipcMain.handle(IPC.customersSearch, (_event, query: string) => searchCustomers(query))
  ipcMain.handle(IPC.customersFindByPhone, (_event, phone: string) => findCustomerByPhone(phone))
  ipcMain.handle(IPC.customersGetById, (_event, id: number) => getCustomerById(id))
  ipcMain.handle(IPC.customersList, () => listCustomers())
  ipcMain.handle(IPC.customersCreate, (_event, input: CustomerInput) => createCustomer(input))
  ipcMain.handle(IPC.customersUpdate, (_event, id: number, input: CustomerInput) =>
    updateCustomer(id, input)
  )
  ipcMain.handle(IPC.customersDelete, (_event, id: number) => deleteCustomer(id))
}
