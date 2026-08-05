import { useState } from 'react'
import Modal from '../ui/Modal'
import { Btn } from '../ui/index'
import { useToast } from '../../context/ToastContext'
import api from '../../utils/api'

export default function ForgotPasswordModal({ open, onClose }) {
  const { toast } = useToast()
  const [step, setStep] = useState('email') // 'email' | 'reset' | 'done'
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showConfirmPw, setShowConfirmPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const reset = () => {
    setStep('email'); setEmail(''); setCode(''); setPassword(''); setConfirm(''); setError('')
  }

  const close = () => { reset(); onClose() }

  const handleSendCode = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/forgot-password', { email })
      setStep('reset')
      toast('If that email exists, a reset code has been sent.')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Passwords do not match.'); return }
    setLoading(true)
    try {
      await api.post('/reset-password', {
        email, code, password, password_confirmation: confirm,
      })
      setStep('done')
    } catch (err) {
      setError(err.response?.data?.errors?.code?.[0] || err.response?.data?.message || 'That code is invalid or has expired.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={close} title="Reset your password" width="400px">
      {step === 'email' && (
        <form onSubmit={handleSendCode} className="flex flex-col gap-4">
          <p className="text-[13px] text-[#6B6882]">
            Enter your account email — we'll send a 6-digit code you can use to set a new password.
          </p>
          {error && (
            <div className="bg-[#FAECE7] border border-[#F0997B] text-[#712B13] text-[12px] rounded-[8px] px-3 py-2">
              {error}
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-[#6B6882]">Email address</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@email.com" className="h-10 w-full" />
          </div>
          <Btn type="submit" disabled={loading} className="w-full justify-center py-2.5">
            {loading ? 'Sending...' : 'Send reset code'}
          </Btn>
        </form>
      )}

      {step === 'reset' && (
        <form onSubmit={handleReset} className="flex flex-col gap-4">
          <div className="bg-[#EEEDFE] rounded-[10px] p-3 text-[12px] text-[#3C3489]">
            Demo mode: there's no real mail server hooked up, so instead of emailing the code
            it's written to <code className="font-mono">backend/storage/logs/laravel.log</code> — open
            that file and copy the latest 6-digit code for <strong>{email}</strong> in here.
          </div>
          {error && (
            <div className="bg-[#FAECE7] border border-[#F0997B] text-[#712B13] text-[12px] rounded-[8px] px-3 py-2">
              {error}
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-[#6B6882]">6-digit code</label>
            <input type="text" required value={code} onChange={e => setCode(e.target.value)}
              maxLength={6} placeholder="123456" className="h-10 w-full tracking-[4px] text-center font-semibold" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-[#6B6882]">New password</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                placeholder="At least 6 characters" className="h-10 w-full pr-10" />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6882] hover:text-primary transition-colors">
                {showPw ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-[#6B6882]">Confirm new password</label>
            <div className="relative">
              <input type={showConfirmPw ? 'text' : 'password'} required value={confirm} onChange={e => setConfirm(e.target.value)}
                placeholder="Re-enter new password" className="h-10 w-full pr-10" />
              <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6882] hover:text-primary transition-colors">
                {showConfirmPw ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <Btn type="submit" disabled={loading} className="w-full justify-center py-2.5">
            {loading ? 'Resetting...' : 'Reset password'}
          </Btn>
          <button type="button" onClick={() => { setStep('email'); setError('') }}
            className="text-[12px] text-primary hover:underline text-center">
            Use a different email
          </button>
        </form>
      )}

      {step === 'done' && (
        <div className="flex flex-col items-center text-center gap-3 py-2">
          <div className="w-12 h-12 rounded-full bg-[#E1F5EE] flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0F6E56" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h3 className="text-[15px] font-semibold">Password reset!</h3>
          <p className="text-[13px] text-[#6B6882]">You can now sign in with your new password.</p>
          <Btn onClick={close} className="w-full justify-center py-2.5 mt-2">Done</Btn>
        </div>
      )}
    </Modal>
  )
}
