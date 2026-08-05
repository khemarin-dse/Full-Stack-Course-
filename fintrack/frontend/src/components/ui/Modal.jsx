import { useEffect } from 'react'

export default function Modal({ open, onClose, title, children, width = '440px' }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    if (open) {
      document.addEventListener('keydown', handler)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="bg-white rounded-[14px] border border-[#E4E2F0] shadow-xl fade-up w-full"
        style={{ maxWidth: width, maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Modal header */}
        <div className="flex justify-between items-center px-5 pt-5 pb-4 border-b border-[#E4E2F0]">
          <h2 className="text-[16px] font-semibold text-[#1A1730]">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-[8px] border border-[#E4E2F0] flex items-center justify-center text-[#6B6882] hover:bg-[#F0EFF8] hover:text-[#1A1730] transition-all flex-shrink-0"
            type="button"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Modal body */}
        <div className="px-5 py-4">
          {children}
        </div>
      </div>
    </div>
  )
}
