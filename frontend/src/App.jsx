import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

export default function App () {
  return (
    <div>
      <nav style={{ padding: '6px 5px', borderBottom: '1px solid #28335a', background: '#0f1734' }}>
        <div className="container" style={{ display: 'flex', gap: 8 }}>
          <NavLink to="/" end className="logo">zone cinema</NavLink>
          <NavLink to="/todos" className={({ isActive }) => isActive ? 'nav-btn active' : 'nav-btn'}>Buy Tickets</NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-btn active' : 'nav-btn'}>Login</NavLink>
          <NavLink to="/book" className={({ isActive }) => isActive ? 'nav-btn active' : 'nav-btn'}>Book Tickets</NavLink>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
