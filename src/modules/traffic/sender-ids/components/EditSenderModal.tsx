import * as React from "react"
import { X } from "lucide-react"
import type { SenderIdRecord } from "./SenderIdsTable"

interface EditSenderModalProps {
  sender: SenderIdRecord | null
  isOpen: boolean
  onClose: () => void
  onSubmit: (updated: SenderIdRecord) => void
  onDelete: (id: string) => void
}

export const EditSenderModal: React.FC<EditSenderModalProps> = ({
  sender,
  isOpen,
  onClose,
  onSubmit,
  onDelete,
}) => {
  const [form, setForm] = React.useState<SenderIdRecord | null>(sender)

  React.useEffect(() => {
    setForm(sender)
  }, [sender])

  if (!isOpen || !form) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.senderHeader.trim()) return
    onSubmit(form)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[1px] animate-in fade-in-0 duration-150">
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Edit sender ID</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="edit-header">
                Sender Header
              </label>
              <input
                id="edit-header"
                type="text"
                required
                value={form.senderHeader}
                onChange={(e) => setForm({ ...form, senderHeader: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005944]/20 focus:border-[#005944]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="edit-display">
                Display Name
              </label>
              <input
                id="edit-display"
                type="text"
                value={form.displayName}
                onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005944]/20 focus:border-[#005944]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="edit-type">
                Type
              </label>
              <select
                id="edit-type"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005944]/20 focus:border-[#005944]"
              >
                <option value="Alphanumeric">Alphanumeric</option>
                <option value="Shortcode">Shortcode</option>
                <option value="Longcode">Longcode</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="edit-status">
                Status
              </label>
              <select
                id="edit-status"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005944]/20 focus:border-[#005944]"
              >
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="edit-notes">
              Notes
            </label>
            <textarea
              id="edit-notes"
              rows={2}
              value={form.notes || ""}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005944]/20 focus:border-[#005944]"
            />
          </div>

          <div className="flex items-center justify-between pt-3 pb-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => onDelete(form.id)}
              className="px-3.5 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            >
              Delete
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#005944] hover:bg-[#004837] text-white text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Save changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
