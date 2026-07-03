import { useEffect, useState } from 'react'
import { Group, Stack, Table, Text, Title } from '@mantine/core'
import { DateRangeFilter } from '../../components/common/DateRangeFilter'
import { PrintExportBar } from './components/PrintExportBar'
import { api, defaultDateRange } from '../../lib/api'
import type { DateRangeFilter as DateRangeFilterValue, ProductionReportResult } from '../../../../../shared/types'

export function ProductionReport(): React.JSX.Element {
  const [filters, setFilters] = useState<DateRangeFilterValue>(defaultDateRange())
  const [result, setResult] = useState<ProductionReportResult | null>(null)

  useEffect(() => {
    api.reports.production(filters).then(setResult)
  }, [filters.dateFrom, filters.dateTo])

  return (
    <Stack className="print-report">
      <Group justify="space-between" className="no-print">
        <Title order={2}>Production Report</Title>
      </Group>
      <Title order={4} className="print-only">
        AliBrothers — Production Report ({filters.dateFrom} to {filters.dateTo})
      </Title>

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
                  <Table.Td>{row.entryDate}</Table.Td>
                  <Table.Td>{row.rollCount}</Table.Td>
                  <Table.Td>{row.notes}</Table.Td>
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