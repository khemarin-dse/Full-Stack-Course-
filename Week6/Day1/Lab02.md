# Lab2: ReactJS – Login, Register, Protected Dashboard
## Updated Project Structure
```
my-react-app/
|── src/
|   |── assets/
|   |── components/
|   |   |── Footer.jsx
|   |   |── Navbar.jsx
|   |   |── DashboardHeader.jsx
|   |   |── Sidebar.jsx
|   |   |── StatCard.jsx
|   |   |── ProfileCard.jsx
|   |   |── ActivityList.jsx
|   |
|   |── pages/
|   |   |── HomePage.jsx
|   |   |── LoginPage.jsx
|   |   |── RegisterPage.jsx
|   |   |── DashboardPage.jsx
|   |
|   |── App.jsx
|   |── main.jsx
```

## Lab Logic
### 1 Update src/components/Navbar.jsx

```
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

```

### 2. Update src/pages/RegisterPage.jsx

```
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Save user information
    localStorage.setItem("user", JSON.stringify(formData));

    // Automatically log in the user
    localStorage.setItem("isLoggedIn", "true");

    alert("Registration successful!");

    // Redirect to Dashboard
    navigate("/dashboard");

    // Refresh so Navbar/Layout updates
    window.location.reload();
  }

  return (
    <section className="flex-1 flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-300 p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Create Account
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-2.5 text-white font-semibold
                       hover:bg-blue-700 transition duration-200"
          >
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}

```

### 3. Update src/pages/LoginPage.jsx
```
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (
      savedUser &&
      savedUser.email === formData.email &&
      savedUser.password === formData.password
    ) {
      localStorage.setItem("isLoggedIn", "true");
      alert("Login successful!");
      navigate("/dashboard");
      window.location.reload();
    } else {
      alert("Invalid email or password");
    }
  }

  return (
    <section className="flex-1 flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-1">
          Welcome Back
        </h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Login to your account
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm
                         placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm
                         placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-2.5 text-white font-semibold
                       hover:bg-blue-700 active:scale-[0.99]
                       transition-all duration-200"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </section>
  );
}

```
### 4. Create src/pages/DashboardPage.jsx
```
import { useState } from "react";
import DashboardHeader from "../components/DashboardHeader";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import ProfileCard from "../components/ProfileCard";
import ActivityList from "../components/ActivityList";

export default function DashboardPage() {
  const [stats] = useState([
    { title: "Total Users", value: 1200, color: "bg-blue-600" },
    { title: "Orders", value: 340, color: "bg-green-600" },
    { title: "Revenue", value: "$8,500", color: "bg-purple-600" },
    { title: "Messages", value: 89, color: "bg-orange-500" }
  ]);

  const [activities] = useState([
    "New user registered",
    "Order #1001 has been placed",
    "Payment received successfully",
    "Profile information updated"
  ]);

  const savedUser = JSON.parse(localStorage.getItem("user"));

  const user = {
    name: savedUser?.name || "Guest User",
    role: "Student",
    email: savedUser?.email || "No email"
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <Sidebar />

      <div className="flex-1">
        <DashboardHeader />

        <main className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((item, index) => (
              <StatCard
                key={index}
                title={item.title}
                value={item.value}
                color={item.color}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ProfileCard user={user} />
            <ActivityList activities={activities} />
          </div>
        </main>
      </div>
    </div>
  );
}

```
### 5. Create src/components/DashboardHeader.jsx
```
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
```
### 6. Create src/components/Sidebar.jsx
```
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
```
### 7. Create src/components/StatCard.jsx
```
export default function StatCard({ title, value, color }) {
  return (
    <div className={`${color} text-white rounded-2xl p-5`}>
      <h3 className="text-sm font-medium opacity-90">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

```
### 8. Create src/components/ProfileCard.jsx
```
export default function ProfileCard({ user }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:col-span-1">
      <h2 className="text-xl font-bold text-slate-800 mb-4">Profile</h2>

      <div className="space-y-3 text-slate-600">
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Role:</strong> {user.role}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
      </div>
    </div>
  );
}

```
### 9. Create src/components/ActivityList.jsx
```
export default function ActivityList({ activities }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:col-span-2">
      <h2 className="text-xl font-bold text-slate-800 mb-4">Recent Activity</h2>

      <ul className="space-y-3">
        {activities.map((activity, index) => (
          <li
            key={index}
            className="border border-slate-200 rounded-lg px-4 py-3 text-slate-700"
          >
            {activity}
          </li>
        ))}
      </ul>
    </div>
  );
}

```
### 10. Update src/App.jsx
#### Hide Navbar/Footer on Dashboard.
```
import {
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";

function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  return isLoggedIn ? children : <Navigate to="/login" />;
}

function App() {
  const location = useLocation();

  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <div className="flex flex-col min-h-screen">
      {!isDashboard && <Navbar />}

      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {!isDashboard && <Footer />}
    </div>
  );
}

export default App;
```

## Result
#### If user is not logged in:
- cannot access /dashboard
- redirected to /login

#### If user logs in successfully:
- redirected to /dashboard
- can see dashboard