export default function Modal({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-[500px]">
        
        <div className="flex justify-between mb-3">
          <h2 className="font-bold">Update Data</h2>

          <button onClick={onClose} className="text-red-500">
            ✕
          </button>
        </div>

        {children}

      </div>
    </div>
  );
}