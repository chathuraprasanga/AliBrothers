import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { IPC } from '../../shared/types'
import type {
  CustomerInput,
  DateRangeFilter,
  ProductionEntryInput,
  SaleInput,
  SalesReportFilter,
  StockAdjustmentInput
} from '../../shared/types'

// Custom APIs for renderer
const api = {
  production: {
    list: (filters?: DateRangeFilter) => ipcRenderer.invoke(IPC.productionList, filters),
    create: (input: ProductionEntryInput) => ipcRenderer.invoke(IPC.productionCreate, input),
    update: (id: number, input: ProductionEntryInput) =>
      ipcRenderer.invoke(IPC.productionUpdate, id, input),
    delete: (id: number) => ipcRenderer.invoke(IPC.productionDelete, id)
  },
  sales: {
    list: (filters?: DateRangeFilter) => ipcRenderer.invoke(IPC.salesList, filters),
    create: (input: SaleInput) => ipcRenderer.invoke(IPC.salesCreate, input),
    update: (id: number, input: SaleInput) => ipcRenderer.invoke(IPC.salesUpdate, id, input),
    delete: (id: number) => ipcRenderer.invoke(IPC.salesDelete, id)
  },
  customers: {
    search: (query: string) => ipcRenderer.invoke(IPC.customersSearch, query),
    findByPhone: (phone: string) => ipcRenderer.invoke(IPC.customersFindByPhone, phone),
    get: (id: number) => ipcRenderer.invoke(IPC.customersGetById, id),
    list: () => ipcRenderer.invoke(IPC.customersList),
    create: (input: CustomerInput) => ipcRenderer.invoke(IPC.customersCreate, input),
    update: (id: number, input: CustomerInput) =>
      ipcRenderer.invoke(IPC.customersUpdate, id, input),
    delete: (id: number) => ipcRenderer.invoke(IPC.customersDelete, id)
  },
  stock: {
    current: () => ipcRenderer.invoke(IPC.stockCurrent),
    ledger: (filters?: DateRangeFilter) => ipcRenderer.invoke(IPC.stockLedger, filters),
    addAdjustment: (input: StockAdjustmentInput) =>
      ipcRenderer.invoke(IPC.stockAddAdjustment, input)
  },
  reports: {
    production: (filters: DateRangeFilter) => ipcRenderer.invoke(IPC.reportsProduction, filters),
    stock: (filters: DateRangeFilter) => ipcRenderer.invoke(IPC.reportsStock, filters),
    sales: (filters: SalesReportFilter) => ipcRenderer.invoke(IPC.reportsSales, filters)
  }
}

export type Api = typeof api

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
