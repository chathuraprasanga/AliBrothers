import { Button, Group } from '@mantine/core'

export function PrintExportBar(): React.JSX.Element {
  return (
    <Group className="no-print">
      <Button onClick={() => window.print()}>Print / Save as PDF</Button>
    </Group>
  )
}