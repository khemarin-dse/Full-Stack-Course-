import { useState } from 'react'
import Modal from '../ui/Modal'
import { Btn } from '../ui/index'
import { useFinance } from '../../context/FinanceContext'
import { useToast } from '../../context/ToastContext'
import { getGoalMeta } from '../../utils/categories'

export default function AddMoneyModal({ open, onClose, goal }) {
  const { addMoneyToGoal } = useFinance()
  const { toast } = useToast()
  const [form, setForm] = useState({ amount: '', date: new Date().toISOString().split('T')[0], note: '' })
  const [loading, setLoading] = useState(false)

  if (!goal) return null
  const meta = getGoalMeta(goal.type)
  const pct = Math.round((goal.saved_amount / goal.target_amount) * 100)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.amount || Number(form.amount) <= 0) { toast('Enter a valid amount', 'error'); return }
    setLoading(true)
    try {
      await addMoneyToGoal(goal.id, { amount: Number(form.amount), date: form.date, note: form.note })
      toast('Money added to goal!')
      setForm({ amount: '', date: new Date().toISOString().split('T')[0], note: '' })
      onClose()
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to add money', 'error')
    } finally { setLoading(false) }
  }

  return (
    <Modal open={open} onClose={onClose} title="Add money to goal">
      <div className="bg-[#F0EFF8] rounded-[10px] p-3 flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-[8px] flex items-center justify-center flex-shrink-0" style={{ background: meta.bg }}>
          <i className={`ti ${meta.icon} text-[18px]`} style={{ color: meta.color }}></i>
        </div>
        <div>
          <div className="font-semibold text-[13px]">{goal.name}</div>
          <div className="text-[11px] text-[#6B6882]">${Number(goal.saved_amount).toLocaleString()} saved of ${Number(goal.target_amount).toLocaleString()} · {pct}%</div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-medium text-[#6B6882]">Amount to add ($)</label>
          <input type="number" required min="0.01" step="0.01" placeholder="0.00"
            value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="h-9 w-full" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-medium text-[#6B6882]">Date</label>
          <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="h-9 w-full" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-medium text-[#6B6882]">Note (optional)</label>
          <input type="text" placeholder="e.g. This month's savings"
            value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} className="h-9 w-full" />
        </div>
        <div className="bg-[#E1F5EE] rounded-[10px] p-3 flex items-start gap-2">
          <i className="ti ti-info-circle text-[#0F6E56] flex-shrink-0 mt-0.5"></i>
          <span className="text-[12px] text-[#085041]">This will be recorded in your saving history and goal progress updates instantly.</span>
        </div>
        <div className="flex gap-2 mt-1">
          <Btn variant="outline" onClick={onClose} className="flex-1 justify-center">Cancel</Btn>
          <Btn type="submit" disabled={loading} variant="green" className="flex-1 justify-center">
            {loading ? 'Adding...' : 'Add money'}
          </Btn>
        </div>
      </form>
    </Modal>
  )
}
