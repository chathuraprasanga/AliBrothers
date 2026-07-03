import { useEffect, useState } from 'react'
import { Group, Stack, Table, Text, Title } from '@mantine/core'
import { DateRangeFilter } from '../../components/common/DateRangeFilter'
import { PrintExportBar } from './components/PrintExportBar'
import { api, defaultDateRange } from '../../lib/api'
import type {
  CustomerSalesReportResult,
  DateRangeFilter as DateRangeFilterValue
} from '../../../../../shared/types'

export function CustomerSalesReport(): React.JSX.Element {
  const [filters, setFilters] = useState<DateRangeFilterValue>(defaultDateRange())
  const [result, setResult] = useState<CustomerSalesReportResult | null>(null)

  useEffect(() => {
    api.reports.customerSales(filters).then(setResult)
  }, [filters.dateFrom, filters.dateTo])

  return (
    <Stack className="print-report">
      <Group justify="space-between" className="no-print">
        <Title order={2}>Customer-wise Sales Report</Title>
      </Group>
      <Title order={4} className="print-only">
        AliBrothers — Customer-wise Sales Report ({filters.dateFrom} to {filters.dateTo})
      </Title>

      <DateRangeFilter value={filters} onChange={setFilters} />
      <PrintExportBar />

      {result && (
        <>
          <Table striped>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Customer</Table.Th>
                <Table.Th>Phone</Table.Th>
                <Table.Th>Transactions</Table.Th>
                <Table.Th>Total rolls</Table.Th>
                <Table.Th>Last sale</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {result.rows.map((row) => (
                <Table.Tr key={row.customerId}>
                  <Table.Td>{row.customerName}</Table.Td>
                  <Table.Td>{row.customerPhone}</Table.Td>
                  <Table.Td>{row.transactionCount}</Table.Td>
                  <Table.Td>{row.totalRolls}</Table.Td>
                  <Table.Td>{row.lastSaleDate}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
          <Text fw={600}>
            Grand total: {result.grandTotalRolls} rolls across {result.customerCount} customers
          </Text>
        </>
      )}
    </Stack>
  )
}