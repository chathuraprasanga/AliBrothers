import { Button } from '@mantine/core'
import { Link } from 'react-router-dom'

export function BackToReports(): React.JSX.Element {
  return (
    <Button component={Link} to="/reports" variant="subtle">
      ← Back to Reports
    </Button>
  )
}
