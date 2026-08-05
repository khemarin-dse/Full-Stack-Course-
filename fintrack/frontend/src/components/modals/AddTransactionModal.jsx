import { useState } from 'react'
import Modal from '../ui/Modal'
import { Btn } from '../ui/index'
import { useFinance } from '../../context/FinanceContext'
import { useToast } from '../../context/ToastContext'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../utils/categories'

export default function AddTransactionModal({ open, onClose }) {
  const { addTransaction, goals } = useFinance()
  const { toast } = useToast()
  const [type, setType] = useState('expense')
  const [form, setForm] = useState({
    description: '',
    amount: '',
    category: 'Food',
    goal_id: '',
    date: new Date().toISOString().split('T')[0],
    note: ''
  })
  const [loading, setLoading] = useState(false)

  const cats = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES

  const hint = type === 'expense'
    ? `This will be deducted from your <strong>${form.category}</strong> budget and added to your expenses.`
    : form.goal_id
      ? `This will be moved out of your available savings and tracked toward your selected goal. Your income won't change.`
      : `This will be added to your total income.`

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) {
      toast('Enter a valid amount', 'error'); return
    }
    setLoading(true)
    try {
      await addTransaction({
        type,
        description: form.description,
        amount: Number(form.amount),
        category: form.category,
        goal_id: type === 'income' && form.goal_id ? form.goal_id : null,
        date: form.date,
        note: form.note,
      })
      toast(type === 'expense' ? 'Expense added!' : form.goal_id ? 'Added to goal!' : 'Income added!')
      setForm({
        description: '',
        amount: '',
        category: type === 'expense' ? 'Food' : 'Salary',
        goal_id: '',
        date: new Date().toISOString().split('T')[0],
        note: ''
      })
      onClose()
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to add transaction', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Add transaction">
      {/* Type toggle */}
      <div className="flex border border-[#E4E2F0] rounded-[10px] overflow-hidden mb-4">
        <button type="button"
          onClick={() => { setType('expense'); setForm(f => ({ ...f, category: 'Food' })) }}
          className={`flex-1 py-2.5 text-[13px] font-medium flex items-center justify-center gap-2 transition-all
            ${type === 'expense' ? 'bg-[#FAECE7] text-[#712B13]' : 'bg-[#F0EFF8] text-[#6B6882]'}`}>
          <i className="ti ti-trending-down text-[14px]"></i> Expense
        </button>
        <button type="button"
          onClick={() => { setType('income'); setForm(f => ({ ...f, category: 'Salary' })) }}
          className={`flex-1 py-2.5 text-[13px] font-medium flex items-center justify-center gap-2 transition-all
            ${type === 'income' ? 'bg-[#E1F5EE] text-[#085041]' : 'bg-[#F0EFF8] text-[#6B6882]'}`}>
          <i className="ti ti-trending-up text-[14px]"></i> Income / Savings
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-medium text-[#6B6882]">Description</label>
          <input type="text" required placeholder="e.g. Monthly savings deposit"
            value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
            className="h-9 w-full" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-medium text-[#6B6882]">Amount ($)</label>
          <input type="number" required min="0.01" step="0.01" placeholder="0.00"
            value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })}
            className="h-9 w-full" />
        </div>

        {/* Category always visible */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-medium text-[#6B6882]">
            Category
            {type === 'income' && (
              <span className="text-[11px] text-[#6B6882] ml-1">
                — pick <strong>Savings</strong> if saving toward a goal
              </span>
            )}
          </label>
          <select
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
            className="h-9 w-full"
          >
            {cats.map(c => <option key={c.value}>{c.value}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Goal dropdown — only for income */}
          {type === 'income' ? (
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-[#6B6882]">
                Link to goal? <span className="text-[#AFA9EC] text-[11px]">(optional)</span>
              </label>
              <select
                value={form.goal_id}
                onChange={e => setForm({ ...form, goal_id: e.target.value })}
                className="h-9 w-full"
                style={{ borderColor: '#AFA9EC', background: '#EEEDFE', color: '#3C3489' }}
              >
                <option value="">-- No goal --</option>
                {goals.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>
          ) : null}

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-[#6B6882]">Date</label>
            <input type="date" value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
              className="h-9 w-full" />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-medium text-[#6B6882]">Note (optional)</label>
          <input type="text" placeholder="Add a note..."
            value={form.note} onChange={e => setForm({ ...form, note: e.target.value })}
            className="h-9 w-full" />
        </div>

        {/* Hint box */}
        <div className={`rounded-[10px] p-3 flex items-start gap-2 text-[12px] ${type === 'expense' ? 'bg-[#FAECE7]' : 'bg-[#E1F5EE]'}`}>
          <i className={`ti ti-info-circle flex-shrink-0 mt-0.5 ${type === 'expense' ? 'text-[#712B13]' : 'text-[#0F6E56]'}`}></i>
          <span
            className={type === 'expense' ? 'text-[#712B13]' : 'text-[#085041]'}
            dangerouslySetInnerHTML={{ __html: hint }}
          />
        </div>

        <div className="flex gap-2 mt-1">
          <Btn variant="outline" onClick={onClose} className="flex-1 justify-center">Cancel</Btn>
          <Btn
            type="submit"
            disabled={loading}
            variant={type === 'income' ? 'green' : 'primary'}
            className="flex-1 justify-center"
          >
            {loading ? 'Saving...' : type === 'expense' ? 'Add expense' : form.goal_id ? 'Add to goal' : 'Add income'}
          </Btn>
        </div>
      </form>
    </Modal>
  )
}
