import { createContext, useContext, useState } from 'react'

const CurrencyContext = createContext(null)

const SYMBOLS = { USD: '$', KHR: '៛', EUR: '€', GBP: '£' }
const RATES   = { USD: 1, KHR: 4082, EUR: 0.92, GBP: 0.79 }

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState('USD')

  const format = (amount) => {
    const sym = SYMBOLS[currency] || '$'
    const converted = Number(amount) * (RATES[currency] || 1)
    const decimals = currency === 'KHR' ? 0 : 0
    return `${sym}${converted.toLocaleString('en-US', { maximumFractionDigits: decimals })}`
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, format, SYMBOLS }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export const useCurrency = () => useContext(CurrencyContext)
