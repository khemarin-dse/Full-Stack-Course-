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

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U'

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F8FB]">
      {/* Sidebar */}
      <aside className="w-[220px] bg-white border-r border-[#E4E2F0] flex flex-col px-3 py-5 flex-shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-2 px-2 mb-6">
          <i className="ti ti-wallet text-[22px] text-primary"></i>
          <span className="text-[17px] font-semibold text-[#1A1730]">FinTrack</span>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
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

        {/* Settings */}
        <NavLink
          to="/settings"
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

        {/* User row */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] border border-[#E4E2F0] hover:bg-[#F0EFF8] transition-all w-full text-left"
        >
          <div className="w-8 h-8 rounded-full bg-[#AFA9EC] flex items-center justify-content-center text-[12px] font-semibold text-[#3C3489] flex-shrink-0 flex items-center justify-center">
            {initials}
          </div>
          <div>
            <div className="text-[12px] font-medium text-[#1A1730] truncate max-w-[120px]">{user?.name}</div>
            <div className="text-[11px] text-[#6B6882]">Sign out</div>
          </div>
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto p-7">
        <Outlet />
      </main>
    </div>
  )
}
