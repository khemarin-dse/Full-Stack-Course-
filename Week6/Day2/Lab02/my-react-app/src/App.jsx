import { Routes, Route, Navigate } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";

import ProtectedRoute from "./routes/ProtectedRoute";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import DashboardPage from "./pages/DashboardPage";
import StudentPage from "./pages/StudentsPage";

import AuthProvider from "./context/AuthProvider";

function App() {
  return (
    <AuthProvider>

      <Routes>

        {/* PUBLIC */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <HomePage />
            </PublicLayout>
          }
        />

        <Route
          path="/login"
          element={
            <PublicLayout>
              <LoginPage />
            </PublicLayout>
          }
        />

        <Route
          path="/register"
          element={
            <PublicLayout>
              <RegisterPage />
            </PublicLayout>
          }
        />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <DashboardPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/students"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <StudentPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>

    </AuthProvider>
  );
}

export default App;