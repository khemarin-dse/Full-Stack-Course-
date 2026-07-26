import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Btn } from '../components/ui/index'

export default function RegisterPage() {
  const { register, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' })
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.password_confirmation) {
      setError('Passwords do not match'); return
    }
    const res = await register(form.name, form.email, form.password, form.password_confirmation)
    if (res.success) navigate('/')
    else setError(res.message)
  }

  return (
    <div className="min-h-screen bg-[#F0EFF8] flex items-center justify-center p-4">
      <div className="bg-white border border-[#E4E2F0] rounded-[14px] p-8 w-full max-w-[380px] shadow-sm">
        <div className="flex items-center gap-2 justify-center mb-6">
          <i className="ti ti-wallet text-[28px] text-primary"></i>
          <span className="text-[22px] font-bold text-[#1A1730]">FinTrack</span>
        </div>

        <h1 className="text-[20px] font-bold text-[#1A1730] mb-1">Create account</h1>
        <p className="text-[13px] text-[#6B6882] mb-6">Start tracking your finances today</p>

        {error && (
          <div className="bg-[#FAECE7] border border-[#F0997B] text-[#712B13] text-[12px] rounded-[8px] px-3 py-2 mb-4 flex items-center gap-2">
            <i className="ti ti-alert-circle"></i> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-[#6B6882]">Full name</label>
            <input type="text" required value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Your full name" className="h-10 w-full" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-[#6B6882]">Email address</label>
            <input type="email" required value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="you@email.com" className="h-10 w-full" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-[#6B6882]">Password</label>
            <input type="password" required value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="At least 6 characters" className="h-10 w-full" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-[#6B6882]">Confirm password</label>
            <input type="password" required value={form.password_confirmation}
              onChange={e => setForm({ ...form, password_confirmation: e.target.value })}
              placeholder="Repeat password" className="h-10 w-full" />
          </div>
          <Btn type="submit" disabled={loading} className="w-full justify-center py-2.5 mt-1">
            {loading ? 'Creating...' : 'Create account'}
          </Btn>
        </form>

        <p className="text-[13px] text-[#6B6882] text-center mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
