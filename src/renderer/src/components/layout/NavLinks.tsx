import { NavLink, Stack } from '@mantine/core'
import { Link, useLocation } from 'react-router-dom'

const LINKS = [
  { to: '/', label: 'Dashboard' },
  { to: '/production', label: 'Production' },
  { to: '/sales', label: 'Sales' },
  { to: '/customers', label: 'Customers' },
  { to: '/stock', label: 'Stock' },
  { to: '/reports', label: 'Reports' }
]

const BOTTOM_LINKS = [{ to: '/about', label: 'About' }]

export function NavLinks(): React.JSX.Element {
  const location = useLocation()

  const renderLink = (link: { to: string; label: string }): React.JSX.Element => {
    const isActive =
      link.to === '/' ? location.pathname === '/' : location.pathname.startsWith(link.to)
    return (
      <NavLink key={link.to} component={Link} to={link.to} label={link.label} active={isActive} />
    )
  }

  return (
    <Stack h="100%" justify="space-between" gap={0}>
      <div>{LINKS.map(renderLink)}</div>
      <div>{BOTTOM_LINKS.map(renderLink)}</div>
    </Stack>
  )
}
