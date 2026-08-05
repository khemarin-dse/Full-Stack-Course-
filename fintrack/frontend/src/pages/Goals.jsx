import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFinance } from '../context/FinanceContext'
import { useCurrency } from '../context/CurrencyContext'
import { Btn, Card, ProgressBar, Spinner, Empty } from '../components/ui/index'
import GoalModal from '../components/modals/GoalModal'
import { getGoalMeta } from '../utils/categories'

export default function Goals() {
  const { goals, fetchGoals, loadingGoals } = useFinance()
  const { format } = useCurrency()
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  useEffect(() => { fetchGoals() }, [])

  return (
    <div className="flex flex-col gap-4 lg:gap-5">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-[18px] lg:text-[20px] font-semibold">Goals</h1>
          <p className="text-[12px] lg:text-[13px] text-[#6B6882] mt-0.5">Track your savings toward each goal</p>
        </div>
        <div className="flex items-center gap-2">
          <Btn onClick={() => setShowModal(true)} size="sm">
            <i className="ti ti-plus text-[14px]"></i>
            <span className="hidden sm:inline">Add goal</span>
            <span className="sm:hidden">Add</span>
          </Btn>
        </div>
      </div>

      {loadingGoals ? <Spinner /> : goals.length === 0 ? (
        <Card className="p-8"><Empty icon="ti-target" message="No goals yet. Click 'Add goal' to get started." /></Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {goals.map(goal => {
            const meta = getGoalMeta(goal.type)
            const pct = Math.min(Math.round((Number(goal.saved_amount) / Number(goal.target_amount)) * 100), 100)
            return (
              <div key={goal.id} onClick={() => navigate(`/goals/${goal.id}`)}
                className="bg-white border border-[#E4E2F0] rounded-[14px] p-5 flex flex-col gap-3 cursor-pointer hover:border-[#AFA9EC] hover:shadow-sm transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0" style={{ background: meta.bg }}>
                    <i className={`ti ${meta.icon} text-[20px]`} style={{ color: meta.color }}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-semibold truncate">{goal.name}</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[12px] text-[#6B6882]">Target: {format(goal.target_amount)}</span>
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full" style={{ background: meta.bg, color: meta.color }}>
                        {goal.type || 'Others'}
                      </span>
                    </div>
                  </div>
                  <span className="text-[12px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0" style={{ background: meta.bg, color: meta.color }}>
                    {pct}%
                  </span>
                </div>
                <ProgressBar pct={pct} color={meta.color} />
                <div className="flex justify-between text-[12px]">
                  <span className="font-semibold">{format(goal.saved_amount)} saved</span>
                  {goal.deadline && (
                    <span className="text-[#6B6882] flex items-center gap-1">
                      <i className="ti ti-calendar text-[12px]"></i>
                      {new Date(goal.deadline).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-[12px] text-primary">
                  <i className="ti ti-arrow-right text-[13px]"></i>
                  Click to view details & add money
                </div>
              </div>
            )
          })}
        </div>
      )}

      <GoalModal open={showModal} onClose={() => { setShowModal(false); fetchGoals() }} />
    </div>
  )
}
