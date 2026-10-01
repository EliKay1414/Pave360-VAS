import * as React from "react"
import { X, Send, AlertCircle } from "lucide-react"
import { vasClient } from "../../../../shared/services/vas/vasClient"
import type { InboundMessageItemViewModel } from "../../../../shared/services/vas/types"

interface SimulateInboundModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (simulated: InboundMessageItemViewModel) => void
}

const COMMON_KEYWORDS = ["STOP", "START", "HELP", "INFO", "BAL"]

export const SimulateInboundModal: React.FC<SimulateInboundModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [from, setFrom] = React.useState("233241234567")
  const [to, setTo] = React.useState("PAVE360")
  const [body, setBody] = React.useState("STOP")
  const [carrierMessageId, setCarrierMessageId] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!from.trim()) {
      setError("Sender phone number (From) is required.")
      return
    }
    if (!to.trim()) {
      setError("Destination shortcode/sender (To) is required.")
      return
    }
    if (!body.trim()) {
      setError("Message body is required.")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const simulated = await vasClient.simulateInboundMessage({
        from: from.trim(),
        to: to.trim(),
        body: body.trim(),
        carrierMessageId: carrierMessageId.trim() || undefined,
      })
      onSuccess(simulated)
      onClose()
    } catch (err: any) {
      setError(err?.message || "Failed to simulate inbound message.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs font-sans">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-base font-bold text-[#0c1a2e]">Simulate Inbound SMS</h2>
            <p className="text-xs text-[#5b6e82] mt-0.5">
              Simulate mobile-originated message delivery from a carrier network.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Keywords Chips */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Quick Keywords
            </label>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_KEYWORDS.map((kw) => (
                <button
                  key={kw}
                  type="button"
                  onClick={() => setBody(kw)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
                    body === kw
                      ? "bg-[#0b4d3c] text-white border-[#0b4d3c]"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* From */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                From (MSISDN) *
              </label>
              <input
                type="text"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="233241234567"
                required
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0b4d3c] focus:ring-1 focus:ring-[#0b4d3c]"
              />
            </div>

            {/* To */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                To (Sender ID / Shortcode) *
              </label>
              <input
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="PAVE360"
                required
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0b4d3c] focus:ring-1 focus:ring-[#0b4d3c]"
              />
            </div>
          </div>

          {/* Body */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Message Body *
            </label>
            <textarea
              rows={3}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="e.g. STOP to unsubscribe"
              required
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0b4d3c] focus:ring-1 focus:ring-[#0b4d3c]"
            />
          </div>

          {/* Carrier Message ID (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Carrier Message ID (Optional)
            </label>
            <input
              type="text"
              value={carrierMessageId}
              onChange={(e) => setCarrierMessageId(e.target.value)}
              placeholder="e.g. 2078720061"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0b4d3c] focus:ring-1 focus:ring-[#0b4d3c]"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0b4d3c] hover:bg-[#083a2d] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-60"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{isSubmitting ? "Simulating..." : "Simulate Inbound"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
