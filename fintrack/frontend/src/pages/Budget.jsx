import { useEffect, useState } from 'react'
import { useFinance } from '../context/FinanceContext'
import { useToast } from '../context/ToastContext'
import { Btn, Card, ProgressBar, Spinner, Empty } from '../components/ui/index'
import BudgetModal from '../components/modals/BudgetModal'
import { getCategoryMeta, BUDGET_COLORS } from '../utils/categories'

export default function Budget() {
  const { budgets, fetchBudgets, deleteBudget, summary, loadingBudget } = useFinance()
  const { toast } = useToast()
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)

  useEffect(() => { fetchBudgets() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this budget?')) return
    try { await deleteBudget(id); toast('Budget deleted!') }
    catch { toast('Failed to delete', 'error') }
  }

  const totalBudget = budgets.reduce((s, b) => s + Number(b.limit_amount), 0)
  const totalSpent = budgets.reduce((s, b) => s + Number(b.spent_amount), 0)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-[20px] font-semibold">Budget</h1>
          <p className="text-[13px] text-[#6B6882] mt-0.5">Set monthly spending limits per category</p>
        </div>
        <Btn onClick={() => { setEditing(null); setShowModal(true) }}>
          <i className="ti ti-plus text-[14px]"></i> Set budget
        </Btn>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total budget', value: `$${totalBudget.toLocaleString()}`, color: '#1A1730' },
          { label: 'Total spent', value: `$${totalSpent.toLocaleString()}`, color: '#993C1D' },
          { label: 'Remaining', value: `$${(totalBudget - totalSpent).toLocaleString()}`, color: '#0F6E56' },
        ].map(s => (
          <Card key={s.label} className="p-4">
            <div className="text-[12px] text-[#6B6882] mb-1">{s.label}</div>
            <div className="text-[22px] font-semibold" style={{ color: s.color }}>{s.value}</div>
          </Card>
        ))}
      </div>

      {/* Budget cards */}
      {loadingBudget ? <Spinner /> : budgets.length === 0 ? (
        <Card className="p-8"><Empty icon="ti-chart-pie" message="No budgets set yet. Click 'Set budget' to get started." /></Card>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {budgets.map(b => {
            const pct = Math.round((Number(b.spent_amount) / Number(b.limit_amount)) * 100)
            const color = BUDGET_COLORS[b.category] || '#AFA9EC'
            const meta = getCategoryMeta(b.category)
            const isWarn = pct >= 80 && pct < 100
            const isOver = pct >= 100
            return (
              <Card key={b.id} className={`p-4 ${isOver ? 'border-[#993C1D]' : isWarn ? 'border-[#EF9F27]' : ''}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-[6px] flex items-center justify-center" style={{ background: meta.bg }}>
                      <i className={`ti ${meta.icon} text-[15px]`} style={{ color: meta.color }}></i>
                    </div>
                    <span className="font-medium text-[13px]">{b.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] text-[#6B6882]">${Number(b.spent_amount).toLocaleString()} / ${Number(b.limit_amount).toLocaleString()}</span>
                    <button onClick={() => { setEditing(b); setShowModal(true) }} className="text-[#6B6882] hover:text-primary ml-1">
                      <i className="ti ti-pencil text-[14px]"></i>
                    </button>
                    <button onClick={() => handleDelete(b.id)} className="text-[#6B6882] hover:text-[#993C1D]">
                      <i className="ti ti-trash text-[14px]"></i>
                    </button>
                  </div>
                </div>
                <ProgressBar pct={pct} color={isOver ? '#993C1D' : color} />
                <div className="flex justify-between text-[11px] mt-2">
                  <span className="text-[#6B6882]">{Math.min(pct, 100)}% used</span>
                  {isOver ? (
                    <span className="text-[#993C1D] font-medium">⚠ ${(Number(b.spent_amount) - Number(b.limit_amount)).toLocaleString()} over limit</span>
                  ) : isWarn ? (
                    <span className="text-[#854F0B] font-medium">⚠ ${(Number(b.limit_amount) - Number(b.spent_amount)).toLocaleString()} left</span>
                  ) : (
                    <span className="text-[#6B6882]">${(Number(b.limit_amount) - Number(b.spent_amount)).toLocaleString()} left</span>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <BudgetModal open={showModal} onClose={() => { setShowModal(false); setEditing(null) }} existing={editing} />
    </div>
  )
}
