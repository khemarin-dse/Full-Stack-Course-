import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Card, MetricCard, Spinner } from '../components/ui/index'
import { useCurrency } from '../context/CurrencyContext'
import api from '../utils/api'

const CustomBarTooltip = ({ active, payload, label, format }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#E4E2F0] rounded-[10px] p-3 shadow-lg text-[12px]">
        <p className="font-semibold text-[#1A1730] mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="flex items-center gap-2" style={{ color: p.fill }}>
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: p.fill }}></span>
            {p.name}: {format(p.value)}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function Reports() {
  const [data, setData] = useState(null)
  const [period, setPeriod] = useState('6months')
  const [loading, setLoading] = useState(true)
  const [allTx, setAllTx] = useState([])
  const { format } = useCurrency()

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

  // Pulled once for the export detail sections (CSV/PDF) — not shown on screen.
  useEffect(() => {
    api.get('/transactions').then(res => setAllTx(res.data || [])).catch(() => {})
  }, [])

  if (loading) return <Spinner />

  const monthly = data?.monthly || []
  const totals = data?.totals || {}

  // Mirrors the date range the backend uses for each period option, so the
  // exported transaction detail matches what the summary above is showing.
  const getPeriodRange = () => {
    const now = new Date()
    if (period === 'year') {
      return [new Date(now.getFullYear(), 0, 1), new Date(now.getFullYear(), 11, 31, 23, 59, 59)]
    }
    if (period === 'lastyear') {
      return [new Date(now.getFullYear() - 1, 0, 1), new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59)]
    }
    return [new Date(now.getFullYear(), now.getMonth() - 5, 1), new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)]
  }

  const getPeriodTransactions = () => {
    const [start, end] = getPeriodRange()
    return allTx
      .filter(tx => { const d = new Date(tx.date); return d >= start && d <= end })
      .sort((a, b) => new Date(a.date) - new Date(b.date))
  }

  const handleExportExcel = () => {
    const periodTx = getPeriodTransactions()
    const rows = [
      ['FinTrack Report', data?.period_label || ''],
      [],
      ['Monthly breakdown'],
      ['Month', 'Income', 'Expenses', 'Savings', 'Savings rate'],
      ...monthly.map(row => {
        const rate = row.income > 0 ? Math.round((row.savings / row.income) * 100) : 0
        return [row.month_label || row.month, row.income, row.expense, row.savings, `${rate}%`]
      }),
      [],
      ['Totals'],
      ['Total income', totals.income || 0],
      ['Total expenses', totals.expense || 0],
      ['Total savings', totals.savings || 0],
      ['Avg monthly', totals.avg_monthly || 0],
      [],
      ['Transaction detail'],
      ['Date', 'Description', 'Category', 'Type', 'Amount'],
      ...periodTx.map(tx => [
        new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        tx.description, tx.category, tx.type, tx.amount,
      ]),
    ]
    const csv = rows.map(r => r.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fintrack-report-${period}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportPDF = () => {
    const periodTx = getPeriodTransactions()
    const doc = new jsPDF()

    doc.setFontSize(16)
    doc.text('FinTrack — Financial Report', 14, 18)
    doc.setFontSize(10)
    doc.setTextColor(107, 104, 130)
    doc.text(data?.period_label || '', 14, 24)

    autoTable(doc, {
      startY: 30,
      head: [['Metric', 'Value']],
      body: [
        ['Total income', format(totals.income || 0)],
        ['Total expenses', format(totals.expense || 0)],
        ['Total savings', format(totals.savings || 0)],
        ['Avg monthly', format(totals.avg_monthly || 0)],
      ],
      theme: 'plain',
      styles: { fontSize: 10 },
    })

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 8,
      head: [['Month', 'Income', 'Expenses', 'Savings', 'Rate']],
      body: monthly.map(row => {
        const rate = row.income > 0 ? Math.round((row.savings / row.income) * 100) : 0
        return [row.month_label || row.month, format(row.income), format(row.expense), format(row.savings), `${rate}%`]
      }),
      headStyles: { fillColor: [83, 74, 183] },
      styles: { fontSize: 9 },
    })

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 8,
      head: [['Date', 'Description', 'Category', 'Type', 'Amount']],
      body: periodTx.map(tx => [
        new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        tx.description, tx.category, tx.type, format(tx.amount),
      ]),
      headStyles: { fillColor: [83, 74, 183] },
      styles: { fontSize: 8 },
    })

    doc.save(`fintrack-report-${period}.pdf`)
  }

  return (
    <div className="flex flex-col gap-4 lg:gap-5">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
        <div>
          <h1 className="text-[18px] lg:text-[20px] font-semibold">Reports</h1>
          <p className="text-[12px] lg:text-[13px] text-[#6B6882] mt-0.5">Financial summary overview</p>
        </div>
        <div className="flex gap-2">
          <select value={period} onChange={e => setPeriod(e.target.value)} className="h-9 text-[12px] px-3 flex-1 sm:flex-none">
            <option value="6months">Last 6 months</option>
            <option value="year">This year</option>
            <option value="lastyear">Last year</option>
          </select>
          <button onClick={handleExportExcel} className="flex items-center gap-1.5 px-3 h-9 border border-[#E4E2F0] rounded-[10px] text-[12px] text-[#6B6882] hover:border-primary hover:text-primary transition-all flex-shrink-0">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span className="hidden sm:inline">Export Excel</span>
          </button>
          <button onClick={handleExportPDF} className="flex items-center gap-1.5 px-3 h-9 border border-[#E4E2F0] rounded-[10px] text-[12px] text-[#6B6882] hover:border-primary hover:text-primary transition-all flex-shrink-0">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span className="hidden sm:inline">Export PDF</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard label="Total income" value={format(totals.income || 0)} color="#0F6E56" icon="ti-trending-up" iconColor="#0F6E56" sub={data?.period_label} />
        <MetricCard label="Total expenses" value={format(totals.expense || 0)} color="#993C1D" icon="ti-trending-down" iconColor="#993C1D" sub={data?.period_label} />
        <MetricCard label="Total savings" value={format(totals.savings || 0)} icon="ti-piggy-bank" sub={`↑ ${totals.savings_rate || 0}% savings rate`} />
        <MetricCard label="Avg monthly" value={format(totals.avg_monthly || 0)} icon="ti-calendar" sub="Per month" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4 lg:p-5">
          <h3 className="text-[13px] lg:text-[14px] font-semibold mb-4">Monthly income vs expenses</h3>
          <div className="overflow-x-auto">
            <div style={{ minWidth: 300 }}>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={monthly} barSize={12} barGap={3}>
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#6B6882' }} axisLine={false} tickLine={false} interval={0} />
                  <YAxis hide />
                  <Tooltip content={<CustomBarTooltip format={format} />} />
                  <Bar dataKey="income" fill="#5DCAA5" radius={[3, 3, 0, 0]} name="Income" />
                  <Bar dataKey="expense" fill="#F0997B" radius={[3, 3, 0, 0]} name="Expense" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-1.5 text-[11px] text-[#6B6882]"><div className="w-2.5 h-2.5 rounded-sm bg-[#5DCAA5]"></div>Income</div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#6B6882]"><div className="w-2.5 h-2.5 rounded-sm bg-[#F0997B]"></div>Expenses</div>
          </div>
        </Card>

        <Card className="p-4 lg:p-5">
          <h3 className="text-[13px] lg:text-[14px] font-semibold mb-4">Savings trend</h3>
          <div className="overflow-x-auto">
            <div style={{ minWidth: 300 }}>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={monthly} margin={{ left: 0, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E4E2F0" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#6B6882' }} axisLine={false} tickLine={false} interval={0} />
                  <YAxis hide />
                  <Tooltip
                    formatter={(v) => [format(v), 'Savings']}
                    contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #E4E2F0' }}
                    labelStyle={{ fontWeight: 600, color: '#1A1730' }}
                  />
                  <Line type="monotone" dataKey="savings" stroke="#534AB7" strokeWidth={2.5} dot={{ fill: '#534AB7', r: 3 }} name="Savings" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#6B6882] mt-2">
            <div className="w-2.5 h-2.5 rounded-sm bg-primary"></div>Monthly savings
          </div>
        </Card>
      </div>

      <div className="bg-white border border-[#E4E2F0] rounded-[14px] overflow-hidden overflow-x-auto">
        <div className="px-4 lg:px-5 py-3.5 border-b border-[#E4E2F0] font-semibold text-[13px] lg:text-[14px]">Monthly breakdown</div>
        <table className="w-full border-collapse min-w-[400px]">
          <thead>
            <tr className="bg-[#F8F8FB]">
              {['Month', 'Income', 'Expenses', 'Savings', 'Rate'].map(h => (
                <th key={h} className="text-left text-[11px] font-semibold text-[#6B6882] uppercase tracking-wide px-4 lg:px-5 py-3 border-b border-[#E4E2F0]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {monthly.map((row, i) => {
              const rate = row.income > 0 ? Math.round((row.savings / row.income) * 100) : 0
              return (
                <tr key={i} className="border-b border-[#E4E2F0] last:border-0 hover:bg-[#F8F8FB] transition-colors">
                  <td className="px-4 lg:px-5 py-3 text-[13px]">{row.month_label || row.month}</td>
                  <td className="px-4 lg:px-5 py-3 text-[13px] font-semibold text-[#0F6E56]">{format(row.income)}</td>
                  <td className="px-4 lg:px-5 py-3 text-[13px] font-semibold text-[#993C1D]">{format(row.expense)}</td>
                  <td className="px-4 lg:px-5 py-3 text-[13px] font-semibold">{format(row.savings)}</td>
                  <td className="px-4 lg:px-5 py-3">
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
