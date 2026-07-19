import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const menus = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Analytics", path: "/analytics" },
    { name: "Users", path: "/users" },
    { name: "Settings", path: "/settings" },
  ];

  return (
    <aside className="hidden md:flex md:flex-col w-64 bg-white text-slate-800 min-h-screen p-6">
      <NavLink
        to="/"
        className="text-2xl font-bold mb-8 text-blue-600 hover:text-blue-700"
      >
        MyDashboard
      </NavLink>

      <nav className="space-y-3">
        {menus.map((menu) => (
          <NavLink
            key={menu.name}
            to={menu.path}
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg transition ${
                isActive
                  ? "bg-blue-600 text-white font-semibold"
                  : "hover:bg-slate-200 text-slate-800"
              }`
            }
          >
            {menu.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}