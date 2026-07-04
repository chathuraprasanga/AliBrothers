import { useEffect } from 'react'

/** Chromium's print/save-as-PDF dialog suggests document.title as the filename,
 * so report pages need a unique title or every export collides on "AliBrothers.pdf". */
export function useDocumentTitle(title: string): void {
  useEffect(() => {
    const previous = document.title
    document.title = title
    return () => {
      document.title = previous
    }
  }, [title])
}
