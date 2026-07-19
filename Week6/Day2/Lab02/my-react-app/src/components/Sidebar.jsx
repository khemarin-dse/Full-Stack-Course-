import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const menus = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Students", path: "/students" }
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-300 p-4">

      <h1 className="text-xl font-bold mb-6 text-blue-600">
        Admin Panel
      </h1>

      <nav className="space-y-2">
        {menus.map((m) => (
          <NavLink
            key={m.path}
            to={m.path}
            className={({ isActive }) =>
              isActive
                ? "block p-2 bg-blue-600 text-white rounded"
                : "block p-2 hover:bg-gray-100 rounded"
            }
          >
            {m.name}
          </NavLink>
        ))}
      </nav>

    </aside>
  );
}