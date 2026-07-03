import dayjs from 'dayjs'
// @ts-ignore
import {DateRangeFilter} from "../../../../shared/types";

export const api = window.api

export function today(): string {
  return dayjs().format('YYYY-MM-DD')
}

export function defaultDateRange(): DateRangeFilter {
  return { dateFrom: dayjs().startOf('month').format('YYYY-MM-DD'), dateTo: today() }
}
