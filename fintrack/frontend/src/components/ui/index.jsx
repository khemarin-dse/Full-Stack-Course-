// Button
export function Btn({ children, variant = 'primary', size = 'md', className = '', onClick, type = 'button', disabled }) {
  const base = 'inline-flex items-center gap-1.5 font-medium rounded-[10px] transition-all cursor-pointer border disabled:opacity-50 disabled:cursor-not-allowed'
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-[13px]', lg: 'px-5 py-2.5 text-sm' }
  const variants = {
    primary: 'bg-primary text-white border-primary hover:opacity-90',
    outline: 'bg-transparent border-[#E4E2F0] text-[#6B6882] hover:border-primary hover:text-primary',
    danger: 'bg-[#993C1D] text-white border-[#993C1D] hover:opacity-90',
    'danger-outline': 'bg-transparent border-[#993C1D] text-[#993C1D] hover:bg-[#FAECE7]',
    green: 'bg-[#0F6E56] text-white border-[#0F6E56] hover:opacity-90',
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      {children}
    </button>
  )
}

// Card
export function Card({ children, className = '' }) {
  return <div className={`bg-white border border-[#E4E2F0] rounded-[14px] ${className}`}>{children}</div>
}

// MetricCard
export function MetricCard({ label, value, sub, icon, color = '#1A1730', iconColor }) {
  return (
    <Card className="p-4">
      <div className="text-[11px] text-[#6B6882] mb-2 flex items-center gap-1.5">
        {icon && <i className={`ti ${icon} text-[15px]`} style={{ color: iconColor }}></i>}
        {label}
      </div>
      <div className="text-[24px] font-semibold" style={{ color }}>{value}</div>
      {sub && <div className="text-[11px] text-[#6B6882] mt-1">{sub}</div>}
    </Card>
  )
}

// Badge
export function Badge({ type }) {
  const styles = {
    income: 'bg-[#E1F5EE] text-[#085041]',
    expense: 'bg-[#FAECE7] text-[#712B13]',
  }
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${styles[type] || styles.expense}`}>
      {type === 'income' ? 'Income' : 'Expense'}
    </span>
  )
}

// CatBadge
export function CatBadge({ label }) {
  return (
    <span className="bg-[#F8F8FB] border border-[#E4E2F0] text-[#6B6882] px-2.5 py-0.5 rounded-full text-[11px]">
      {label}
    </span>
  )
}

// ProgressBar
export function ProgressBar({ pct, color }) {
  const capped = Math.min(pct, 100)
  return (
    <div className="h-2 bg-[#F0EFF8] rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${capped}%`, background: color }} />
    </div>
  )
}

// TxIcon
export function TxIcon({ bg, color, icon }) {
  return (
    <div className="w-[30px] h-[30px] rounded-[6px] flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
      <i className={`ti ${icon} text-[14px]`} style={{ color }}></i>
    </div>
  )
}

// PageHeader
export function PageHeader({ title, sub, children }) {
  return (
    <div className="flex justify-between items-start mb-5">
      <div>
        <h1 className="text-[20px] font-semibold text-[#1A1730]">{title}</h1>
        {sub && <p className="text-[13px] text-[#6B6882] mt-0.5">{sub}</p>}
      </div>
      <div className="flex gap-2">{children}</div>
    </div>
  )
}

// Spinner
export function Spinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-8 h-8 border-2 border-[#E4E2F0] border-t-primary rounded-full animate-spin"></div>
    </div>
  )
}

// Empty state
export function Empty({ icon, message }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-[#6B6882]">
      <i className={`ti ${icon} text-[40px] mb-3 opacity-40`}></i>
      <p className="text-[13px]">{message}</p>
    </div>
  )
}
