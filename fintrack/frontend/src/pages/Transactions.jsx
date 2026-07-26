import { useEffect, useState } from 'react'
import { useFinance } from '../context/FinanceContext'
import { useToast } from '../context/ToastContext'
import { Btn, Badge, CatBadge, TxIcon, Spinner, Empty } from '../components/ui/index'
import AddTransactionModal from '../components/modals/AddTransactionModal'
import { getCategoryMeta } from '../utils/categories'

export default function Transactions() {
  const { transactions, fetchTransactions, deleteTransaction, loadingTx } = useFinance()
  const { toast } = useToast()
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => { fetchTransactions() }, [])

  const filtered = transactions.filter(tx => {
    const matchType = filter === 'all' || tx.type === filter
    const matchSearch = tx.description.toLowerCase().includes(search.toLowerCase()) ||
      tx.category.toLowerCase().includes(search.toLowerCase())
    return matchType && matchSearch
  })

  const handleDelete = async (id) => {
    if (!confirm('Delete this transaction?')) return
    try { await deleteTransaction(id); toast('Transaction deleted!') }
    catch { toast('Failed to delete', 'error') }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-[20px] font-semibold">Transactions</h1>
          <p className="text-[13px] text-[#6B6882] mt-0.5">All your income and expenses in one place</p>
        </div>
        <Btn onClick={() => setShowModal(true)}><i className="ti ti-plus text-[14px]"></i> Add transaction</Btn>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap items-center">
        <input type="text" placeholder="🔍  Search transactions..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="h-9 flex-1 min-w-[200px]" />
        {['all', 'income', 'expense'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-full border text-[12px] transition-all
              ${filter === f ? 'bg-[#EEEDFE] text-primary border-[#AFA9EC] font-medium' : 'border-[#E4E2F0] text-[#6B6882] hover:border-[#AFA9EC] hover:text-primary'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E4E2F0] rounded-[14px] overflow-hidden">
        {loadingTx ? <Spinner /> : filtered.length === 0 ? <Empty icon="ti-arrows-exchange" message="No transactions found" /> : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#F8F8FB]">
                <th className="text-left text-[11px] font-semibold text-[#6B6882] uppercase tracking-wide px-4 py-3 border-b border-[#E4E2F0]"></th>
                <th className="text-left text-[11px] font-semibold text-[#6B6882] uppercase tracking-wide px-4 py-3 border-b border-[#E4E2F0]">Description</th>
                <th className="text-left text-[11px] font-semibold text-[#6B6882] uppercase tracking-wide px-4 py-3 border-b border-[#E4E2F0]">Category</th>
                <th className="text-left text-[11px] font-semibold text-[#6B6882] uppercase tracking-wide px-4 py-3 border-b border-[#E4E2F0]">Date</th>
                <th className="text-left text-[11px] font-semibold text-[#6B6882] uppercase tracking-wide px-4 py-3 border-b border-[#E4E2F0]">Type</th>
                <th className="text-right text-[11px] font-semibold text-[#6B6882] uppercase tracking-wide px-4 py-3 border-b border-[#E4E2F0]">Amount</th>
                <th className="px-4 py-3 border-b border-[#E4E2F0]"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(tx => {
                const meta = getCategoryMeta(tx.category, tx.type)
                return (
                  <tr key={tx.id} className="border-b border-[#E4E2F0] last:border-0">
                    <td className="px-4 py-3"><TxIcon bg={meta.bg} color={meta.color} icon={meta.icon} /></td>
                    <td className="px-4 py-3 font-medium text-[13px]">{tx.description}</td>
                    <td className="px-4 py-3"><CatBadge label={tx.category} /></td>
                    <td className="px-4 py-3 text-[12px] text-[#6B6882]">
                      {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3"><Badge type={tx.type} /></td>
                    <td className={`px-4 py-3 text-right font-semibold text-[13px] ${tx.type === 'income' ? 'text-[#0F6E56]' : 'text-[#993C1D]'}`}>
                      {tx.type === 'income' ? '+' : '-'}${Number(tx.amount).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDelete(tx.id)} className="text-[#6B6882] hover:text-[#993C1D] transition-colors">
                        <i className="ti ti-trash text-[15px]"></i>
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      <AddTransactionModal open={showModal} onClose={() => { setShowModal(false); fetchTransactions() }} />
    </div>
  )
}
