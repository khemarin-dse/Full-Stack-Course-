import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '/', icon: 'ti-layout-dashboard', label: 'Dashboard', end: true },
  { to: '/transactions', icon: 'ti-arrows-exchange', label: 'Transactions' },
  { to: '/budget', icon: 'ti-chart-pie', label: 'Budget' },
  { to: '/goals', icon: 'ti-target', label: 'Goals' },
  { to: '/reports', icon: 'ti-report-analytics', label: 'Reports' },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    setOpen(false)
    await logout()
    navigate('/login')
  }

  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U'

  // Shared nav content, rendered once for the desktop static sidebar
  // and once for the mobile slide-in drawer.
  const NavContent = ({ showClose }) => (
    <>
      <div className="flex items-center justify-between px-2 mb-6">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="FinTrack" className="w-[22px] h-[22px] object-contain" />
          <span className="text-[17px] font-bold" style={{ color: '#1A1730' }}>FinTrack</span>
        </div>
        {showClose && (
          <button
            onClick={() => setOpen(false)}
            className="w-[34px] h-[34px] rounded-[8px] border border-[#E4E2F0] bg-[#F8F8FB] flex items-center justify-center"
            style={{ color: '#1A1730' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map(item => (
          <NavLink key={item.to} to={item.to} end={item.end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] text-[13.5px] transition-all border ${
                isActive
                  ? 'bg-[#EEEDFE] text-primary font-medium border-[#AFA9EC]'
                  : 'text-[#6B6882] border-transparent hover:bg-[#F0EFF8] hover:text-[#1A1730]'
              }`
            }
          >
            <i className={`ti ${item.icon} text-[18px]`}></i>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="flex-1" />

      <NavLink to="/settings" onClick={() => setOpen(false)}
        className={({ isActive }) =>
          `flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] text-[13.5px] transition-all border mb-2 ${
            isActive
              ? 'bg-[#EEEDFE] text-primary font-medium border-[#AFA9EC]'
              : 'text-[#6B6882] border-transparent hover:bg-[#F0EFF8] hover:text-[#1A1730]'
          }`
        }
      >
        <i className="ti ti-settings text-[18px]"></i>
        Settings
      </NavLink>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] border border-[#E4E2F0] hover:bg-[#FAECE7] hover:border-[#993C1D] transition-all w-full text-left group"
      >
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0"
          style={{ background: '#AFA9EC', color: '#3C3489' }}>
          {initials}
        </div>
        <div>
          <div className="text-[12px] font-medium text-[#1A1730] group-hover:text-[#993C1D] truncate max-w-[140px]">
            {user?.name}
          </div>
          <div className="text-[11px] text-[#6B6882] group-hover:text-[#993C1D]">Sign out</div>
        </div>
      </button>
    </>
  )

  return (
    <div className="flex" style={{ height: '100vh', overflow: 'hidden', background: '#F8F8FB' }}>

      {/* ── DESKTOP SIDEBAR — static, always visible, no hamburger ── */}
      <aside className="hidden lg:flex lg:flex-col w-[260px] shrink-0 bg-white border-r border-[#E4E2F0] p-3 gap-1">
        <NavContent showClose={false} />
      </aside>

      {/* ── MOBILE OVERLAY (behind the drawer) ── */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="lg:hidden fixed inset-0 z-40"
          style={{ background: 'rgba(0,0,0,0.5)' }}
        />
      )}

      {/* ── MOBILE DRAWER — slides in from the LEFT ── */}
      <aside
        className="lg:hidden fixed top-0 left-0 bottom-0 w-[260px] z-50 bg-white border-r border-[#E4E2F0] p-3 flex flex-col gap-1"
        style={{
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s ease',
          boxShadow: open ? '4px 0 20px rgba(0,0,0,0.1)' : 'none',
        }}
      >
        <NavContent showClose={true} />
      </aside>

      {/* ── RIGHT COLUMN: top bar + page content ── */}
      <div className="flex flex-col flex-1" style={{ overflow: 'hidden' }}>

        {/* Top bar — hamburger only shows on mobile */}
        <div className="flex items-center justify-between px-5 bg-white border-b border-[#E4E2F0] shrink-0 relative" style={{ height: '56px', zIndex: 10 }}>

          {/* Hamburger — mobile only, opens the right-side drawer */}
          <button
            onClick={() => setOpen(true)}
            className="lg:hidden w-10 h-10 rounded-[8px] flex items-center justify-center flex-shrink-0"
            style={{ background: '#1A1730', border: 'none' }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="2" y="4" width="16" height="2" rx="1" fill="white"/>
              <rect x="2" y="9" width="16" height="2" rx="1" fill="white"/>
              <rect x="2" y="14" width="16" height="2" rx="1" fill="white"/>
            </svg>
          </button>

          {/* Logo — mobile only (desktop already shows it in the sidebar).
              Positioned absolutely so it's centered in the bar regardless
              of the hamburger/avatar widths on either side. */}
          <div className="lg:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
            <img src="/logo.png" alt="FinTrack" className="w-[20px] h-[20px] object-contain" />
            <span className="text-[16px] font-bold" style={{ color: '#1A1730' }}>FinTrack</span>
          </div>

          {/* Avatar → settings, always visible, pushed to the right */}
          <NavLink to="/settings" className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold flex-shrink-0 ml-auto"
            style={{ background: '#AFA9EC', color: '#3C3489', textDecoration: 'none' }}>
            {initials}
          </NavLink>
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto" style={{ padding: '24px 20px' }}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
