import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Btn } from '../components/ui/index'

export default function RegisterPage() {
  const { register, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' })
  const [error, setError] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showPwConfirm, setShowPwConfirm] = useState(false)

  const getPasswordStrength = (pw) => {
    if (!pw) return null
    let score = 0
    if (pw.length >= 6) score++
    if (pw.length >= 10) score++
    if (/[A-Z]/.test(pw)) score++
    if (/[0-9]/.test(pw)) score++
    if (/[^A-Za-z0-9]/.test(pw)) score++
    if (score <= 1) return { label: 'Weak', color: '#993C1D', bg: '#FAECE7', width: '20%' }
    if (score <= 2) return { label: 'Fair', color: '#854F0B', bg: '#FAEEDA', width: '40%' }
    if (score <= 3) return { label: 'Good', color: '#534AB7', bg: '#EEEDFE', width: '65%' }
    if (score <= 4) return { label: 'Strong', color: '#0F6E56', bg: '#E1F5EE', width: '85%' }
    return { label: 'Very strong', color: '#0F6E56', bg: '#E1F5EE', width: '100%' }
  }

  const strength = getPasswordStrength(form.password)

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
          <img src="/logo.png" alt="FinTrack" className="w-[28px] h-[28px] object-contain" />
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
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} required value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="At least 6 characters" className="h-10 w-full pr-10" />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6882] hover:text-primary transition-colors">
                {showPw ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                )}
              </button>
            </div>
            {/* Password strength indicator */}
            {strength && (
              <div className="mt-1">
                <div className="h-1.5 bg-[#F0EFF8] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-300"
                    style={{ width: strength.width, background: strength.color }}></div>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-[11px]" style={{ color: strength.color }}>{strength.label} password</span>
                  {strength.label === 'Weak' || strength.label === 'Fair' ? (
                    <span className="text-[10px] text-[#6B6882]">Add uppercase, numbers & symbols</span>
                  ) : null}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-[#6B6882]">Confirm password</label>
            <div className="relative">
              <input type={showPwConfirm ? 'text' : 'password'} required value={form.password_confirmation}
                onChange={e => setForm({ ...form, password_confirmation: e.target.value })}
                placeholder="Repeat password" className="h-10 w-full pr-10" />
              <button type="button" onClick={() => setShowPwConfirm(!showPwConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6882] hover:text-primary transition-colors">
                {showPwConfirm ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                )}
              </button>
            </div>
            {form.password_confirmation && form.password !== form.password_confirmation && (
              <span className="text-[11px] text-[#993C1D]">Passwords do not match</span>
            )}
            {form.password_confirmation && form.password === form.password_confirmation && (
              <span className="text-[11px] text-[#0F6E56] flex items-center gap-1">
                <i className="ti ti-check"></i> Passwords match
              </span>
            )}
          </div>

          <Btn type="submit" disabled={loading} className="w-full justify-center py-2.5 mt-1">
            {loading ? 'Creating...' : 'Create account'}
          </Btn>
        </form>

        <p className="text-[13px] text-[#6B6882] text-center mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
