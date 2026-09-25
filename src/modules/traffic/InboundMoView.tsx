import * as React from "react"
import { X, RotateCw } from "lucide-react"
import { InboundMessageDetailView } from "./InboundMessageDetailView"

export interface InboundMessage {
  id: string
  from: string
  to: string
  keyword: string
  body: string
  status: "Forwarded" | "Processed" | "Received" | string
  received: string
  notes?: string
}

const STORAGE_KEY = "pave360_vas_inbound_sms"


export function InboundMoView() {
  const [messages, setMessages] = React.useState<InboundMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) return parsed
      }
    } catch {
      // Fallback
    }
    // Default empty array matching screenshot media_1790346270151.png
    return []
  })

  // Selected Message for Detail View
  const [selectedMessage, setSelectedMessage] = React.useState<InboundMessage | null>(null)

  // Direct URL query param synchronization
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const idParam = params.get("messageId") || params.get("id")
    if (idParam) {
      const found = messages.find((m) => m.id === idParam)
      if (found) {
        setSelectedMessage(found)
      } else {
        setSelectedMessage({
          id: idParam,
          from: "0241234567",
          to: "PAVE360",
          keyword: "STOP",
          body: "STOP",
          status: "Processed",
          received: "2026-09-25 14:26:10",
        })
      }
    }
  }, [messages])

  // Browser back/forward button support
  React.useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search)
      const idParam = params.get("messageId") || params.get("id")
      if (idParam) {
        const found = messages.find((m) => m.id === idParam)
        setSelectedMessage(
          found || {
            id: idParam,
            from: "0241234567",
            to: "PAVE360",
            keyword: "STOP",
            body: "STOP",
            status: "Processed",
            received: "2026-09-25 14:26:10",
          }
        )
      } else {
        setSelectedMessage(null)
      }
    }
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [messages])

  const handleOpenMessage = (msg: InboundMessage) => {
    setSelectedMessage(msg)
    const url = new URL(window.location.href)
    url.searchParams.set("messageId", msg.id)
    window.history.pushState({}, "", url.toString())
  }

  const handleBackFromDetail = () => {
    setSelectedMessage(null)
    const url = new URL(window.location.href)
    url.searchParams.delete("messageId")
    url.searchParams.delete("id")
    window.history.pushState({}, "", url.pathname + (url.search ? url.search : ""))
  }

  // Modal State
  const [isSimulateOpen, setIsSimulateOpen] = React.useState(false)

  // Form Fields matching screenshot media_1790346276012.png
  const [fromValue, setFromValue] = React.useState("0241234567")
  const [toValue, setToValue] = React.useState("PAVE360")
  const [bodyValue, setBodyValue] = React.useState("STOP")

  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Persist messages to localStorage
  const saveMessages = (newMessages: InboundMessage[]) => {
    setMessages(newMessages)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newMessages))
    } catch {
      // Ignore
    }
  }

  // Handle Simulate Inbound Submission
  const handleSimulateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!fromValue.trim() || !toValue.trim()) return

    setIsSubmitting(true)

    // Format current timestamp YYYY-MM-DD HH:mm:ss
    const now = new Date()
    const pad = (n: number) => n.toString().padStart(2, "0")
    const received = `${now.getUTCFullYear()}-${pad(now.getUTCMonth() + 1)}-${pad(
      now.getUTCDate()
    )} ${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(
      now.getUTCSeconds()
    )}`

    // Extract keyword (first word uppercase)
    const trimmedBody = bodyValue.trim()
    const firstWord = trimmedBody.split(/\s+/)[0] || ""
    const keyword = firstWord ? firstWord.toUpperCase() : "—"

    // Generate standard inb_ ID
    const randomHex = () =>
      Math.random().toString(16).substring(2, 10)
    const newId = `inb_${randomHex()}${randomHex()}`

    const newMessage: InboundMessage = {
      id: newId,
      from: fromValue.trim(),
      to: toValue.trim(),
      keyword,
      body: trimmedBody,
      status: "Forwarded",
      received,
    }

    setTimeout(() => {
      saveMessages([newMessage, ...messages])
      setIsSubmitting(false)
      setIsSimulateOpen(false)
      // Reset form to defaults
      setFromValue("0241234567")
      setToValue("PAVE360")
      setBodyValue("STOP")
    }, 200)
  }

  // Clear all simulated messages
  const handleClearMessages = () => {
    if (window.confirm("Clear all simulated inbound messages?")) {
      saveMessages([])
    }
  }

  // If a message is selected, render the dedicated InboundMessageDetailView matching media_1790347132272.png
  if (selectedMessage) {
    return (
      <InboundMessageDetailView
        message={selectedMessage}
        onBack={handleBackFromDetail}
      />
    )
  }

  return (
    <div className="space-y-4 font-sans select-none pb-8">
      {/* 1. Subheader: Page Description & Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <p className="text-[13.5px] text-[#5b6e82] font-normal leading-normal">
          Mobile-originated messages (STOP/START/HELP and replies).
        </p>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          {messages.length > 0 && (
            <button
              type="button"
              onClick={handleClearMessages}
              className="px-3 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Clear messages
            </button>
          )}

          {/* Simulate Inbound Button matching screenshot */}
          <button
            type="button"
            onClick={() => setIsSimulateOpen(true)}
            className="px-4 py-2 bg-[#005944] hover:bg-[#004837] text-white text-[13px] font-semibold rounded-lg shadow-xs transition-colors cursor-pointer inline-flex items-center gap-2"
          >
            <span>Simulate inbound</span>
          </button>
        </div>
      </div>

      {/* 2. Inbound Messages Data Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden mt-3">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-white">
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  ID
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  FROM
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  TO
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  KEYWORD
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  BODY
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  STATUS
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  RECEIVED
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {messages.length > 0 ? (
                messages.map((msg) => (
                  <tr key={msg.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* ID */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleOpenMessage(msg)}
                        className="font-mono text-xs font-semibold text-[#0070f3] hover:underline cursor-pointer text-left"
                      >
                        {msg.id}
                      </button>
                    </td>

                    {/* From */}
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-slate-800 font-medium">
                      {msg.from}
                    </td>

                    {/* To */}
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-xs text-slate-900">
                      {msg.to}
                    </td>

                    {/* Keyword */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700 font-mono">
                        {msg.keyword}
                      </span>
                    </td>

                    {/* Body */}
                    <td className="px-6 py-4 text-xs text-slate-800 max-w-xs truncate select-text">
                      {msg.body}
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#eefaf3] text-[#059669] border border-[#a7f3d0]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                        {msg.status}
                      </span>
                    </td>

                    {/* Received */}
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-slate-600">
                      {msg.received}
                    </td>
                  </tr>
                ))
              ) : (
                /* Empty state matching screenshot media_1790346270151.png */
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-20 text-center text-[13.5px] text-[#5b6e82] font-normal"
                  >
                    No inbound messages.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Simulate Inbound Modal matching screenshot media_1790346276012.png */}
      {isSimulateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[1px] animate-in fade-in-0 duration-150 font-sans">
          <div className="relative w-full max-w-120 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-6 space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-1">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Simulate inbound
              </h3>
              <button
                type="button"
                onClick={() => setIsSimulateOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSimulateSubmit} className="space-y-4">
              {/* Field: From */}
              <div>
                <label
                  htmlFor="inbound-from"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  From
                </label>
                <input
                  id="inbound-from"
                  type="text"
                  required
                  value={fromValue}
                  onChange={(e) => setFromValue(e.target.value)}
                  className="w-full h-10 px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#005944] text-slate-900"
                  placeholder="0241234567"
                />
              </div>

              {/* Field: To */}
              <div>
                <label
                  htmlFor="inbound-to"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  To
                </label>
                <input
                  id="inbound-to"
                  type="text"
                  required
                  value={toValue}
                  onChange={(e) => setToValue(e.target.value)}
                  className="w-full h-10 px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#005944] text-slate-900"
                  placeholder="PAVE360"
                />
              </div>

              {/* Field: Body */}
              <div>
                <label
                  htmlFor="inbound-body"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Body
                </label>
                <textarea
                  id="inbound-body"
                  rows={4}
                  required
                  value={bodyValue}
                  onChange={(e) => setBodyValue(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#005944] text-slate-900 resize-y"
                  placeholder="STOP"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsSimulateOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#005944] hover:bg-[#004837] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  {isSubmitting && <RotateCw className="h-3.5 w-3.5 animate-spin" />}
                  <span>Receive</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default InboundMoView
