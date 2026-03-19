import { NavLink } from 'react-router-dom'

export default function TopNav() {
  return (
    <header className="dj-topnav">
      <NavLink to="/" className="dj-brand">
        Decision Journal
      </NavLink>

      <nav className="dj-nav" aria-label="Primary">
        <NavLink to="/" end>
          Dashboard
        </NavLink>
        <NavLink to="/add">Add Decision</NavLink>
      </nav>
    </header>
  )
}

