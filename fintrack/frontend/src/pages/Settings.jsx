import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { Btn, Card } from '../components/ui/index'
import api from '../utils/api'

const CURRENCIES = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'KHR', label: 'KHR (៛)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
]

const PREVIEWS = {
  USD: ['$4,200', '$2,850', '$1,350'],
  KHR: ['៛17,157,000', '៛11,632,500', '៛5,524,500'],
  EUR: ['€3,864', '€2,622', '€1,242'],
  GBP: ['£3,318', '£2,253', '£1,065'],
}

function Toggle({ on, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-10 h-[23px] rounded-full relative flex-shrink-0 transition-all duration-300"
      style={{ background: on ? '#534AB7' : '#E4E2F0' }}
    >
      <div
        className="w-[19px] h-[19px] rounded-full bg-white absolute top-0.5 transition-all duration-300 shadow-sm"
        style={{ left: on ? '19px' : '2px' }}
      />
    </button>
  )
}

export default function Settings() {
  const { user, logout, updateUser } = useAuth()
  const { toast } = useToast()

  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [pwForm, setPwForm] = useState({ current: '', new: '', confirm: '' })
  const [pwErrors, setPwErrors] = useState({})
  const [currency, setCurrency] = useState('USD')
  const [notifs, setNotifs] = useState({ budget: true, goal: true, monthly: false })
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPw, setSavingPw] = useState(false)
  const [dangerAction, setDangerAction] = useState(null)
  const [theme, setTheme] = useState('light')

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
    if (pwForm.new.length < 6) errors.new = 'Password must be at least 6 characters'
    if (pwForm.new !== pwForm.confirm) errors.confirm = 'Passwords do not match'
    setPwErrors(errors)
    if (Object.keys(errors).length > 0) return
    setSavingPw(true)
    try {
      await api.put('/user/password', { current_password: pwForm.current, password: pwForm.new, password_confirmation: pwForm.confirm })
      setPwForm({ current: '', new: '', confirm: '' })
      setPwErrors({})
      toast('Password updated!', 'success')
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to update password', 'error')
    } finally { setSavingPw(false) }
  }

  const handleDanger = async () => {
    try {
      if (dangerAction === 'clear') {
        await api.delete('/user/data')
        toast('All data cleared!', 'warning')
      } else {
        await api.delete('/user/account')
        toast('Account deleted.', 'error')
        await logout()
      }
    } catch { toast('Action failed', 'error') }
    setDangerAction(null)
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-[20px] font-semibold">Settings</h1>
        <p className="text-[13px] text-[#6B6882] mt-0.5">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-4">

          {/* Profile */}
          <Card className="p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-[6px] bg-[#EEEDFE] flex items-center justify-center">
                <i className="ti ti-user text-[14px] text-primary"></i>
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

          {/* Password */}
          <Card className="p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-[6px] bg-[#EEEDFE] flex items-center justify-center">
                <i className="ti ti-lock text-[14px] text-primary"></i>
              </div>
              <span className="text-[14px] font-semibold">Change password</span>
            </div>

            {[
              { label: 'Current password', key: 'current', placeholder: 'Enter current password' },
              { label: 'New password', key: 'new', placeholder: 'At least 6 characters' },
              { label: 'Confirm new password', key: 'confirm', placeholder: 'Re-enter new password' },
            ].map(f => (
              <div key={f.key} className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-[#6B6882]">{f.label}</label>
                <input type="password" placeholder={f.placeholder}
                  value={pwForm[f.key]} onChange={e => setPwForm({ ...pwForm, [f.key]: e.target.value })}
                  className={`h-9 w-full ${pwErrors[f.key] ? 'border-[#993C1D]' : ''}`} />
                {pwErrors[f.key] && <span className="text-[11px] text-[#993C1D]">{pwErrors[f.key]}</span>}
              </div>
            ))}

            <Btn className="w-full justify-center" onClick={savePassword} disabled={savingPw}>
              {savingPw ? 'Updating...' : 'Update password'}
            </Btn>
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-4">

          {/* Preferences */}
          <Card className="p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-[6px] bg-[#E1F5EE] flex items-center justify-center">
                <i className="ti ti-adjustments text-[14px] text-[#0F6E56]"></i>
              </div>
              <span className="text-[14px] font-semibold">Preferences</span>
            </div>

            {/* Currency */}
            <div className="flex justify-between items-center">
              <div>
                <div className="text-[13px]">Currency</div>
                <div className="text-[11px] text-[#6B6882]">Shown across the whole app</div>
              </div>
              <select value={currency} onChange={e => { setCurrency(e.target.value); toast('Currency updated!') }}
                className="h-8 text-[12px] w-[110px] px-2">
                {CURRENCIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>

            {/* Currency preview */}
            <div className="bg-[#F8F8FB] rounded-[10px] p-3">
              <div className="text-[11px] text-[#6B6882] mb-2">Live preview</div>
              <div className="grid grid-cols-3 gap-2">
                {[['Income', 0, '#0F6E56'], ['Expenses', 1, '#993C1D'], ['Savings', 2, '#1A1730']].map(([lbl, idx, col]) => (
                  <div key={lbl} className="bg-white border border-[#E4E2F0] rounded-[8px] p-2">
                    <div className="text-[10px] text-[#6B6882]">{lbl}</div>
                    <div className="text-[14px] font-semibold" style={{ color: col }}>{PREVIEWS[currency][idx]}</div>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-[#E4E2F0]" />

            {/* Language */}
            <div className="flex justify-between items-center">
              <div>
                <div className="text-[13px]">Language</div>
                <div className="text-[11px] text-[#6B6882]">App display language</div>
              </div>
              <select onChange={() => toast('Language saved!')} className="h-8 text-[12px] w-[110px] px-2">
                <option>English</option>
                <option>Khmer</option>
              </select>
            </div>

            <hr className="border-[#E4E2F0]" />

            {/* Theme */}
            <div className="flex justify-between items-center">
              <div>
                <div className="text-[13px]">Theme</div>
                <div className="text-[11px] text-[#6B6882]">Light or dark mode</div>
              </div>
              <div className="flex border border-[#E4E2F0] rounded-[8px] overflow-hidden text-[12px]">
                {['light', 'dark'].map(t => (
                  <button key={t} type="button" onClick={() => { setTheme(t); toast(`${t.charAt(0).toUpperCase() + t.slice(1)} mode selected!`) }}
                    className={`px-3 py-1.5 transition-all capitalize ${theme === t ? 'bg-primary text-white' : 'text-[#6B6882]'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Notifications */}
          <Card className="p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-1">
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
                  <Toggle
                    on={notifs[item.key]}
                    onToggle={() => {
                      setNotifs(n => ({ ...n, [item.key]: !n[item.key] }))
                      toast(`${item.label} ${!notifs[item.key] ? 'enabled' : 'disabled'}!`, !notifs[item.key] ? 'success' : 'warning')
                    }}
                  />
                </div>
              </div>
            ))}

            <div className="bg-[#F8F8FB] rounded-[10px] p-3">
              <div className="text-[11px] font-medium text-[#6B6882] mb-2">Active notifications</div>
              <div className="flex flex-col gap-1">
                {[
                  { key: 'budget', label: 'Budget warnings' },
                  { key: 'goal', label: 'Goal milestones' },
                  { key: 'monthly', label: 'Monthly summary' },
                ].map(n => (
                  <div key={n.key} className="text-[12px] flex items-center gap-1.5">
                    <span>{notifs[n.key] ? '✅' : '❌'}</span>
                    <span className={notifs[n.key] ? 'text-[#1A1730]' : 'text-[#6B6882]'}>{n.label} — {notifs[n.key] ? 'ON' : 'OFF'}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Danger zone */}
          <Card className="p-5 flex flex-col gap-4 border-[#993C1D]">
            <div className="flex items-center gap-2 mb-1">
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
                <div className="text-[11px] text-[#6B6882]">Permanently remove your account</div>
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
    </div>
  )
}
