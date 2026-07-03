import { registerProductionHandlers } from './productionHandlers'
import { registerSalesHandlers } from './salesHandlers'
import { registerCustomerHandlers } from './customerHandlers'
import { registerStockHandlers } from './stockHandlers'
import { registerReportHandlers } from './reportHandlers'

export function registerIpcHandlers(): void {
  registerProductionHandlers()
  registerSalesHandlers()
  registerCustomerHandlers()
  registerStockHandlers()
  registerReportHandlers()
}