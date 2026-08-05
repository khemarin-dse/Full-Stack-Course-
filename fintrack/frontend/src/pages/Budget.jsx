import { useEffect, useState } from 'react'
import { useFinance } from '../context/FinanceContext'
import { useToast } from '../context/ToastContext'
import { useCurrency } from '../context/CurrencyContext'
import { Btn, Card, ProgressBar, Spinner, Empty } from '../components/ui/index'
import BudgetModal from '../components/modals/BudgetModal'
import { getCategoryMeta, BUDGET_COLORS } from '../utils/categories'

export default function Budget() {
  const { budgets, fetchBudgets, deleteBudget, loadingBudget } = useFinance()
  const { toast } = useToast()
  const { format } = useCurrency()
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7))

  useEffect(() => { fetchBudgets({ month }) }, [month])

  const handleDelete = async (id) => {
    if (!confirm('Delete this budget?')) return
    try { await deleteBudget(id); await fetchBudgets({ month }); toast('Budget deleted!') }
    catch { toast('Failed to delete', 'error') }
  }

  const totalBudget = budgets.reduce((s, b) => s + Number(b.limit_amount), 0)
  const totalSpent = budgets.reduce((s, b) => s + Number(b.spent_amount), 0)

  return (
    <div className="flex flex-col gap-4 lg:gap-5">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-[18px] lg:text-[20px] font-semibold">Budget</h1>
          <p className="text-[12px] lg:text-[13px] text-[#6B6882] mt-0.5">Set monthly spending limits per category</p>
        </div>
        <div className="flex items-center gap-2">
          <input type="month" value={month} onChange={e => setMonth(e.target.value)}
            className="h-9 text-[12px] px-2 w-[130px] sm:w-[150px]" />
          <Btn size="sm" onClick={() => { setEditing(null); setShowModal(true) }}>
            <i className="ti ti-plus text-[14px]"></i>
            <span className="hidden sm:inline">Set budget</span>
            <span className="sm:hidden">Add</span>
          </Btn>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total budget', value: format(totalBudget), color: '#1A1730' },
          { label: 'Total spent', value: format(totalSpent), color: '#993C1D' },
          { label: 'Remaining', value: format(totalBudget - totalSpent), color: '#0F6E56' },
        ].map(s => (
          <Card key={s.label} className="p-3 lg:p-4">
            <div className="text-[11px] lg:text-[12px] text-[#6B6882] mb-1">{s.label}</div>
            <div className="text-[16px] lg:text-[22px] font-semibold" style={{ color: s.color }}>{s.value}</div>
          </Card>
        ))}
      </div>

      {loadingBudget ? <Spinner /> : budgets.length === 0 ? (
        <Card className="p-8"><Empty icon="ti-chart-pie" message={`No budgets set for ${new Date(month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} yet. Click 'Set budget' to get started.`} /></Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    <div className="w-8 h-8 rounded-[6px] flex items-center justify-center flex-shrink-0" style={{ background: meta.bg }}>
                      <i className={`ti ${meta.icon} text-[15px]`} style={{ color: meta.color }}></i>
                    </div>
                    <span className="font-medium text-[13px]">{b.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] lg:text-[12px] text-[#6B6882]">{format(b.spent_amount)} / {format(b.limit_amount)}</span>
                    <button onClick={() => { setEditing(b); setShowModal(true) }} className="text-[#6B6882] hover:text-primary transition-colors">
                      <i className="ti ti-pencil text-[13px]"></i>
                    </button>
                    <button onClick={() => handleDelete(b.id)} className="text-[#6B6882] hover:text-[#993C1D] transition-colors">
                      <i className="ti ti-trash text-[13px]"></i>
                    </button>
                  </div>
                </div>
                <ProgressBar pct={pct} color={isOver ? '#993C1D' : color} />
                <div className="flex justify-between text-[11px] mt-2">
                  <span className="text-[#6B6882]">{Math.min(pct, 100)}% used</span>
                  {isOver ? (
                    <span className="text-[#993C1D] font-medium">⚠ {format(Number(b.spent_amount) - Number(b.limit_amount))} over</span>
                  ) : isWarn ? (
                    <span className="text-[#854F0B] font-medium">⚠ {format(Number(b.limit_amount) - Number(b.spent_amount))} left</span>
                  ) : (
                    <span className="text-[#6B6882]">{format(Number(b.limit_amount) - Number(b.spent_amount))} left</span>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <BudgetModal open={showModal} onClose={() => { setShowModal(false); setEditing(null); fetchBudgets({ month }) }} existing={editing} defaultMonth={month} />
    </div>
  )
}
