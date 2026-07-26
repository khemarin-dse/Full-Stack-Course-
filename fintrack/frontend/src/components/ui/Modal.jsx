import { useEffect } from 'react'

export default function Modal({ open, onClose, title, children, width = '440px' }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="bg-white rounded-[14px] border border-[#E4E2F0] fade-up shadow-xl"
        style={{ width, maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto' }}
      >
        <div className="flex justify-between items-center px-6 pt-6 pb-4">
          <h2 className="text-[16px] font-semibold text-[#1A1730]">{title}</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-[6px] border border-[#E4E2F0] flex items-center justify-center text-[#6B6882] hover:bg-[#F0EFF8] transition-all"
          >
            <i className="ti ti-x text-[16px]"></i>
          </button>
        </div>
        <div className="px-6 pb-6">{children}</div>
      </div>
    </div>
  )
}
