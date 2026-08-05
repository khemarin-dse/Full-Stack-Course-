import { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import { Btn } from '../ui/index'
import { useFinance } from '../../context/FinanceContext'
import { useToast } from '../../context/ToastContext'
import { EXPENSE_CATEGORIES } from '../../utils/categories'

export default function BudgetModal({ open, onClose, existing, defaultMonth }) {
  const { addBudget, updateBudget } = useFinance()
  const { toast } = useToast()
  const [form, setForm] = useState({ category: 'Food', limit_amount: '', month: defaultMonth || new Date().toISOString().slice(0, 7) })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (existing) setForm({ category: existing.category, limit_amount: existing.limit_amount, month: existing.month })
    else setForm({ category: 'Food', limit_amount: '', month: defaultMonth || new Date().toISOString().slice(0, 7) })
  }, [existing, open, defaultMonth])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.limit_amount || Number(form.limit_amount) <= 0) { toast('Enter a valid amount', 'error'); return }
    setLoading(true)
    try {
      if (existing) await updateBudget(existing.id, form)
      else await addBudget(form)
      toast(existing ? 'Budget updated!' : 'Budget saved!')
      onClose()
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to save budget', 'error')
    } finally { setLoading(false) }
  }

  return (
    <Modal open={open} onClose={onClose} title={existing ? 'Edit budget' : 'Set budget'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-medium text-[#6B6882]">Category</label>
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="h-9 w-full">
            {EXPENSE_CATEGORIES.map(c => <option key={c.value}>{c.value}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-medium text-[#6B6882]">Monthly budget limit ($)</label>
          <input type="number" required min="1" step="0.01" placeholder="0.00"
            value={form.limit_amount} onChange={e => setForm({ ...form, limit_amount: e.target.value })} className="h-9 w-full" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-medium text-[#6B6882]">Month</label>
          <input type="month" value={form.month} onChange={e => setForm({ ...form, month: e.target.value })} className="h-9 w-full" />
        </div>
        <div className="bg-[#EEEDFE] rounded-[10px] p-3 flex items-start gap-2">
          <i className="ti ti-info-circle text-primary flex-shrink-0 mt-0.5"></i>
          <span className="text-[12px] text-[#3C3489]">You'll receive a warning when you reach 80% of this budget limit.</span>
        </div>
        <div className="flex gap-2 mt-1">
          <Btn variant="outline" onClick={onClose} className="flex-1 justify-center">Cancel</Btn>
          <Btn type="submit" disabled={loading} className="flex-1 justify-center">
            {loading ? 'Saving...' : 'Save budget'}
          </Btn>
        </div>
      </form>
    </Modal>
  )
}
