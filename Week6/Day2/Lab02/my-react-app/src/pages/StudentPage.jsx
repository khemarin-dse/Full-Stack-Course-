import { useState } from "react";
import useCrud from "../hooks/useCrud";
import { studentService } from "../services/studentService";

import Table from "../components/Table";
import Modal from "../components/Modal";

export default function StudentPage() {
  const { data = [], loading, create, update, remove } = useCrud(studentService);

  const [form, setForm] = useState({
    studentId: "",
    fullName: "",
    gender: "Male",
    email: "",
    phone: "",
    major: "",
    year: 1,
    status: "Active"
  });

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const studentColumns = [
    { header: "ID", accessor: "studentId" },
    { header: "Name", accessor: "fullName" },
    { header: "Gender", accessor: "gender" },
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "phone" },
    { header: "Major", accessor: "major" },
    { header: "Year", accessor: "year" },
    { 
      header: "Status", 
      accessor: "status",
      render: (item) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          item.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
          {item.status}
        </span>
      )
    },
  ];

  // Helper Function: Generates the next sequential ID (e.g., "ST001", "ST002")
  function generateNextId(currentData) {
    if (!currentData || currentData.length === 0) return "ST001";
    
    // Extract the numbers from all valid studentIds
    const numericIds = currentData
      .map(item => {
        const match = item.studentId?.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
      })
      .filter(id => !isNaN(id));

    const maxId = numericIds.length > 0 ? Math.max(...numericIds) : 0;
    const nextId = maxId + 1;
    
    // Pads number with zeros to ensure standard 3-digit formatting (ST001)
    return `ST${String(nextId).padStart(3, "0")}`;
  }

  function handleChange(e) {
    const value = e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  }

  // Resets form and applies auto-generated ID if we are creating a new record
  function initNewForm() {
    setForm({
      studentId: generateNextId(data), // Auto-generation fallback logic
      fullName: "",
      gender: "Male",
      email: "",
      phone: "",
      major: "",
      year: 1,
      status: "Active"
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editId) {
        await update(editId, form);
      } else {
        await create(form);
      }
      setOpen(false);
      setEditId(null);
    } catch (error) {
      alert(error.message || "An error occurred");
    }
  }

  function handleEdit(item) {
    setForm(item);
    setEditId(item.id);
    setOpen(true);
  }

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 mb-6 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Directory</h1>
          <p className="text-sm text-gray-500">Manage records, information, and academic status.</p>
        </div>
        
        {/* ADD BUTTON */}
        <button
          onClick={() => {
            initNewForm(); // Triggers auto-generation on open
            setEditId(null);
            setOpen(true);
          }}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition duration-200"
        >
          <svg className="w-5 h-5 mr-1.5 -ml-1" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Student
        </button>
      </div>

      {/* TABLE LOADING / CONTENT */}
      <div>
        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-500 shadow-sm">
            Loading student profiles...
          </div>
        ) : (
          <Table 
            columns={studentColumns} 
            data={data} 
            onEdit={handleEdit} 
            onDelete={remove} 
          />
        )}
      </div>

      {/* MODAL (MANAGEMENT FORM) */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="p-2 max-w-lg mx-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-5">
            {editId ? "Update Student Profile" : "Register New Student"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                <input
                  name="studentId"
                  value={form.studentId}
                  onChange={handleChange}
                  placeholder="Auto-generating..."
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none ${
                    editId 
                      ? "bg-gray-50 text-gray-500 border-gray-300 cursor-not-allowed" 
                      : "bg-gray-100 font-semibold text-blue-700 border-blue-200 focus:ring-0"
                  }`}
                  readOnly // Prevents user manual modification while entering new entries
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="e.g., 012345678"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Academic Major</label>
              <input
                name="major"
                value={form.major}
                onChange={handleChange}
                placeholder="Information Technology"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
                <input
                  type="number"
                  name="year"
                  min="1"
                  max="7"
                  value={form.year}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit"
                className={`w-full rounded-lg py-2.5 text-white font-semibold transition duration-200 ${
                  editId ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {editId ? "Save Changes" : "Create Student Account"}
              </button>
            </div>
          </form>
        </div>
      </Modal>

    </div>
  );
}