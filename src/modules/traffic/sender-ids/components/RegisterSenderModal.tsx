import * as React from "react"
import { X } from "lucide-react"

export interface RegisterSenderFormData {
  senderHeader: string
  displayName: string
  type: string
  country: string
  purpose: string
  documentUrl: string
  notes: string
}

interface RegisterSenderModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (formData: RegisterSenderFormData) => void
  isSubmitting: boolean
}

export const RegisterSenderModal: React.FC<RegisterSenderModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  const [formData, setFormData] = React.useState<RegisterSenderFormData>({
    senderHeader: "",
    displayName: "",
    type: "Alphanumeric",
    country: "GH",
    purpose: "Transactional OTP and account alerts",
    documentUrl: "",
    notes: "",
  })

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.senderHeader.trim()) return
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[1px] animate-in fade-in-0 duration-150">
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Register sender</h2>
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
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="reg-header">
                Sender Header <span className="text-red-500">*</span>
              </label>
              <input
                id="reg-header"
                type="text"
                required
                maxLength={11}
                placeholder="e.g. Pave360"
                value={formData.senderHeader}
                onChange={(e) => setFormData({ ...formData, senderHeader: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005944]/20 focus:border-[#005944]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="reg-display">
                Display Name
              </label>
              <input
                id="reg-display"
                type="text"
                placeholder="e.g. Pave360 Main"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005944]/20 focus:border-[#005944]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="reg-type">
                Type
              </label>
              <select
                id="reg-type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005944]/20 focus:border-[#005944]"
              >
                <option value="Alphanumeric">Alphanumeric (11 chars max)</option>
                <option value="Shortcode">Shortcode (e.g. 3600)</option>
                <option value="Longcode">Longcode (MSISDN)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="reg-country">
                Country
              </label>
              <input
                id="reg-country"
                type="text"
                placeholder="e.g. GH"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005944]/20 focus:border-[#005944]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="reg-purpose">
              Purpose & Regulatory Description
            </label>
            <input
              id="reg-purpose"
              type="text"
              placeholder="e.g. Transactional OTP and account alerts"
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005944]/20 focus:border-[#005944]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="reg-notes">
              Notes
            </label>
            <textarea
              id="reg-notes"
              rows={2}
              placeholder="Additional notes for carrier registration..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005944]/20 focus:border-[#005944]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 pb-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-[#005944] hover:bg-[#004837] text-white text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Registration"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
