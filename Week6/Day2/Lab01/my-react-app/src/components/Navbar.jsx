import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const linkClass =
    "px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100";

  const activeClass =
    "px-3 py-2 rounded-md text-sm font-semibold bg-blue-600 text-white";

  function handleLogout() {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
    window.location.reload();
  }

  return (
    <header className="bg-white shadow">
      <nav className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-bold text-blue-600">
          MyReactApp
        </Link>

        <div className="flex gap-2 items-center">
          <Link
            to="/"
            className={location.pathname === "/" ? activeClass : linkClass}
          >
            Home
          </Link>

          {!isLoggedIn && (
            <>
              <Link
                to="/register"
                className={location.pathname === "/register" ? activeClass : linkClass}
              >
                Register
              </Link>

              <Link
                to="/login"
                className={location.pathname === "/login" ? activeClass : linkClass}
              >
                Login
              </Link>
            </>
          )}

          {isLoggedIn && (
            <>
              <Link
                to="/dashboard"
                className={location.pathname === "/dashboard" ? activeClass : linkClass}
              >
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-md text-sm font-medium bg-red-500 text-white hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
