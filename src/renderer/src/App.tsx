import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { theme } from './theme'
import { AppShellLayout } from './components/layout/AppShellLayout'
import { Dashboard } from './routes/Dashboard'
import { ProductionEntry } from './routes/ProductionEntry'
import { SalesEntry } from './routes/SalesEntry'
import { Customers } from './routes/Customers'
import { CustomerDetail } from './routes/CustomerDetail'
import { StockView } from './routes/StockView'
import { ReportsHome } from './routes/reports/ReportsHome'
import { ProductionReport } from './routes/reports/ProductionReport'
import { StockReport } from './routes/reports/StockReport'
import { SalesReport } from './routes/reports/SalesReport'
import { About } from './routes/About'

import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/notifications/styles.css'
import './print/print.css'

function App(): React.JSX.Element {
  return (
    <MantineProvider theme={theme}>
      <Notifications />
      <HashRouter>
        <Routes>
          <Route element={<AppShellLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/production" element={<ProductionEntry />} />
            <Route path="/sales" element={<SalesEntry />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/:id" element={<CustomerDetail />} />
            <Route path="/stock" element={<StockView />} />
            <Route path="/reports" element={<ReportsHome />} />
            <Route path="/reports/production" element={<ProductionReport />} />
            <Route path="/reports/stock" element={<StockReport />} />
            <Route path="/reports/sales" element={<SalesReport />} />
            <Route path="/about" element={<About />} />
          </Route>
        </Routes>
      </HashRouter>
    </MantineProvider>
  )
}

export default App
