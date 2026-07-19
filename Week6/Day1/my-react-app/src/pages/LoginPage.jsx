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