import { AppShell, Title } from '@mantine/core'
import { Outlet } from 'react-router-dom'
import { NavLinks } from './NavLinks'

export function AppShellLayout(): React.JSX.Element {
  return (
    <AppShell header={{ height: 56 }} navbar={{ width: 220, breakpoint: 'sm' }} padding="md">
      <AppShell.Header>
        <Title order={3} px="md" py="xs">
          AliBrothers
        </Title>
      </AppShell.Header>
      <AppShell.Navbar p="xs">
        <NavLinks />
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}