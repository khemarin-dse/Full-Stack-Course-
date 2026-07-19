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