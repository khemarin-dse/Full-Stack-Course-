import { createContext, useContext, useState, useCallback } from 'react'
import api from '../utils/api'

const FinanceContext = createContext(null)

export function FinanceProvider({ children }) {
  const [transactions, setTransactions] = useState([])
  const [budgets, setBudgets] = useState([])
  const [goals, setGoals] = useState([])
  const [summary, setSummary] = useState({ income: 0, expense: 0, savings: 0, budget_used_pct: 0 })
  const [loadingTx, setLoadingTx] = useState(false)
  const [loadingBudget, setLoadingBudget] = useState(false)
  const [loadingGoals, setLoadingGoals] = useState(false)

  const fetchTransactions = useCallback(async (params = {}) => {
    setLoadingTx(true)
    try {
      const res = await api.get('/transactions', { params })
      setTransactions(res.data.data || res.data)
    } catch (e) { console.error(e) }
    finally { setLoadingTx(false) }
  }, [])

  const fetchSummary = useCallback(async () => {
    try {
      const res = await api.get('/dashboard/summary')
      setSummary(res.data)
    } catch (e) { console.error(e) }
  }, [])

  const fetchBudgets = useCallback(async (params = {}) => {
    setLoadingBudget(true)
    try {
      const res = await api.get('/budgets', { params })
      setBudgets(res.data)
    } catch (e) { console.error(e) }
    finally { setLoadingBudget(false) }
  }, [])

  const fetchGoals = useCallback(async () => {
    setLoadingGoals(true)
    try {
      const res = await api.get('/goals')
      setGoals(res.data)
    } catch (e) { console.error(e) }
    finally { setLoadingGoals(false) }
  }, [])

  const addTransaction = async (data) => {
    const res = await api.post('/transactions', data)
    await Promise.all([fetchTransactions(), fetchSummary(), fetchBudgets(), fetchGoals()])
    return res.data
  }

  const deleteTransaction = async (id) => {
    await api.delete(`/transactions/${id}`)
    await Promise.all([fetchTransactions(), fetchSummary(), fetchBudgets()])
  }

  const addBudget = async (data) => {
    const res = await api.post('/budgets', data)
    await fetchBudgets()
    return res.data
  }

  const updateBudget = async (id, data) => {
    const res = await api.put(`/budgets/${id}`, data)
    await fetchBudgets()
    return res.data
  }

  const deleteBudget = async (id) => {
    await api.delete(`/budgets/${id}`)
    await fetchBudgets()
  }

  const addGoal = async (data) => {
    const res = await api.post('/goals', data)
    await fetchGoals()
    return res.data
  }

  const updateGoal = async (id, data) => {
    const res = await api.put(`/goals/${id}`, data)
    await fetchGoals()
    return res.data
  }

  const deleteGoal = async (id) => {
    await api.delete(`/goals/${id}`)
    await fetchGoals()
  }

  const addMoneyToGoal = async (id, data) => {
    const res = await api.post(`/goals/${id}/add-money`, data)
    await Promise.all([fetchGoals(), fetchTransactions(), fetchSummary()])
    return res.data
  }

  return (
    <FinanceContext.Provider value={{
      transactions, budgets, goals, summary,
      loadingTx, loadingBudget, loadingGoals,
      fetchTransactions, fetchSummary, fetchBudgets, fetchGoals,
      addTransaction, deleteTransaction,
      addBudget, updateBudget, deleteBudget,
      addGoal, updateGoal, deleteGoal, addMoneyToGoal,
    }}>
      {children}
    </FinanceContext.Provider>
  )
}

export const useFinance = () => useContext(FinanceContext)
