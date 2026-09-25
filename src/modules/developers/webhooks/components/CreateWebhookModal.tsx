import * as React from "react"
import { X } from "lucide-react"
import { EVENT_TYPES, type WebhookRecord } from "../types"

interface CreateWebhookModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (webhook: WebhookRecord) => void
}

export function CreateWebhookModal({
  isOpen,
  onClose,
  onCreate,
}: CreateWebhookModalProps) {
  const [name, setName] = React.useState("")
  const [url, setUrl] = React.useState("")
  const [secret, setSecret] = React.useState("")
  const [eventType, setEventType] = React.useState<string>("DeliveryReport")
  const [maxAttempts, setMaxAttempts] = React.useState("5")
  const [timeoutSeconds, setTimeoutSeconds] = React.useState("10")
  const [enabled, setEnabled] = React.useState(true)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newRecord: WebhookRecord = {
      id: `wh_${Date.now()}`,
      name: name.trim() || "Delivery Status Callback",
      url: url.trim() || "https://example.com/webhooks/pave360",
      event: eventType,
      secret: secret.trim(),
      status: enabled ? "Active" : "Disabled",
      failures: 0,
      maxAttempts: parseInt(maxAttempts, 10) || 5,
      timeoutSeconds: parseInt(timeoutSeconds, 10) || 10,
      enabled,
      createdAt: new Date().toISOString(),
    }

    onCreate(newRecord)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-200 cursor-pointer"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden relative z-10 animate-in fade-in-50 zoom-in-95 duration-150">
          {/* Header */}
          <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-base font-bold text-[#0c1a2e]">
              Create webhook
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 px-3.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-[#005944] focus:ring-1 focus:ring-[#005944]"
              />
            </div>

            {/* Url */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Url
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/webhooks/pave360"
                className="w-full h-10 px-3.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#005944] focus:ring-1 focus:ring-[#005944]"
              />
            </div>

            {/* Secret */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Secret
              </label>
              <input
                type="text"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="Optional signing secret"
                className="w-full h-10 px-3.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#005944] focus:ring-1 focus:ring-[#005944]"
              />
            </div>

            {/* EventType & MaxAttempts row matching media_1790356813913.png */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  EventType
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full h-10 px-3.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-[#005944] focus:ring-1 focus:ring-[#005944] cursor-pointer"
                >
                  {EVENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  MaxAttempts
                </label>
                <input
                  type="number"
                  value={maxAttempts}
                  onChange={(e) => setMaxAttempts(e.target.value)}
                  className="w-full h-10 px-3.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-[#005944] focus:ring-1 focus:ring-[#005944]"
                />
              </div>
            </div>

            {/* TimeoutSeconds & Enabled row matching screenshot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-center">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  TimeoutSeconds
                </label>
                <input
                  type="number"
                  value={timeoutSeconds}
                  onChange={(e) => setTimeoutSeconds(e.target.value)}
                  className="w-full h-10 px-3.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-[#005944] focus:ring-1 focus:ring-[#005944]"
                />
              </div>

              <div className="pt-6">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => setEnabled(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-[#0070f3] focus:ring-[#0070f3] cursor-pointer"
                  />
                  <span className="text-xs font-medium text-slate-800">
                    Enabled
                  </span>
                </label>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-5 py-2 bg-[#005944] hover:bg-[#004837] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
