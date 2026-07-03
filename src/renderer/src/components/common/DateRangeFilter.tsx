import { Group } from '@mantine/core'
import { DateInput } from '@mantine/dates'
import type { DateRangeFilter as DateRangeFilterValue } from '../../../../../shared/types'

interface DateRangeFilterProps {
  value: DateRangeFilterValue
  onChange: (value: DateRangeFilterValue) => void
}

export function DateRangeFilter({ value, onChange }: DateRangeFilterProps): React.JSX.Element {
  return (
    <Group className="no-print">
      <DateInput
        label="From"
        value={value.dateFrom}
        valueFormat="YYYY-MM-DD"
        onChange={(date) => date && onChange({ ...value, dateFrom: date })}
      />
      <DateInput
        label="To"
        value={value.dateTo}
        valueFormat="YYYY-MM-DD"
        onChange={(date) => date && onChange({ ...value, dateTo: date })}
      />
    </Group>
  )
}