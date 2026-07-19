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