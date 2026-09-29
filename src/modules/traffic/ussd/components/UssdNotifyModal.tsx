import * as React from "react"
import { X, Send } from "lucide-react"

export interface UssdNotifyFormData {
  msisdn: string
  messageText: string
  waitAck: boolean
}

interface UssdNotifyModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: UssdNotifyFormData) => void
  isSubmitting: boolean
  errorMessage?: string | null
}

export const UssdNotifyModal: React.FC<UssdNotifyModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  errorMessage,
}) => {
  const [msisdn, setMsisdn] = React.useState("0241234567")
  const [messageText, setMessageText] = React.useState("")
  const [waitAck, setWaitAck] = React.useState(false)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!msisdn.trim() || !messageText.trim()) return
    onSubmit({ msisdn, messageText, waitAck })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[1px] animate-in fade-in-0 duration-150">
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Send USSD notification</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Dispatches a network-initiated flash push directly onto the recipient handset.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {errorMessage && (
          <div className="mx-6 mt-2 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="px-6 py-3 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="notify-msisdn">
              Recipient MSISDN <span className="text-red-500">*</span>
            </label>
            <input
              id="notify-msisdn"
              type="text"
              required
              placeholder="e.g. 0241234567 or 233241234567"
              value={msisdn}
              onChange={(e) => setMsisdn(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005944]/20 focus:border-[#005944]"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-slate-700" htmlFor="notify-message">
                Notification Text <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">{messageText.length} / 160</span>
            </div>
            <textarea
              id="notify-message"
              required
              rows={4}
              maxLength={160}
              placeholder="e.g. Dear customer, your balance is GHS 45.00. Ref: P360"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005944]/20 focus:border-[#005944]"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="notify-ack"
              type="checkbox"
              checked={waitAck}
              onChange={(e) => setWaitAck(e.target.checked)}
              className="h-4 w-4 text-[#005944] rounded border-slate-300 focus:ring-[#005944]"
            />
            <label htmlFor="notify-ack" className="text-xs font-medium text-slate-700 select-none cursor-pointer">
              Wait for handset user dismissal acknowledgment (ACK)
            </label>
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
              className="px-4 py-2 bg-[#005944] hover:bg-[#004837] text-white text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {isSubmitting ? "Dispatching..." : "Send push alert"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
