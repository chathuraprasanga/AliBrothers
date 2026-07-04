import { useMemo, useState } from 'react'

interface PagedList<T> {
  page: number
  pageSize: number
  pageItems: T[]
  total: number
  setPage: (page: number) => void
  setPageSize: (size: number) => void
}

export function usePagedList<T>(items: T[], initialPageSize = 10): PagedList<T> {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSizeState] = useState(initialPageSize)

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  const safePage = Math.min(page, totalPages)

  const pageItems = useMemo(
    () => items.slice((safePage - 1) * pageSize, safePage * pageSize),
    [items, safePage, pageSize]
  )

  const setPageSize = (size: number): void => {
    setPageSizeState(size)
    setPage(1)
  }

  return { page: safePage, pageSize, pageItems, total: items.length, setPage, setPageSize }
}
