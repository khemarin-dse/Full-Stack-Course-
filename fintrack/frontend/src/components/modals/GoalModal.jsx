import { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import { Btn } from '../ui/index'
import { useFinance } from '../../context/FinanceContext'
import { useToast } from '../../context/ToastContext'
import { GOAL_TYPES } from '../../utils/categories'

export default function GoalModal({ open, onClose, existing }) {
  const { addGoal, updateGoal } = useFinance()
  const { toast } = useToast()
  const [form, setForm] = useState({ name: '', type: 'Vacation', target_amount: '', saved_amount: '0', deadline: '', note: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (existing) {
      setForm({ name: existing.name, type: existing.type, target_amount: existing.target_amount,
        saved_amount: existing.saved_amount, deadline: existing.deadline?.slice(0, 7) || '', note: existing.note || '' })
    } else {
      setForm({ name: '', type: 'Vacation', target_amount: '', saved_amount: '0', deadline: '', note: '' })
    }
  }, [existing, open])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.target_amount || Number(form.target_amount) <= 0) { toast('Enter a valid target amount', 'error'); return }
    setLoading(true)
    try {
      const payload = { ...form, target_amount: Number(form.target_amount), saved_amount: Number(form.saved_amount || 0) }
      if (existing) await updateGoal(existing.id, payload)
      else await addGoal(payload)
      toast(existing ? 'Goal updated!' : 'Goal added!')
      onClose()
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to save goal', 'error')
    } finally { setLoading(false) }
  }

  return (
    <Modal open={open} onClose={onClose} title={existing ? 'Edit goal' : 'Add goal'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-medium text-[#6B6882]">Goal name</label>
          <input type="text" required placeholder="e.g. Vacation fund"
            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="h-9 w-full" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-medium text-[#6B6882]">Goal type</label>
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="h-9 w-full">
            {GOAL_TYPES.map(g => <option key={g.value}>{g.value}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-[#6B6882]">Target amount ($)</label>
            <input type="number" required min="1" step="0.01" placeholder="0.00"
              value={form.target_amount} onChange={e => setForm({ ...form, target_amount: e.target.value })} className="h-9 w-full" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-[#6B6882]">Already saved ($)</label>
            <input type="number" min="0" step="0.01" placeholder="0.00"
              value={form.saved_amount} onChange={e => setForm({ ...form, saved_amount: e.target.value })} className="h-9 w-full" />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-medium text-[#6B6882]">Target deadline</label>
          <input type="month" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} className="h-9 w-full" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-medium text-[#6B6882]">Notes (optional)</label>
          <textarea placeholder="Why is this goal important to you?"
            value={form.note} onChange={e => setForm({ ...form, note: e.target.value })}
            className="w-full p-3 h-16 text-[13px]" />
        </div>
        <div className="flex gap-2 mt-1">
          <Btn variant="outline" onClick={onClose} className="flex-1 justify-center">Cancel</Btn>
          <Btn type="submit" disabled={loading} className="flex-1 justify-center">
            {loading ? 'Saving...' : 'Save goal'}
          </Btn>
        </div>
      </form>
    </Modal>
  )
}
