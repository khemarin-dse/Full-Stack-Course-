import { useEffect, useState } from 'react'
import { useFinance } from '../context/FinanceContext'
import { useToast } from '../context/ToastContext'
import { useCurrency } from '../context/CurrencyContext'
import { Btn, Badge, CatBadge, TxIcon, Spinner, Empty } from '../components/ui/index'
import AddTransactionModal from '../components/modals/AddTransactionModal'
import { getTxMeta } from '../utils/categories'

export default function Transactions() {
  const { transactions, fetchTransactions, deleteTransaction, loadingTx } = useFinance()
  const { toast } = useToast()
  const { format } = useCurrency()
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
    <div className="flex flex-col gap-4 lg:gap-5">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-[18px] lg:text-[20px] font-semibold">Transactions</h1>
          <p className="text-[12px] lg:text-[13px] text-[#6B6882] mt-0.5">All your income and expenses</p>
        </div>
        <div className="flex items-center gap-2">
          <Btn onClick={() => setShowModal(true)} size="sm">
            <i className="ti ti-plus text-[14px]"></i>
            <span className="hidden sm:inline">Add transaction</span>
            <span className="sm:hidden">Add</span>
          </Btn>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap items-center">
        <input type="text" placeholder="🔍  Search..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="h-9 flex-1 min-w-[140px]" />
        {['all', 'income', 'expense'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full border text-[12px] transition-all capitalize
              ${filter === f ? 'bg-[#EEEDFE] text-primary border-[#AFA9EC] font-medium' : 'border-[#E4E2F0] text-[#6B6882] hover:border-[#AFA9EC] hover:text-primary'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white border border-[#E4E2F0] rounded-[14px] overflow-hidden">
        {loadingTx ? <Spinner /> : filtered.length === 0 ? <Empty icon="ti-arrows-exchange" message="No transactions found" /> : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#F8F8FB]">
                {['', 'Description', 'Category', 'Date', 'Type', 'Amount', ''].map((h, i) => (
                  <th key={i} className={`text-[11px] font-semibold text-[#6B6882] uppercase tracking-wide px-4 py-3 border-b border-[#E4E2F0] ${h === 'Amount' ? 'text-right' : 'text-left'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(tx => {
                const meta = getTxMeta(tx.category, tx.type)
                return (
                  <tr key={tx.id} className="border-b border-[#E4E2F0] last:border-0 hover:bg-[#F8F8FB] transition-colors">
                    <td className="px-4 py-3"><TxIcon bg={meta.bg} color={meta.color} icon={meta.icon} /></td>
                    <td className="px-4 py-3 font-medium text-[13px]">{tx.description}</td>
                    <td className="px-4 py-3"><CatBadge label={tx.category} /></td>
                    <td className="px-4 py-3 text-[12px] text-[#6B6882]">
                      {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3"><Badge type={tx.type} /></td>
                    <td className={`px-4 py-3 text-right font-semibold text-[13px] ${tx.type === 'income' ? 'text-[#0F6E56]' : 'text-[#993C1D]'}`}>
                      {tx.type === 'income' ? '+' : '-'}{format(tx.amount)}
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

      {/* Mobile cards */}
      <div className="md:hidden flex flex-col gap-3">
        {loadingTx ? <Spinner /> : filtered.length === 0 ? <Empty icon="ti-arrows-exchange" message="No transactions found" /> :
          filtered.map(tx => {
            const meta = getTxMeta(tx.category, tx.type)
            return (
              <div key={tx.id} className="bg-white border border-[#E4E2F0] rounded-[12px] p-4 flex items-center gap-3">
                <TxIcon bg={meta.bg} color={meta.color} icon={meta.icon} />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium truncate">{tx.description}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-[#6B6882]">{new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    <CatBadge label={tx.category} />
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-[13px] font-semibold ${tx.type === 'income' ? 'text-[#0F6E56]' : 'text-[#993C1D]'}`}>
                    {tx.type === 'income' ? '+' : '-'}{format(tx.amount)}
                  </span>
                  <button onClick={() => handleDelete(tx.id)} className="text-[#6B6882] hover:text-[#993C1D]">
                    <i className="ti ti-trash text-[13px]"></i>
                  </button>
                </div>
              </div>
            )
          })
        }
      </div>

      <AddTransactionModal open={showModal} onClose={() => { setShowModal(false); fetchTransactions() }} />
    </div>
  )
}
