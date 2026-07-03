import { NavLink } from '@mantine/core'
import { Link, useLocation } from 'react-router-dom'

const LINKS = [
  { to: '/', label: 'Dashboard' },
  { to: '/production', label: 'Production' },
  { to: '/sales', label: 'Sales' },
  { to: '/stock', label: 'Stock' },
  { to: '/reports', label: 'Reports' }
]

export function NavLinks(): React.JSX.Element {
  const location = useLocation()

  return (
    <>
      {LINKS.map((link) => {
        const isActive =
          link.to === '/' ? location.pathname === '/' : location.pathname.startsWith(link.to)
        return (
          <NavLink key={link.to} component={Link} to={link.to} label={link.label} active={isActive} />
        )
      })}
    </>
  )
}