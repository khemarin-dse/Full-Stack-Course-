import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Btn } from '../components/ui/index'
import ForgotPasswordModal from '../components/modals/ForgotPasswordModal'

export default function LoginPage() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showForgot, setShowForgot] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const res = await login(form.email, form.password)
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

        <h1 className="text-[20px] font-bold text-[#1A1730] mb-1">Welcome back</h1>
        <p className="text-[13px] text-[#6B6882] mb-6">Sign in to your account to continue</p>

        {error && (
          <div className="bg-[#FAECE7] border border-[#F0997B] text-[#712B13] text-[12px] rounded-[8px] px-3 py-2 mb-4 flex items-center gap-2">
            <i className="ti ti-alert-circle"></i> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-[#6B6882]">Email address</label>
            <input type="email" required value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="you@email.com" className="h-10 w-full" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-[#6B6882]">Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                required value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Your password"
                className="h-10 w-full pr-10" />
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
          </div>

          <div className="text-right -mt-2">
            <span onClick={() => setShowForgot(true)}
              className="text-[12px] text-primary cursor-pointer hover:underline">Forgot password?</span>
          </div>

          <Btn type="submit" disabled={loading} className="w-full justify-center py-2.5">
            {loading ? 'Signing in...' : 'Sign in'}
          </Btn>
        </form>

        <p className="text-[13px] text-[#6B6882] text-center mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary font-medium hover:underline">Sign up</Link>
        </p>
      </div>

      <ForgotPasswordModal open={showForgot} onClose={() => setShowForgot(false)} />
    </div>
  )
}
