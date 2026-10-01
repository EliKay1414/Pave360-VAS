import * as React from "react"
import { X } from "lucide-react"

export interface RegisterSenderFormData {
  senderHeader: string
  displayName: string
  type: string
  country: string
  status: string
  notes: string
}

interface RegisterSenderModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (formData: RegisterSenderFormData) => void
  isSubmitting?: boolean
}

export const RegisterSenderModal: React.FC<RegisterSenderModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  const [senderHeader, setSenderHeader] = React.useState("")
  const [displayName, setDisplayName] = React.useState("")
  const [type, setType] = React.useState("Alphanumeric")
  const [country, setCountry] = React.useState("GH")
  const [status, setStatus] = React.useState("Pending")
  const [notes, setNotes] = React.useState("")

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!senderHeader.trim()) return
    onSubmit({
      senderHeader: senderHeader.trim(),
      displayName: displayName.trim() || senderHeader.trim(),
      type,
      country: country.trim() || "GH",
      status,
      notes: notes.trim(),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in-0 duration-150 font-sans">
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-[#0c1a2e]">Register Sender ID</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Sender ID */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Sender ID (Alphanumeric Header)
            </label>
            <input
              type="text"
              required
              maxLength={11}
              placeholder="e.g. Pave360"
              value={senderHeader}
              onChange={(e) => setSenderHeader(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0b4d3c] focus:ring-1 focus:ring-[#0b4d3c]"
            />
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Display Name
            </label>
            <input
              type="text"
              placeholder="e.g. Pave360 Platform"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0b4d3c] focus:ring-1 focus:ring-[#0b4d3c]"
            />
          </div>

          {/* Type & Country Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Header Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#0b4d3c] focus:ring-1 focus:ring-[#0b4d3c]"
              >
                <option value="Alphanumeric">Alphanumeric</option>
                <option value="Shortcode">Shortcode</option>
                <option value="Longcode">Longcode</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Country Code
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="GH"
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#0b4d3c] focus:ring-1 focus:ring-[#0b4d3c]"
              />
            </div>
          </div>

          {/* Approval Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Approval Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#0b4d3c] focus:ring-1 focus:ring-[#0b4d3c]"
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Operator Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Operator Notes
            </label>
            <textarea
              rows={3}
              placeholder="Optional justification or regulatory approval note"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0b4d3c] focus:ring-1 focus:ring-[#0b4d3c]"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-[#0b4d3c] hover:bg-[#083a2d] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegisterSenderModal
