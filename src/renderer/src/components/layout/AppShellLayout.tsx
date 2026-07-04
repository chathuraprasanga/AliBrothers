import { AppShell, Group } from '@mantine/core'
import { Outlet } from 'react-router-dom'
import { NavLinks } from './NavLinks'
import logo from '../../assets/logo-icon.png'

export function AppShellLayout(): React.JSX.Element {
  return (
    <AppShell header={{ height: 56 }} navbar={{ width: 220, breakpoint: 'sm' }} padding="md">
      <AppShell.Header
        className="no-print"
        style={{ backgroundColor: '#14191b', borderColor: '#14191b' }}
      >
        <Group h="100%" px="md">
          <img src={logo} alt="AliBrothers" style={{ height: 34 }} />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar className="no-print" p="xs">
        <NavLinks />
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}
