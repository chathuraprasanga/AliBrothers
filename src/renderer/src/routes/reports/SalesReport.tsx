import { useEffect, useRef, useState } from 'react'
import { Autocomplete, Button, Group, Stack, Table, Text, Title } from '@mantine/core'
import { DateRangeFilter } from '../../components/common/DateRangeFilter'
import { PrintExportBar } from './components/PrintExportBar'
import { PrintHeader } from './components/PrintHeader'
import { BackToReports } from './components/BackToReports'
import { api, defaultDateRange } from '../../lib/api'
import { dash } from '../../lib/format'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import type {
  Customer,
  DateRangeFilter as DateRangeFilterValue,
  SalesReportResult
} from '../../../../../shared/types'

export function SalesReport(): React.JSX.Element {
  const [filters, setFilters] = useState<DateRangeFilterValue>(defaultDateRange())
  const [customerId, setCustomerId] = useState<number | undefined>(undefined)
  const [customerQuery, setCustomerQuery] = useState('')
  const [options, setOptions] = useState<string[]>([])
  const customersByLabel = useRef(new Map<string, Customer>())
  const [result, setResult] = useState<SalesReportResult | null>(null)

  useEffect(() => {
    api.reports.sales({ ...filters, customerId }).then(setResult)
  }, [filters.dateFrom, filters.dateTo, customerId])

  const searchCustomers = async (query: string): Promise<void> => {
    setCustomerQuery(query)
    if (!query.trim()) {
      setOptions([])
      return
    }
    const results = await api.customers.search(query)
    customersByLabel.current = new Map(
      results.map((c) => [`${c.name}${c.phone ? ` — ${c.phone}` : ''}`, c])
    )
    setOptions([...customersByLabel.current.keys()])
  }

  const handleCustomerInputChange = (label: string): void => {
    const matched = customersByLabel.current.get(label)
    setCustomerQuery(label)
    setCustomerId(matched?.id)
    if (!matched) searchCustomers(label)
  }

  const clearCustomerFilter = (): void => {
    setCustomerQuery('')
    setCustomerId(undefined)
  }

  const reportTitle = customerId
    ? `Sales Report - ${customerQuery} (${filters.dateFrom} to ${filters.dateTo})`
    : `Sales Report (${filters.dateFrom} to ${filters.dateTo})`
  useDocumentTitle(`AliBrothers - ${reportTitle}`)

  return (
    <Stack className="print-report">
      <Group justify="space-between" className="no-print">
        <Title order={2}>Sales Report</Title>
        <BackToReports />
      </Group>
      <PrintHeader title={reportTitle} />

      <Group className="no-print" align="flex-end">
        <DateRangeFilter value={filters} onChange={setFilters} />
        <Autocomplete
          label="Filter by customer"
          placeholder="Search customer"
          data={options}
          value={customerQuery}
          onChange={handleCustomerInputChange}
        />
        {customerId && (
          <Button variant="subtle" onClick={clearCustomerFilter}>
            Clear
          </Button>
        )}
      </Group>
      <PrintExportBar />

      {result && (
        <>
          <Table striped>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Date</Table.Th>
                {!customerId && <Table.Th>Customer</Table.Th>}
                <Table.Th>Phone</Table.Th>
                <Table.Th>Vehicle</Table.Th>
                <Table.Th>Roll count</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {result.rows.map((row, index) => (
                <Table.Tr key={index}>
                  <Table.Td>{dash(row.saleDate)}</Table.Td>
                  {!customerId && <Table.Td>{dash(row.customerName)}</Table.Td>}
                  <Table.Td>{dash(row.customerPhone)}</Table.Td>
                  <Table.Td>{dash(row.vehicleNumber)}</Table.Td>
                  <Table.Td>{dash(row.rollCount)}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
          <Text fw={600}>
            Total: {result.totalRolls} rolls across {result.transactionCount} transactions (
            {result.uniqueCustomers} customers)
          </Text>
        </>
      )}
    </Stack>
  )
}
