export default function StatCard({ title, value, color }) {
  return (
    <div className={`${color} text-white rounded-2xl p-5`}>
      <h3 className="text-sm font-medium opacity-90">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}