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