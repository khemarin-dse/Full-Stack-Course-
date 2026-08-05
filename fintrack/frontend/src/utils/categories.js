export const EXPENSE_CATEGORIES = [
  { value: 'Housing', icon: 'ti-home', bg: '#EEEDFE', color: '#534AB7' },
  { value: 'Food', icon: 'ti-tools-kitchen-2', bg: '#E1F5EE', color: '#085041' },
  { value: 'Transport', icon: 'ti-car', bg: '#FAEEDA', color: '#854F0B' },
  { value: 'Entertainment', icon: 'ti-device-gamepad-2', bg: '#EEEDFE', color: '#534AB7' },
  { value: 'Utilities', icon: 'ti-device-mobile', bg: '#EEEDFE', color: '#534AB7' },
  { value: 'Healthcare', icon: 'ti-heart', bg: '#FAECE7', color: '#993C1D' },
  { value: 'Education', icon: 'ti-book', bg: '#E1F5EE', color: '#085041' },
  { value: 'Shopping', icon: 'ti-shopping-bag', bg: '#FAEEDA', color: '#854F0B' },
  { value: 'Others', icon: 'ti-dots-circle-horizontal', bg: '#F0EFF8', color: '#6B6882' },
]

export const INCOME_CATEGORIES = [
  { value: 'Salary', icon: 'ti-briefcase', bg: '#E1F5EE', color: '#0F6E56' },
  { value: 'Freelance', icon: 'ti-device-laptop', bg: '#EEEDFE', color: '#534AB7' },
  { value: 'Investment', icon: 'ti-trending-up', bg: '#E1F5EE', color: '#0F6E56' },
  { value: 'Savings', icon: 'ti-piggy-bank', bg: '#E1F5EE', color: '#0F6E56' },
  { value: 'Others', icon: 'ti-dots-circle-horizontal', bg: '#F0EFF8', color: '#6B6882' },
]

export const GOAL_TYPES = [
  { value: 'Vacation', icon: 'ti-beach', bg: '#E1F5EE', color: '#0F6E56' },
  { value: 'Emergency fund', icon: 'ti-shield-check', bg: '#FAECE7', color: '#712B13' },
  { value: 'Electronics', icon: 'ti-device-laptop', bg: '#EEEDFE', color: '#534AB7' },
  { value: 'Vehicle', icon: 'ti-car', bg: '#FAEEDA', color: '#854F0B' },
  { value: 'Education', icon: 'ti-book', bg: '#E1F5EE', color: '#0F6E56' },
  { value: 'Housing', icon: 'ti-home', bg: '#EEEDFE', color: '#534AB7' },
  { value: 'Others', icon: 'ti-target', bg: '#F0EFF8', color: '#6B6882' },
]

export const BUDGET_COLORS = {
  Housing: '#AFA9EC', Food: '#5DCAA5', Transport: '#FAC775',
  Entertainment: '#534AB7', Utilities: '#AFA9EC', Healthcare: '#F0997B',
  Education: '#5DCAA5', Shopping: '#FAC775', Others: '#AFA9EC',
}

export function getCategoryMeta(name, type = 'expense') {
  const list = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
  return list.find(c => c.value === name) || { icon: 'ti-coin', bg: '#F0EFF8', color: '#6B6882' }
}

// Same icon as getCategoryMeta, but the box color is always just one of two
// colors — green for income, orange for expenses — instead of a different
// color per category. Used for transaction list rows.
export function getTxMeta(name, type = 'expense') {
  const list = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
  const entry = list.find(c => c.value === name)
  const icon = entry ? entry.icon : 'ti-coin'
  return type === 'income'
    ? { icon, bg: '#E1F5EE', color: '#0F6E56' }
    : { icon, bg: '#FAEEDA', color: '#854F0B' }
}

export function getGoalMeta(type) {
  return GOAL_TYPES.find(g => g.value === type) || GOAL_TYPES[GOAL_TYPES.length - 1]
}

export function formatCurrency(amount, currency = 'USD') {
  const symbols = { USD: '$', KHR: '៛', EUR: '€', GBP: '£' }
  const rates = { USD: 1, KHR: 4082, EUR: 0.92, GBP: 0.79 }
  const sym = symbols[currency] || '$'
  const converted = amount * (rates[currency] || 1)
  return `${sym}${converted.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: currency === 'KHR' ? 0 : 2 })}`
}
