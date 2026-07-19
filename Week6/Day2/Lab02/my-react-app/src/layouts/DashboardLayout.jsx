import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex-1">

        <DashboardHeader />

        <div className="p-6">
          {children}
        </div>

      </div>

    </div>
  );
}