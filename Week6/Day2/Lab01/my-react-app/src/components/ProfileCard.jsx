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