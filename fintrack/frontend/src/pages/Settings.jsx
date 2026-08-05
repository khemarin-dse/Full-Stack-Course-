import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useCurrency } from '../context/CurrencyContext'
import { Btn, Card } from '../components/ui/index'
import ForgotPasswordModal from '../components/modals/ForgotPasswordModal'
import api from '../utils/api'

const CURRENCIES = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'KHR', label: 'KHR (៛)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
]

function Toggle({ on, onToggle }) {
  return (
    <button type="button" onClick={onToggle}
      className="w-10 h-[23px] rounded-full relative flex-shrink-0 transition-all duration-300"
      style={{ background: on ? '#534AB7' : '#E4E2F0' }}>
      <div className="w-[19px] h-[19px] rounded-full bg-white absolute top-0.5 transition-all duration-300 shadow-sm"
        style={{ left: on ? '19px' : '2px' }} />
    </button>
  )
}

function PwField({ label, value, onChange, placeholder, error }) {
  const [show, setShow] = useState(false)
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-medium text-[#6B6882]">{label}</label>
      <div className="relative">
        <input type={show ? 'text' : 'password'} placeholder={placeholder}
          value={value} onChange={onChange}
          className={`h-9 w-full pr-10 ${error ? 'border-[#993C1D]' : ''}`} />
        <button type="button" onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6882] hover:text-primary transition-colors">
          {show ? (
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
      {error && <span className="text-[11px] text-[#993C1D]">{error}</span>}
    </div>
  )
}

export default function Settings() {
  const { user, logout, updateUser } = useAuth()
  const { toast } = useToast()
  const { currency, setCurrency, format } = useCurrency()

  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [pwForm, setPwForm] = useState({ current: '', new: '', confirm: '' })
  const [pwErrors, setPwErrors] = useState({})
  const [notifs, setNotifs] = useState(() => {
    try {
      const saved = localStorage.getItem('notifPrefs')
      return saved ? JSON.parse(saved) : { budget: true, goal: true, monthly: false }
    } catch {
      return { budget: true, goal: true, monthly: false }
    }
  })
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPw, setSavingPw] = useState(false)
  const [dangerAction, setDangerAction] = useState(null)
  const [showForgotPw, setShowForgotPw] = useState(false) // controls the modal now, not an inline banner

  const initials = name.trim().split(' ').map(w => w[0] || '').join('').toUpperCase().slice(0, 2) || 'U'

  const saveProfile = async () => {
    if (!name.trim()) { toast('Name cannot be empty', 'error'); return }
    if (!email.includes('@') || !email.includes('.')) { toast('Enter a valid email', 'error'); return }
    setSavingProfile(true)
    try {
      const res = await api.put('/user/profile', { name, email })
      updateUser(res.data.user)
      toast('Profile updated!')
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to update profile', 'error')
    } finally { setSavingProfile(false) }
  }

  const savePassword = async () => {
    const errors = {}
    if (!pwForm.current) errors.current = 'Enter current password'
    if (pwForm.new.length < 6) errors.new = 'Min 6 characters'
    if (pwForm.new !== pwForm.confirm) errors.confirm = 'Passwords do not match'
    setPwErrors(errors)
    if (Object.keys(errors).length > 0) return
    setSavingPw(true)
    try {
      await api.put('/user/password', {
        current_password: pwForm.current,
        password: pwForm.new,
        password_confirmation: pwForm.confirm
      })
      setPwForm({ current: '', new: '', confirm: '' })
      setPwErrors({})
      toast('Password updated!')
    } catch (err) {
      const serverErrors = err.response?.data?.errors
      if (serverErrors?.current_password) {
        setPwErrors({ current: serverErrors.current_password[0] })
      } else {
        toast(err.response?.data?.message || 'Failed to update password', 'error')
      }
    } finally { setSavingPw(false) }
  }

  const handleDanger = async () => {
    try {
      if (dangerAction === 'clear') { await api.delete('/user/data'); toast('All data cleared!', 'warning') }
      else { await api.delete('/user/account'); toast('Account deleted.', 'error'); await logout() }
    } catch { toast('Action failed', 'error') }
    setDangerAction(null)
  }

  return (
    <div className="flex flex-col gap-4 lg:gap-5">
      <div>
        <h1 className="text-[18px] lg:text-[20px] font-semibold">Settings</h1>
        <p className="text-[12px] lg:text-[13px] text-[#6B6882] mt-0.5">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* LEFT */}
        <div className="flex flex-col gap-4">

          {/* Profile */}
          <Card className="p-4 lg:p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-[6px] bg-[#EEEDFE] flex items-center justify-center">
                <i className="ti ti-user-circle text-[14px] text-primary"></i>
              </div>
              <span className="text-[14px] font-semibold">Profile</span>
            </div>
            <div className="flex items-center gap-3 bg-[#F8F8FB] rounded-[10px] p-3">
              <div className="w-11 h-11 rounded-full bg-[#AFA9EC] flex items-center justify-center text-[16px] font-semibold text-[#3C3489] flex-shrink-0">
                {initials}
              </div>
              <div>
                <div className="font-semibold text-[13px]">{name || user?.name}</div>
                <div className="text-[11px] text-[#6B6882]">{email || user?.email}</div>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-[#6B6882]">Full name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="h-9 w-full" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-[#6B6882]">Email address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="h-9 w-full" />
            </div>
            <Btn className="w-full justify-center" onClick={saveProfile} disabled={savingProfile}>
              {savingProfile ? 'Saving...' : 'Save profile'}
            </Btn>
          </Card>

          {/* Change Password */}
          <Card className="p-4 lg:p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-[6px] bg-[#EEEDFE] flex items-center justify-center">
                <i className="ti ti-lock text-[14px] text-primary"></i>
              </div>
              <span className="text-[14px] font-semibold">Change password</span>
            </div>

            <PwField label="Current password" placeholder="Enter current password"
              value={pwForm.current} onChange={e => setPwForm({ ...pwForm, current: e.target.value })}
              error={pwErrors.current} />
            <PwField label="New password" placeholder="At least 6 characters"
              value={pwForm.new} onChange={e => setPwForm({ ...pwForm, new: e.target.value })}
              error={pwErrors.new} />
            <PwField label="Confirm new password" placeholder="Re-enter new password"
              value={pwForm.confirm} onChange={e => setPwForm({ ...pwForm, confirm: e.target.value })}
              error={pwErrors.confirm} />

            <div className="text-right -mt-2">
              <button onClick={() => setShowForgotPw(true)}
                className="text-[12px] text-primary hover:underline transition-all">
                Forgot password?
              </button>
            </div>

            <Btn className="w-full justify-center" onClick={savePassword} disabled={savingPw}>
              {savingPw ? 'Updating...' : 'Update password'}
            </Btn>
          </Card>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-4">

          {/* Preferences */}
          <Card className="p-4 lg:p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-[6px] bg-[#E1F5EE] flex items-center justify-center">
                <i className="ti ti-adjustments text-[14px] text-[#0F6E56]"></i>
              </div>
              <span className="text-[14px] font-semibold">Preferences</span>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <div className="text-[13px]">Currency</div>
                <div className="text-[11px] text-[#6B6882]">Applied across the whole app</div>
              </div>
              <select value={currency}
                onChange={e => { setCurrency(e.target.value); toast(`Currency changed to ${e.target.value}!`) }}
                className="h-8 text-[12px] w-[110px] px-2">
                {CURRENCIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>

            {/* Live preview */}
            <div className="bg-[#F8F8FB] rounded-[10px] p-3">
              <div className="text-[11px] text-[#6B6882] mb-2">Live preview — all pages will show:</div>
              <div className="grid grid-cols-3 gap-2">
                {[['Income', 4200, '#0F6E56'], ['Expenses', 2850, '#993C1D'], ['Savings', 1350, '#1A1730']].map(([lbl, amt, col]) => (
                  <div key={lbl} className="bg-white border border-[#E4E2F0] rounded-[8px] p-2">
                    <div className="text-[10px] text-[#6B6882]">{lbl}</div>
                    <div className="text-[13px] font-semibold" style={{ color: col }}>{format(amt)}</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Notifications */}
          <Card className="p-4 lg:p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-[6px] bg-[#FAEEDA] flex items-center justify-center">
                <i className="ti ti-bell text-[14px] text-[#854F0B]"></i>
              </div>
              <span className="text-[14px] font-semibold">Notifications</span>
            </div>

            {[
              { key: 'budget', label: 'Budget warnings', sub: 'Alert when 80% of budget used' },
              { key: 'goal', label: 'Goal milestones', sub: 'Alert at 50% and 100% of goal' },
              { key: 'monthly', label: 'Monthly summary', sub: 'Report at end of each month' },
            ].map((item, i) => (
              <div key={item.key}>
                {i > 0 && <hr className="border-[#E4E2F0]" />}
                <div className={`flex justify-between items-center ${i > 0 ? 'pt-3' : ''}`}>
                  <div>
                    <div className="text-[13px]">{item.label}</div>
                    <div className="text-[11px] text-[#6B6882]">{item.sub}</div>
                  </div>
                  <Toggle on={notifs[item.key]}
                    onToggle={() => {
                      setNotifs(n => {
                        const updated = { ...n, [item.key]: !n[item.key] }
                        localStorage.setItem('notifPrefs', JSON.stringify(updated))
                        return updated
                      })
                      toast(`${item.label} ${!notifs[item.key] ? 'enabled' : 'disabled'}!`, !notifs[item.key] ? 'success' : 'warning')
                    }} />
                </div>
              </div>
            ))}
          </Card>

          {/* Danger zone */}
          <Card className="p-4 lg:p-5 flex flex-col gap-4 border-[#993C1D]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-[6px] bg-[#FAECE7] flex items-center justify-center">
                <i className="ti ti-alert-triangle text-[14px] text-[#993C1D]"></i>
              </div>
              <span className="text-[14px] font-semibold text-[#993C1D]">Danger zone</span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-[13px]">Clear all data</div>
                <div className="text-[11px] text-[#6B6882]">Delete all transactions &amp; goals</div>
              </div>
              <Btn variant="danger-outline" size="sm" onClick={() => setDangerAction('clear')}>Clear</Btn>
            </div>
            <hr className="border-[#FAECE7]" />
            <div className="flex justify-between items-center">
              <div>
                <div className="text-[13px]">Delete account</div>
                <div className="text-[11px] text-[#6B6882]">Permanently remove account</div>
              </div>
              <Btn variant="danger" size="sm" onClick={() => setDangerAction('delete')}>Delete</Btn>
            </div>
            {dangerAction && (
              <div className="bg-[#FAECE7] rounded-[10px] p-3 fade-up">
                <p className="text-[12px] text-[#712B13] font-medium mb-3">
                  {dangerAction === 'delete'
                    ? '⚠ Delete your account? All data will be lost permanently.'
                    : '⚠ Clear all transactions and goals? This cannot be undone.'}
                </p>
                <div className="flex gap-2">
                  <Btn variant="outline" size="sm" className="flex-1 justify-center" onClick={() => setDangerAction(null)}>Cancel</Btn>
                  <Btn variant="danger" size="sm" className="flex-1 justify-center" onClick={handleDanger}>Yes, confirm</Btn>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      <ForgotPasswordModal open={showForgotPw} onClose={() => setShowForgotPw(false)} />
    </div>
  )
}
