import { useNavigate } from "react-router-dom";

export default function DashboardHeader() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("isLoggedIn");

    navigate("/login");

    window.location.reload();
  }

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Dashboard
          </h1>

          <p className="text-sm text-slate-500">
            Welcome to your dashboard
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}