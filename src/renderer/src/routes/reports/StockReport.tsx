import { useEffect, useState } from 'react'
import { Group, Stack, Table, Text, Title } from '@mantine/core'
import { DateRangeFilter } from '../../components/common/DateRangeFilter'
import { PrintExportBar } from './components/PrintExportBar'
import { PrintHeader } from './components/PrintHeader'
import { BackToReports } from './components/BackToReports'
import { api, defaultDateRange } from '../../lib/api'
import { dash } from '../../lib/format'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import type {
  DateRangeFilter as DateRangeFilterValue,
  StockReportResult
} from '../../../../../shared/types'

export function StockReport(): React.JSX.Element {
  const [filters, setFilters] = useState<DateRangeFilterValue>(defaultDateRange())
  const [result, setResult] = useState<StockReportResult | null>(null)

  useEffect(() => {
    api.reports.stock(filters).then(setResult)
  }, [filters.dateFrom, filters.dateTo])

  const reportTitle = `Stock Report (${filters.dateFrom} to ${filters.dateTo})`
  useDocumentTitle(`AliBrothers - ${reportTitle}`)

  return (
    <Stack className="print-report">
      <Group justify="space-between" className="no-print">
        <Title order={2}>Stock Report</Title>
        <BackToReports />
      </Group>
      <PrintHeader title={reportTitle} />

      <DateRangeFilter value={filters} onChange={setFilters} />
      <PrintExportBar />

      {result && (
        <>
          <Text>Opening balance: {result.openingBalance}</Text>
          <Table striped>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Date</Table.Th>
                <Table.Th>Type</Table.Th>
                <Table.Th>Quantity</Table.Th>
                <Table.Th>Balance</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {result.rows.map((row) => (
                <Table.Tr key={row.id}>
                  <Table.Td>{dash(row.entryDate)}</Table.Td>
                  <Table.Td>{dash(row.entryType)}</Table.Td>
                  <Table.Td>{row.quantity > 0 ? `+${row.quantity}` : row.quantity}</Table.Td>
                  <Table.Td>{dash(row.runningBalance)}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
          <Text fw={600}>
            Total in: {result.totalIn} · Total out: {result.totalOut} · Closing balance:{' '}
            {result.closingBalance}
          </Text>
        </>
      )}
    </Stack>
  )
}
