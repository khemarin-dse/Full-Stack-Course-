import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { useFinance } from '../context/FinanceContext'
import { MetricCard, Card, Btn, ProgressBar, TxIcon, Spinner } from '../components/ui/index'
import AddTransactionModal from '../components/modals/AddTransactionModal'
import { getCategoryMeta, BUDGET_COLORS } from '../utils/categories'
import api from '../utils/api'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function Dashboard() {
  const { summary, transactions, budgets, fetchSummary, fetchTransactions, fetchBudgets, fetchGoals } = useFinance()
  const [showTxModal, setShowTxModal] = useState(false)
  const [chartData, setChartData] = useState([])
  const [pieData, setPieData] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      await Promise.all([fetchSummary(), fetchTransactions({ limit: 5 }), fetchBudgets(), fetchGoals()])
      const res = await api.get('/dashboard/chart')
      setChartData(res.data.monthly || [])
      setPieData(res.data.pie || [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <Spinner />

  const PIE_COLORS = ['#AFA9EC', '#5DCAA5', '#FAC775', '#F0997B', '#534AB7']
  const recent = transactions.slice(0, 4)

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-[20px] font-semibold text-[#1A1730]">Dashboard</h1>
          <p className="text-[13px] text-[#6B6882] mt-0.5">Here's your financial snapshot</p>
        </div>
        <Btn onClick={() => setShowTxModal(true)}><i className="ti ti-plus text-[14px]"></i> Add transaction</Btn>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-3">
        <MetricCard label="Total income" value={`$${Number(summary.income || 0).toLocaleString()}`}
          icon="ti-trending-up" iconColor="#0F6E56" color="#0F6E56" sub="This month" />
        <MetricCard label="Total expenses" value={`$${Number(summary.expense || 0).toLocaleString()}`}
          icon="ti-trending-down" iconColor="#993C1D" color="#993C1D" sub="This month" />
        <MetricCard label="Net savings" value={`$${Number(summary.savings || 0).toLocaleString()}`}
          icon="ti-piggy-bank" sub={`${summary.savings_rate || 0}% savings rate`} />
        <MetricCard label="Budget used" value={`${summary.budget_used_pct || 0}%`}
          icon="ti-credit-card" sub={`$${Number(summary.budget_remaining || 0).toLocaleString()} remaining`} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="text-[14px] font-semibold mb-4">Income vs expenses</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={chartData} barSize={14} barGap={3}>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6B6882' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip formatter={(v) => `$${v.toLocaleString()}`} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E4E2F0' }} />
              <Bar dataKey="income" fill="#5DCAA5" radius={[3, 3, 0, 0]} name="Income" />
              <Bar dataKey="expense" fill="#F0997B" radius={[3, 3, 0, 0]} name="Expense" />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-1.5 text-[12px] text-[#6B6882]"><div className="w-2.5 h-2.5 rounded-sm bg-[#5DCAA5]"></div>Income</div>
            <div className="flex items-center gap-1.5 text-[12px] text-[#6B6882]"><div className="w-2.5 h-2.5 rounded-sm bg-[#F0997B]"></div>Expenses</div>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-[14px] font-semibold mb-3">Spending by category</h3>
          {pieData.length > 0 ? (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={120} height={120}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" innerRadius={35} outerRadius={55} paddingAngle={2}>
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2 flex-1">
                {pieData.map((d, i) => (
                  <div key={d.name} className="flex justify-between text-[12px]">
                    <div className="flex items-center gap-1.5 text-[#6B6882]">
                      <div className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}></div>
                      {d.name}
                    </div>
                    <span className="font-semibold">${Number(d.value).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : <div className="text-[13px] text-[#6B6882] text-center py-8">No expense data yet</div>}
        </Card>
      </div>

      {/* Recent tx + Budget */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[14px] font-semibold">Recent transactions</h3>
            <button onClick={() => navigate('/transactions')} className="text-[12px] text-primary">View all</button>
          </div>
          <div className="flex flex-col gap-3">
            {recent.length === 0 && <div className="text-[13px] text-[#6B6882] text-center py-4">No transactions yet</div>}
            {recent.map(tx => {
              const meta = getCategoryMeta(tx.category, tx.type)
              return (
                <div key={tx.id} className="flex items-center gap-3">
                  <TxIcon bg={meta.bg} color={meta.color} icon={meta.icon} />
                  <div className="flex-1">
                    <div className="text-[13px] font-medium">{tx.description}</div>
                    <div className="text-[11px] text-[#6B6882]">{new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                  </div>
                  <span className={`text-[13px] font-semibold ${tx.type === 'income' ? 'text-[#0F6E56]' : 'text-[#993C1D]'}`}>
                    {tx.type === 'income' ? '+' : '-'}${Number(tx.amount).toLocaleString()}
                  </span>
                </div>
              )
            })}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[14px] font-semibold">Budget tracker</h3>
            <button onClick={() => navigate('/budget')} className="text-[12px] text-primary">Manage</button>
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
                    <span className="text-[#6B6882]">${Number(b.spent_amount).toLocaleString()} / ${Number(b.limit_amount).toLocaleString()}</span>
                  </div>
                  <ProgressBar pct={pct} color={color} />
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      <AddTransactionModal open={showTxModal} onClose={() => setShowTxModal(false)} />
    </div>
  )
}
