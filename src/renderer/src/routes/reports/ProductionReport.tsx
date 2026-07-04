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
  ProductionReportResult
} from '../../../../../shared/types'

export function ProductionReport(): React.JSX.Element {
  const [filters, setFilters] = useState<DateRangeFilterValue>(defaultDateRange())
  const [result, setResult] = useState<ProductionReportResult | null>(null)

  useEffect(() => {
    api.reports.production(filters).then(setResult)
  }, [filters.dateFrom, filters.dateTo])

  const reportTitle = `Production Report (${filters.dateFrom} to ${filters.dateTo})`
  useDocumentTitle(`AliBrothers - ${reportTitle}`)

  return (
    <Stack className="print-report">
      <Group justify="space-between" className="no-print">
        <Title order={2}>Production Report</Title>
        <BackToReports />
      </Group>
      <PrintHeader title={reportTitle} />

      <DateRangeFilter value={filters} onChange={setFilters} />
      <PrintExportBar />

      {result && (
        <>
          <Table striped>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Date</Table.Th>
                <Table.Th>Roll count</Table.Th>
                <Table.Th>Notes</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {result.rows.map((row, index) => (
                <Table.Tr key={index}>
                  <Table.Td>{dash(row.entryDate)}</Table.Td>
                  <Table.Td>{dash(row.rollCount)}</Table.Td>
                  <Table.Td>{dash(row.notes)}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
          <Text fw={600}>
            Total: {result.totalRolls} rolls across {result.entryCount} entries
          </Text>
        </>
      )}
    </Stack>
  )
}
