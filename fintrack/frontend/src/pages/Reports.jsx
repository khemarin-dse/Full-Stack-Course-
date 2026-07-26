import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts'
import { Card, MetricCard, Spinner } from '../components/ui/index'
import api from '../utils/api'

export default function Reports() {
  const [data, setData] = useState(null)
  const [period, setPeriod] = useState('6months')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await api.get('/reports/summary', { params: { period } })
        setData(res.data)
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    load()
  }, [period])

  if (loading) return <Spinner />

  const monthly = data?.monthly || []
  const totals = data?.totals || {}

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-[20px] font-semibold">Reports</h1>
          <p className="text-[13px] text-[#6B6882] mt-0.5">Financial summary overview</p>
        </div>
        <div className="flex gap-2">
          <select value={period} onChange={e => setPeriod(e.target.value)} className="h-9 text-[13px] px-3">
            <option value="6months">Last 6 months</option>
            <option value="year">This year</option>
            <option value="lastyear">Last year</option>
          </select>
          <button className="flex items-center gap-1.5 px-4 h-9 border border-[#E4E2F0] rounded-[10px] text-[13px] text-[#6B6882] hover:border-primary hover:text-primary transition-all">
            <i className="ti ti-download text-[14px]"></i> Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <MetricCard label="Total income" value={`$${Number(totals.income || 0).toLocaleString()}`} color="#0F6E56" icon="ti-trending-up" iconColor="#0F6E56" sub={data?.period_label} />
        <MetricCard label="Total expenses" value={`$${Number(totals.expense || 0).toLocaleString()}`} color="#993C1D" icon="ti-trending-down" iconColor="#993C1D" sub={data?.period_label} />
        <MetricCard label="Total savings" value={`$${Number(totals.savings || 0).toLocaleString()}`} icon="ti-piggy-bank" sub={`↑ ${totals.savings_rate || 0}% savings rate`} />
        <MetricCard label="Avg monthly spend" value={`$${Number(totals.avg_monthly || 0).toLocaleString()}`} icon="ti-calendar" sub="Per month" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="text-[14px] font-semibold mb-4">Monthly income vs expenses</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={monthly} barSize={14} barGap={3}>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6B6882' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip formatter={v => `$${Number(v).toLocaleString()}`} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E4E2F0' }} />
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
          <h3 className="text-[14px] font-semibold mb-4">Savings trend</h3>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E2F0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6B6882' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip formatter={v => `$${Number(v).toLocaleString()}`} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E4E2F0' }} />
              <Line type="monotone" dataKey="savings" stroke="#534AB7" strokeWidth={2.5} dot={{ fill: '#534AB7', r: 4 }} name="Savings" />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-1.5 text-[12px] text-[#6B6882] mt-2">
            <div className="w-2.5 h-2.5 rounded-sm bg-primary"></div>Monthly savings
          </div>
        </Card>
      </div>

      {/* Monthly breakdown table */}
      <div className="bg-white border border-[#E4E2F0] rounded-[14px] overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#E4E2F0] font-semibold text-[14px]">Monthly breakdown</div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#F8F8FB]">
              {['Month', 'Income', 'Expenses', 'Savings', 'Rate'].map(h => (
                <th key={h} className="text-left text-[11px] font-semibold text-[#6B6882] uppercase tracking-wide px-5 py-3 border-b border-[#E4E2F0]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {monthly.map((row, i) => {
              const rate = row.income > 0 ? Math.round((row.savings / row.income) * 100) : 0
              return (
                <tr key={i} className="border-b border-[#E4E2F0] last:border-0">
                  <td className="px-5 py-3 text-[13px]">{row.month_label || row.month}</td>
                  <td className="px-5 py-3 text-[13px] font-semibold text-[#0F6E56]">${Number(row.income).toLocaleString()}</td>
                  <td className="px-5 py-3 text-[13px] font-semibold text-[#993C1D]">${Number(row.expense).toLocaleString()}</td>
                  <td className="px-5 py-3 text-[13px] font-semibold">${Number(row.savings).toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <span className="bg-[#E1F5EE] text-[#085041] text-[11px] font-semibold px-2.5 py-0.5 rounded-full">{rate}%</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
