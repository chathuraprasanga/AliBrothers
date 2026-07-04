import { Group, Title } from '@mantine/core'
import logo from '../../../assets/logo-icon.png'

interface PrintHeaderProps {
  title: string
}

export function PrintHeader({ title }: PrintHeaderProps): React.JSX.Element {
  return (
    <Group className="print-only" gap="sm" align="center">
      <img src={logo} alt="AliBrothers" style={{ height: 48 }} />
      <Title order={4}>{title}</Title>
    </Group>
  )
}
