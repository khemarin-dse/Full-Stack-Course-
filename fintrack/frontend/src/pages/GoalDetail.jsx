import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useFinance } from '../context/FinanceContext'
import { useToast } from '../context/ToastContext'
import { useCurrency } from '../context/CurrencyContext'
import { Btn, Card, ProgressBar, Spinner } from '../components/ui/index'
import GoalModal from '../components/modals/GoalModal'
import AddMoneyModal from '../components/modals/AddMoneyModal'
import { getGoalMeta } from '../utils/categories'
import api from '../utils/api'

export default function GoalDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { deleteGoal, fetchGoals } = useFinance()
  const { toast } = useToast()
  const { format } = useCurrency()
  const [goal, setGoal] = useState(null)
  const [history, setHistory] = useState([])
  const [showEdit, setShowEdit] = useState(false)
  const [showAddMoney, setShowAddMoney] = useState(false)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/goals/${id}`)
      setGoal(res.data.goal)
      setHistory(res.data.history || [])
    } catch { navigate('/goals') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [id])

  const handleDelete = async () => {
    if (!confirm('Delete this goal and all its history?')) return
    try { await deleteGoal(id); toast('Goal deleted!'); navigate('/goals') }
    catch { toast('Failed to delete', 'error') }
  }

  if (loading || !goal) return <Spinner />

  const meta = getGoalMeta(goal.type)
  const pct = Math.min(Math.round((Number(goal.saved_amount) / Number(goal.target_amount)) * 100), 100)
  const remaining = Number(goal.target_amount) - Number(goal.saved_amount)
  const monthsLeft = goal.deadline ? Math.max(Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24 * 30)), 0) : null
  const neededPerMonth = monthsLeft ? Math.ceil(remaining / monthsLeft) : null
  const avgSaved = history.length > 0 ? Math.round(history.reduce((s, h) => s + Number(h.amount), 0) / Math.max(history.length, 1)) : 0

  return (
    <div className="flex flex-col gap-4 lg:gap-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[18px] lg:text-[20px] font-semibold">{goal.name}</h1>
          {goal.deadline && (
            <p className="text-[12px] lg:text-[13px] text-[#6B6882]">
              Deadline: {new Date(goal.deadline).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Btn variant="outline" size="sm" onClick={() => setShowEdit(true)}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
            </svg>
            <span className="hidden sm:inline">Edit</span>
          </Btn>
          <Btn variant="danger-outline" size="sm" onClick={handleDelete}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" />
            </svg>
            <span className="hidden sm:inline">Delete</span>
          </Btn>
          <Btn variant="outline" size="sm" onClick={() => navigate('/goals')}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
            <span className="hidden sm:inline">Back</span>
          </Btn>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left */}
        <Card className="p-4 lg:p-5 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-[12px] flex items-center justify-center flex-shrink-0" style={{ background: meta.bg }}>
              <i className={`ti ${meta.icon} text-[24px]`} style={{ color: meta.color }}></i>
            </div>
            <div>
              <div className="text-[18px] font-bold">{goal.name}</div>
              <span className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-full mt-1" style={{ background: meta.bg, color: meta.color }}>
                {goal.type || 'Others'}
              </span>
              {goal.note && <div className="text-[12px] text-[#6B6882] mt-1">{goal.note}</div>}
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[13px] mb-2">
              <span className="text-[#6B6882]">Progress</span>
              <span className="font-semibold" style={{ color: meta.color }}>{pct}% complete</span>
            </div>
            <div className="h-3 bg-[#F0EFF8] rounded-full overflow-hidden mb-1.5">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: meta.color }}></div>
            </div>
            <div className="flex justify-between text-[12px]">
              <span className="font-semibold">{format(goal.saved_amount)} saved</span>
              <span className="text-[#6B6882]">{format(goal.target_amount)} target</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Still needed', value: format(remaining) },
              { label: 'Months left', value: monthsLeft !== null ? `${monthsLeft} months` : 'No deadline' },
              { label: 'Needed / month', value: neededPerMonth ? format(neededPerMonth) : '—', highlight: true },
              { label: 'Avg saved / month', value: format(avgSaved), green: true },
            ].map(s => (
              <div key={s.label} className="bg-[#F8F8FB] border border-[#E4E2F0] rounded-[10px] p-3">
                <div className="text-[11px] text-[#6B6882] mb-1">{s.label}</div>
                <div className={`text-[16px] lg:text-[18px] font-semibold ${s.highlight ? 'text-primary' : s.green ? 'text-[#0F6E56]' : 'text-[#1A1730]'}`}>
                  {s.value}
                </div>
              </div>
            ))}
          </div>

          {neededPerMonth && neededPerMonth > avgSaved && (
            <div className="bg-[#FAEEDA] rounded-[10px] p-3 flex items-start gap-2">
              <i className="ti ti-alert-triangle text-[#854F0B] flex-shrink-0 mt-0.5"></i>
              <span className="text-[12px] text-[#633806]">
                At your current pace you need <strong>{format(neededPerMonth)}/month</strong> to hit your goal. Try saving a bit more!
              </span>
            </div>
          )}

          {pct >= 100 && (
            <div className="bg-[#E1F5EE] rounded-[10px] p-3 flex items-start gap-2">
              <i className="ti ti-check text-[#0F6E56] flex-shrink-0 mt-0.5"></i>
              <span className="text-[12px] text-[#085041] font-medium">🎉 Congratulations! You've reached your goal!</span>
            </div>
          )}

          <Btn className="w-full justify-center" onClick={() => setShowAddMoney(true)}>
            <i className="ti ti-plus text-[14px]"></i> Add money to this goal
          </Btn>
        </Card>

        {/* Right: History */}
        <Card className="p-4 lg:p-5">
          <h3 className="text-[14px] font-semibold mb-4">Saving history</h3>
          {history.length === 0 ? (
            <div className="text-[13px] text-[#6B6882] text-center py-8">No savings recorded yet</div>
          ) : (
            <div className="flex flex-col gap-2 max-h-[380px] overflow-y-auto">
              {history.map((h, i) => {
                const isManual = h.source === 'manual'
                return (
                  <div key={i} className="flex items-center gap-3 p-2.5 bg-[#F8F8FB] rounded-[10px]">
                    <div className={`w-8 h-8 rounded-[6px] flex items-center justify-center flex-shrink-0 ${isManual ? 'bg-[#EEEDFE]' : 'bg-[#E1F5EE]'}`}>
                      <i className={`ti ${isManual ? 'ti-pencil text-primary' : 'ti-trending-up text-[#0F6E56]'} text-[14px]`}></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium truncate">{h.description || 'Savings deposit'}</div>
                      <div className="text-[11px] text-[#6B6882]">
                        {new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        {' · '}{isManual ? 'manual update' : 'via transaction'}
                      </div>
                    </div>
                    <span className="text-[13px] font-semibold text-[#0F6E56] flex-shrink-0">+{format(h.amount)}</span>
                  </div>
                )
              })}
            </div>
          )}
          <div className="border-t border-[#E4E2F0] pt-3 mt-3 flex justify-between text-[13px]">
            <span className="text-[#6B6882]">Total saved</span>
            <span className="font-semibold text-[#0F6E56]">{format(goal.saved_amount)}</span>
          </div>
        </Card>
      </div>

      <GoalModal open={showEdit} onClose={() => { setShowEdit(false); load() }} existing={goal} />
      <AddMoneyModal open={showAddMoney} onClose={() => { setShowAddMoney(false); load() }} goal={goal} />
    </div>
  )
}
