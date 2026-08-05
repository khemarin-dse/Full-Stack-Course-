import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useFinance } from '../context/FinanceContext'
import { useCurrency } from '../context/CurrencyContext'
import { MetricCard, Card, Btn, ProgressBar, TxIcon, Spinner } from '../components/ui/index'
import AddTransactionModal from '../components/modals/AddTransactionModal'
import { getTxMeta, BUDGET_COLORS } from '../utils/categories'
import api from '../utils/api'

const PIE_COLORS = ['#AFA9EC', '#5DCAA5', '#FAC775', '#F0997B', '#534AB7']

const CustomTooltip = ({ active, payload, label }) => {
  const { format } = useCurrency()
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#E4E2F0] rounded-[10px] p-3 shadow-lg text-[12px]">
        <p className="font-semibold text-[#1A1730] mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.fill }} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: p.fill }}></span>
            {p.name}: {format(p.value)}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function Dashboard() {
  const { summary, transactions, fetchSummary, fetchTransactions, fetchGoals } = useFinance()
  const { format } = useCurrency()
  const [showTxModal, setShowTxModal] = useState(false)
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedIdx, setSelectedIdx] = useState(null) // null = live "this month" summary
  const navigate = useNavigate()

  const fetchChart = async () => {
    try {
      const res = await api.get('/dashboard/chart')
      setChartData(res.data.monthly || [])
    } catch (e) { console.error(e) }
  }

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      await Promise.all([fetchSummary(), fetchTransactions({ limit: 5 }), fetchGoals(), fetchChart()])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <Spinner />

  const recent = transactions.slice(0, 4)
  const currentMonthKey = new Date().toISOString().slice(0, 7)
  const selectedMonth = selectedIdx !== null ? chartData[selectedIdx] : null
  // Everything shown below (cards, spending-by-category, budget tracker) comes
  // from this one entry — whichever month is selected, or this month by default.
  const activeEntry = selectedMonth || chartData.find(m => m.monthKey === currentMonthKey) || null
  const stats = selectedMonth ? {
    income: selectedMonth.income,
    expense: selectedMonth.expense,
    savings: selectedMonth.savings,
    savings_rate: selectedMonth.savings_rate,
    budget_used_pct: selectedMonth.budget_used_pct,
    budget_remaining: selectedMonth.budget_remaining,
  } : summary
  const periodLabel = selectedMonth ? `${selectedMonth.month} ${selectedMonth.year}` : 'This month'
  const pieData = activeEntry?.categories || []
  const budgets = activeEntry?.budgets || []

  return (
    <div className="flex flex-col gap-4 lg:gap-5">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-[18px] lg:text-[20px] font-semibold text-[#1A1730]">Dashboard</h1>
          <p className="text-[12px] lg:text-[13px] text-[#6B6882] mt-0.5">Here's your financial snapshot</p>
        </div>
        <Btn onClick={() => setShowTxModal(true)} size="sm">
          <i className="ti ti-plus text-[14px]"></i>
          <span className="hidden sm:inline">Add transaction</span>
          <span className="sm:hidden">Add</span>
        </Btn>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard label="Total income" value={format(stats.income || 0)} icon="ti-trending-up" iconColor="#0F6E56" color="#0F6E56" sub={periodLabel} />
        <MetricCard label="Total expenses" value={format(stats.expense || 0)} icon="ti-trending-down" iconColor="#993C1D" color="#993C1D" sub={periodLabel} />
        <MetricCard label="Net savings" value={format(stats.savings || 0)} icon="ti-piggy-bank" sub={`${stats.savings_rate || 0}% savings rate`} />
        <MetricCard label="Budget used" value={`${stats.budget_used_pct || 0}%`} icon="ti-credit-card" sub={`${format(stats.budget_remaining || 0)} remaining`} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4 lg:p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[13px] lg:text-[14px] font-semibold">Income vs expenses</h3>
            {selectedMonth && (
              <button onClick={() => setSelectedIdx(null)}
                className="flex items-center gap-1 text-[11px] text-primary bg-[#EEEDFE] px-2 py-1 rounded-full font-medium hover:opacity-80 transition-all">
                {periodLabel}
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                  <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            )}
          </div>
          <div className="overflow-x-auto">
            <div style={{ minWidth: Math.max(320, chartData.length * 46) }}>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={chartData} barSize={12} barGap={3} margin={{ left: 0, right: 0 }}>
                  <XAxis dataKey="month" tick={(props) => (
                      <text {...props} y={props.y + 12} textAnchor="middle"
                        fontSize={10}
                        fontWeight={props.index === selectedIdx ? 700 : 400}
                        fill={props.index === selectedIdx ? '#534AB7' : '#6B6882'}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setSelectedIdx(props.index)}
                      >
                        {props.payload.value}
                      </text>
                    )} axisLine={false} tickLine={false} interval={0} />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="income" fill="#5DCAA5" radius={[3, 3, 0, 0]} name="Income" cursor="pointer"
                    onClick={(_, index) => setSelectedIdx(index)}>
                    {chartData.map((_, i) => <Cell key={i} fillOpacity={selectedIdx === null || i === selectedIdx ? 1 : 0.35} />)}
                  </Bar>
                  <Bar dataKey="expense" fill="#F0997B" radius={[3, 3, 0, 0]} name="Expense" cursor="pointer"
                    onClick={(_, index) => setSelectedIdx(index)}>
                    {chartData.map((_, i) => <Cell key={i} fillOpacity={selectedIdx === null || i === selectedIdx ? 1 : 0.35} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5 text-[11px] text-[#6B6882]"><div className="w-2.5 h-2.5 rounded-sm bg-[#5DCAA5]"></div>Income</div>
              <div className="flex items-center gap-1.5 text-[11px] text-[#6B6882]"><div className="w-2.5 h-2.5 rounded-sm bg-[#F0997B]"></div>Expenses</div>
            </div>
            <span className="text-[10px] text-[#6B6882] hidden sm:inline">Click a month to see its details ↑</span>
          </div>
        </Card>

        <Card className="p-4 lg:p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[13px] lg:text-[14px] font-semibold">Spending by category</h3>
            <span className="text-[11px] text-[#6B6882]">{periodLabel}</span>
          </div>
          {pieData.length > 0 ? (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={110} height={110}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" innerRadius={32} outerRadius={50} paddingAngle={2}>
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => format(v)} contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #E4E2F0' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2 flex-1">
                {pieData.map((d, i) => (
                  <div key={d.name} className="flex justify-between text-[11px] lg:text-[12px]">
                    <div className="flex items-center gap-1.5 text-[#6B6882]">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}></div>
                      <span className="truncate max-w-[80px]">{d.name}</span>
                    </div>
                    <span className="font-semibold">{format(d.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : <div className="text-[13px] text-[#6B6882] text-center py-8">No expense data yet</div>}
        </Card>
      </div>

      {/* Recent tx + Budget */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4 lg:p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[13px] lg:text-[14px] font-semibold">Recent transactions</h3>
            <button onClick={() => navigate('/transactions')}
              className="text-[12px] text-primary hover:underline hover:text-primary/80 transition-all font-medium">
              View all →
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {recent.length === 0 && <div className="text-[13px] text-[#6B6882] text-center py-4">No transactions yet</div>}
            {recent.map(tx => {
              const meta = getTxMeta(tx.category, tx.type)
              return (
                <div key={tx.id} className="flex items-center gap-3">
                  <TxIcon bg={meta.bg} color={meta.color} icon={meta.icon} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium truncate">{tx.description}</div>
                    <div className="text-[11px] text-[#6B6882]">{new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                  </div>
                  <span className={`text-[13px] font-semibold flex-shrink-0 ${tx.type === 'income' ? 'text-[#0F6E56]' : 'text-[#993C1D]'}`}>
                    {tx.type === 'income' ? '+' : '-'}{format(tx.amount)}
                  </span>
                </div>
              )
            })}
          </div>
        </Card>

        <Card className="p-4 lg:p-5">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-[13px] lg:text-[14px] font-semibold">Budget tracker</h3>
              <span className="text-[11px] text-[#6B6882]">{periodLabel}</span>
            </div>
            <button onClick={() => navigate('/budget')}
              className="text-[12px] text-primary hover:underline hover:text-primary/80 transition-all font-medium">
              Manage →
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {budgets.length === 0 && <div className="text-[13px] text-[#6B6882] text-center py-4">No budgets set yet</div>}
            {budgets.slice(0, 4).map(b => {
              const pct = Math.round((b.spent_amount / b.limit_amount) * 100)
              const color = BUDGET_COLORS[b.category] || '#AFA9EC'
              return (
                <div key={b.id}>
                  <div className="flex justify-between text-[12px] mb-1.5">
                    <span>{b.category}</span>
                    <span className="text-[#6B6882]">{format(b.spent_amount)} / {format(b.limit_amount)}</span>
                  </div>
                  <ProgressBar pct={pct} color={color} />
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      <AddTransactionModal open={showTxModal} onClose={() => { setShowTxModal(false); fetchChart() }} />
    </div>
  )
}
